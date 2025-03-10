// Monkey-patch Math.pow to support BigInt when both arguments are BigInts.
const originalMathPow = Math.pow;
Math.pow = function (base, exponent) {
  if (typeof base === 'bigint' && typeof exponent === 'bigint') {
    return base ** exponent; // Use BigInt exponentiation operator.
  }
  return originalMathPow(base, exponent);
};

import { Lucid } from 'lucid-cardano';
import { logger } from '../../services/logger';
import { ExpectedTrade, Transaction } from './Sundaeswap.config';
import { BigNumber } from 'bignumber.js'; // For precise calculations
import { Cardano, CardanoTokenInfo } from '../../chains/cardano/cardano';

import {
  EDatumType,
  ESwapType,
  IDepositConfigArgs,
  ISwapConfigArgs,
  QueryProviderSundaeSwap,
  TSupportedNetworks,
  ITxBuilderFees,
} from '@sundaeswap/core';
import {
  TxBuilderLucidV3,
  DatumBuilderLucidV3,
  TxBuilderLucidV1,
  DatumBuilderLucidV1,
} from '@sundaeswap/core/lucid';
import { AssetAmount, IAssetAmountMetadata } from '@sundaeswap/asset';

export class Sundaeswap {
  private static _instances: { [name: string]: Sundaeswap };

  constructor(network: string) {
    logger.info('Sundaeswap Network', network);
  }

  public static getInstance(network: string): Sundaeswap {
    if (Sundaeswap._instances === undefined) {
      this._instances = {};
    }
    if (!(network in this._instances)) {
      this._instances[network] = new Sundaeswap(network);
    }
    return this._instances[network];
  }

  public async init() {}

  public ready(): boolean {
    return true;
  }

  /**
   * Given the desired net amount of base token (e.g., 100 SBERRY) to receive,
   * calculate the amount of quote token (ADA) required.
   * If poolData is already provided, it will be used.
   */
  async estimateBuyTrade(
    amount: string,
    queryProvider: any,
    sundaeswapPoolId: string,
    decimal: number,
    base: CardanoTokenInfo,
    quote: CardanoTokenInfo,
    poolData?: any,
  ): Promise<ExpectedTrade> {
    if (!poolData) {
      poolData = await this.getPoolData(sundaeswapPoolId, queryProvider);
    }
    const assetA = poolData.assetA.assetId.trim();
    const assetB = poolData.assetB.assetId.trim();
    const fee = new BigNumber(poolData.currentFee);

    // Validate base and quote assets
    const isBaseCorrect =
      (base.policyId + '.' + base.assetName).trim() === assetB;
    const isQuoteADA =
      (quote.policyId + '.' + quote.assetName).trim() === assetA;
    if (!isBaseCorrect) throw new Error('Invalid base token');
    if (!isQuoteADA) throw new Error('Quote must be ADA');

    // Get reserves
    const baseReserve = new BigNumber(poolData.liquidity.bReserve);
    const quoteReserve = new BigNumber(poolData.liquidity.aReserve);

    // Convert base amount to smallest units (e.g., lovelace)
    const baseAmount = new BigNumber(amount).times(10 ** decimal);

    // AMM calculation
    const numerator = quoteReserve.times(baseAmount);
    const denominator = baseReserve.minus(baseAmount);
    let quoteAmount = numerator.div(denominator);

    // Apply pool fee (0.3%)
    quoteAmount = quoteAmount.div(new BigNumber(1).minus(fee));

    // Add SundaeSwap protocol fees (example values - adjust based on actual fees)
    const quoteDecimal = quote.decimals; // ADA has 6 decimals
    const sundaeProtocolFee = new BigNumber(1.28).times(10 ** quoteDecimal); // 1.28 ADA
    const depositFee = new BigNumber(2).times(10 ** quoteDecimal); // 2 ADA deposit
    const txFee = new BigNumber(0.4).times(10 ** quoteDecimal); // 0.4 ADA network fee
    const liquidityProviderFee = quoteAmount.times(0.003);
    // console.log('liquidityProviderFee', liquidityProviderFee.toString());

    // Sum additional fees
    const totalFees = sundaeProtocolFee
      .plus(depositFee)
      .plus(txFee)
      .plus(liquidityProviderFee);
    quoteAmount = quoteAmount.plus(totalFees);

    // Convert back to ADA units
    const expectedAmount = quoteAmount.div(10 ** quoteDecimal).toFixed(6);

    return {
      expectedAmount,
      rawAmount: quoteAmount.toFixed(0),
    };
  }

  async estimateSellTrade(
    amount: string,
    queryProvider: any,
    sundaeswapPoolId: string,
    decimal: number,
    base: CardanoTokenInfo,
    quote: CardanoTokenInfo,
  ): Promise<ExpectedTrade> {
    const poolData = await this.getPoolData(sundaeswapPoolId, queryProvider);
    const assetA = poolData.assetA.assetId.trim();
    const assetB = poolData.assetB.assetId.trim();
    const fee = new BigNumber(poolData.currentFee); // e.g. 0.005

    // Validate tokens – expect base = SBERRY and quote = ADA.
    const isBaseSBERRY_OR_SUNDAE =
      (base.policyId + '.' + base.assetName).trim() === assetB;
    const isQuoteADA =
      (quote.policyId + '.' + quote.assetName).trim() === assetA;
    if (!isBaseSBERRY_OR_SUNDAE) {
      throw new Error('Base token must be SBERRY or SUNDAE in this trade.');
    }
    if (!isQuoteADA) {
      throw new Error('Quote token must be ADA in this trade.');
    }

    // For SELL trades, the user is selling base tokens.
    const baseAmount = new BigNumber(amount);
    const amountWithFee = baseAmount.multipliedBy(new BigNumber(1).minus(fee));
    const baseReserve = new BigNumber(poolData.liquidity.bReserve);
    const quoteReserve = new BigNumber(poolData.liquidity.aReserve);
    const receivedQuote = quoteReserve
      .multipliedBy(amountWithFee)
      .dividedBy(baseReserve.plus(amountWithFee));
    const expectedAmount = receivedQuote.dividedBy(10 ** decimal);

    return {
      expectedAmount: expectedAmount.toFixed(6),
      rawAmount: receivedQuote.toFixed(0),
    };
  }

  /**
   * Execute a trade. For a BUY, the `amount` represents the desired SBERRY (base) tokens.
   * The function calculates the required ADA using estimateBuyTrade (without fetching poolData again).
   * For a SELL, the `amount` is the SBERRY tokens to sell.
   */
  async executeTrade(
    lucidInstance: Lucid,
    cardanoish: Cardano,
    network: TSupportedNetworks,
    amount: string,
    address: string,
    side: string,
    base: CardanoTokenInfo,
    quote: CardanoTokenInfo,
  ): Promise<Transaction> {
    // console.log(`Executing trade: ${amount} ${side}`);

    // Validate tokens
    if (base.symbol !== 'SBERRY' || quote.symbol !== 'ADA') {
      throw new Error(
        'Invalid token pair. base must be SBERRY or Sundae and quote must be ADA.',
      );
    }

    const queryProvider = new QueryProviderSundaeSwap(network);
    // Fetch pool data only once.
    const poolData = await this.getPoolData(
      cardanoish.sundaeswapPoolId,
      queryProvider,
    );
    const baseDecimal = base.decimals;
    const quoteDecimal = quote.decimals; // ADA has 6 decimals

    let suppliedAsset;
    if (side.toUpperCase() === 'BUY') {
      // Validate pool data
      if (!poolData?.liquidity?.aReserve || !poolData?.liquidity?.bReserve) {
        throw new Error('Invalid pool reserves');
      }

      // Convert amount to BigNumber
      const amountBN = new BigNumber(amount);

      // Calculate price of SBERRY
      const priceOfToken = new BigNumber(poolData.liquidity.aReserve).dividedBy(
        poolData.liquidity.bReserve,
      );
      // console.log('priceOfToken', priceOfToken.toFixed());

      // Calculate estimated Lovelace amount required
      const estimatedLovelace = priceOfToken.times(amountBN);
      // console.log('estimatedLovelace', estimatedLovelace.toFixed());

      // Add transaction fees
      const sundaeProtocolFee = new BigNumber(1.28);
      const depositFee = new BigNumber(2);
      const txFee = new BigNumber(0.4);
      const liquidityProviderFee = estimatedLovelace.times(0.003);
      // console.log('liquidityProviderFee', liquidityProviderFee.toString());

      const totalFees = txFee
        .plus(sundaeProtocolFee)
        .plus(depositFee)
        .plus(liquidityProviderFee);
      // console.log('Total Fees:', totalFees.toFixed());

      // Final ADA amount required
      const finalLovelaceAmount = estimatedLovelace.plus(totalFees);
      // console.log(
      //   'Final finalLovelaceAmount Amount:',
      //   finalLovelaceAmount.toFixed(),
      // );

      // Convert to BigInt for on-chain transaction
      const adaRawAmount = BigInt(finalLovelaceAmount.toFixed(0));
      // console.log('adaRawAmount', adaRawAmount);

      suppliedAsset = new AssetAmount(adaRawAmount, poolData.assetA);
    } else if (side.toUpperCase() === 'SELL') {
      // For a SELL, amount is the SBERRY tokens to sell.
      const baseAmountBN = new BigNumber(amount).multipliedBy(
        10 ** baseDecimal,
      );
      const baseRawAmount = BigInt(baseAmountBN.toFixed(0));
      // For a SELL, supplied asset is SBERRY (base).
      suppliedAsset = new AssetAmount(baseRawAmount, poolData.assetB);
    } else {
      throw new Error('Invalid trade side. Use BUY or SELL.');
    }

    const args: ISwapConfigArgs = {
      swapType: {
        type: ESwapType.MARKET,
        slippage: 0.03, // 3% slippage tolerance
      },
      pool: poolData,
      orderAddresses: {
        DestinationAddress: {
          address: address,
          datum: { type: EDatumType.NONE },
        },
      },
      suppliedAsset: suppliedAsset,
    };

    const txBuilder = new TxBuilderLucidV3(
      lucidInstance,
      new DatumBuilderLucidV3(network),
    );
    const result = await txBuilder.swap({ ...args });
    // console.log(result);

    const builtTx = await result.build();
    // console.log(builtTx);

    const { submit } = await builtTx.sign();
    const txHash = await submit();
    console.log('Transaction Hash:', txHash);

    return {
      hash: txHash,
      to: address,
      rawAmount: suppliedAsset.amount,
    };
  }

  async addPosition(
    lucidInstance: Lucid,
    cardanoish: Cardano,
    network: TSupportedNetworks,
    token0: CardanoTokenInfo,
    token1: CardanoTokenInfo,
    amount0: string,
    amount1: string,
    address: string,
  ): Promise<Transaction> {
    // console.log('Add liquidity function called');

    // Validate tokens
    if (token0.symbol !== 'SBERRY' || token1.symbol !== 'ADA') {
      throw new Error(
        'Invalid token pair. token0 must be SBERRY and token1 must be ADA.',
      );
    }

    // Convert amounts to correct decimal values amount0 is SBERRY/SUNDAE and amount1 is ADA
    const adjustedAmount0 = BigInt(
      BigNumber(amount0)
        .times(10 ** token0.decimals)
        .toFixed(0),
    );
    const adjustedAmount1 = BigInt(
      BigNumber(amount1)
        .times(10 ** token1.decimals)
        .toFixed(0),
    );
    // console.log('adjustedAmount0', adjustedAmount0);
    // console.log('adjustedAmount1', adjustedAmount1);

    // console.log('Working upto here!');

    const queryProvider = new QueryProviderSundaeSwap(network);
    const poolData = await this.getPoolData(
      cardanoish.sundaeswapPoolId,
      queryProvider,
    );

    // console.log('Working upto here!!');

    const depositArgs: IDepositConfigArgs = {
      suppliedAssets: [
        new AssetAmount(adjustedAmount1, poolData.assetA),
        new AssetAmount(adjustedAmount0, poolData.assetB),
      ] as [
        AssetAmount<IAssetAmountMetadata>,
        AssetAmount<IAssetAmountMetadata>,
      ], // Explicit tuple
      pool: poolData,
      orderAddresses: {
        DestinationAddress: {
          address: address,
          datum: {
            type: EDatumType.NONE,
          },
        },
      },
    };

    // console.log('Working upto here!!!');

    const txBuilder = new TxBuilderLucidV3(
      lucidInstance,
      new DatumBuilderLucidV3(network),
    );

    const result = await txBuilder.deposit({ ...depositArgs });
    // console.log(result);

    const builtTx = await result.build();
    // console.log(builtTx);

    const { submit } = await builtTx.sign();
    // console.log(submit);

    const txHash = await submit();
    console.log('Transaction Hash:', txHash);

    // console.log('Working upto here!!!!');
    return {
      hash: txHash,
      to: address,
      rawAmount: adjustedAmount0,
    };
  }

  async reducePosition(
    lucidInstance: Lucid,
    cardanoish: Cardano,
    network: TSupportedNetworks,
    address: string,
    lpAmountInWallet: string,
    decreasePercent: number,
  ): Promise<Transaction> {
    const queryProvider = new QueryProviderSundaeSwap(network);
    const poolData = await queryProvider.findPoolData({
      ident: cardanoish.sundaeswapPoolId,
    });

    // Calculate how much LP token will be withdrawn based on the percentage
    const withdrawalAmount = BigInt(
      (BigInt(lpAmountInWallet) * BigInt(decreasePercent)) / BigInt(100),
    );
    // console.log('withdrawalAmount', withdrawalAmount);

    // Define the LP Token to withdraw
    const lpTokenAmount = new AssetAmount(withdrawalAmount, poolData.assetLP); // Specify LP token amount
    // console.log(lpTokenAmount);

    // Build withdraw arguments (Added `pool` property)
    const withdrawArgs = {
      suppliedLPAsset: lpTokenAmount,
      pool: poolData,
      orderAddresses: {
        DestinationAddress: {
          address: address,
          datum: {
            type: EDatumType.NONE,
            value: '',
          },
        },
      },
    };

    // Initialize transaction builder
    const txBuilder = new TxBuilderLucidV3(
      lucidInstance,
      new DatumBuilderLucidV3(network),
    );

    // Execute withdrawal transaction
    const result = await txBuilder.withdraw({ ...withdrawArgs });

    // Build the transaction
    const builtTx = await result.build();
    // Sign and submit the transaction
    const { submit, cbor } = await builtTx.sign();
    const txHash = await submit();

    console.log('Liquidity Withdrawal Transaction Hash:', txHash);

    return {
      hash: txHash,
      to: address,
      rawAmount: withdrawalAmount,
    };
  }

  async poolPrice(
    cardanoish: Cardano,
    network: TSupportedNetworks,
    period: number = 1,
    interval: number = 1,
  ): Promise<{ prices: string[]; pools: string }> {
    const fetchPriceTime = [];
    const prices: string[] = [];

    for (
      let x = Math.ceil(period / interval) * interval;
      x >= 0;
      x -= interval
    ) {
      fetchPriceTime.push(x);
    }

    const queryProvider = new QueryProviderSundaeSwap(network);
    const sundaeswapPoolId = cardanoish.sundaeswapPoolId;

    const poolData = await this.getPoolData(sundaeswapPoolId, queryProvider);
    const baseReserve = new BigNumber(poolData.liquidity.bReserve);
    const quoteReserve = new BigNumber(poolData.liquidity.aReserve);

    for (let i = 0; i < fetchPriceTime.length - 1; i++) {
      const price = quoteReserve.dividedBy(baseReserve).dividedBy(10 ** 6);
      prices.push(price.toFixed(6));
    }
    return { prices, pools: sundaeswapPoolId };
  }

  async getPoolData(ident: string, queryProvider: any) {
    try {
      const result = await queryProvider.findPoolData({ ident });
      if (!result || !result.liquidity) throw new Error('Invalid pool data');
      return result;
    } catch (error) {
      console.error('Error fetching pool data:', error);
      throw new Error('Failed to fetch pool data');
    }
  }
}
