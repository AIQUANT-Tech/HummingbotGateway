import { Cardano, CardanoTokenInfo } from '../../chains/cardano/cardano';
import { Sundaeswap } from './sundaeswap';
import { ConfigManagerV2 } from '../../services/config-manager-v2';
import { Transaction } from './Sundaeswap.config';
import {
  PriceRequest,
  PriceResponse,
  TradeRequest,
  TradeResponse,
  AddLiquidityRequest,
  AddLiquidityResponse,
  RemoveLiquidityRequest,
  RemoveLiquidityResponse,
  PoolPriceRequest,
  PoolPriceResponse,
} from '../../amm/amm.requests';

import Decimal from 'decimal.js-light';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import {
  ETxBuilderType,
  ISundaeSDKOptions,
  SundaeSDK,
  ESwapType,
  EDatumType,
  EContractVersion,
  QueryProviderSundaeSwap,
  TSupportedNetworks,
  ISwapConfigArgs,
} from '@sundaeswap/core';

import { TxBuilderLucidV3, DatumBuilderLucidV3 } from '@sundaeswap/core/lucid';

import {
  Address,
  Blockfrost,
  Constr,
  Data,
  Lucid,
  Network,
  TxComplete,
  UTxO,
  OutRef,
  Tx,
} from 'lucid-cardano';

import {
  HttpException,
  LOAD_WALLET_ERROR_CODE,
  LOAD_WALLET_ERROR_MESSAGE,
  TOKEN_NOT_SUPPORTED_ERROR_CODE,
  TOKEN_NOT_SUPPORTED_ERROR_MESSAGE,
  PRICE_FAILED_ERROR_CODE,
  PRICE_FAILED_ERROR_MESSAGE,
  TRADE_FAILED_ERROR_CODE,
  TRADE_FAILED_ERROR_MESSAGE,
  UNKNOWN_ERROR_ERROR_CODE,
  UNKNOWN_ERROR_MESSAGE,
} from '../../services/error-handler';

import { AssetAmount } from '@sundaeswap/asset';

import { TradeInfo, ExpectedTrade } from './Sundaeswap.config';

export async function getTradeInfo(
  cardanoish: Cardano,
  sundaeswapish: Sundaeswap,
  baseAsset: string,
  quoteAsset: string,
  baseAmount: string,
  tradeSide: string,
  network: TSupportedNetworks,
): Promise<TradeInfo> {
  const baseToken = cardanoish.getTokenForSymbol(baseAsset);
  const quoteToken = cardanoish.getTokenForSymbol(quoteAsset);
  const baseTokenAddress = cardanoish.getTokenAddress(baseAsset);
  const quoteTokenAddress = cardanoish.getTokenAddress(quoteAsset);

  const queryProvider = new QueryProviderSundaeSwap(network);
  let expectedTrade: ExpectedTrade;
  try {
    if (tradeSide === 'BUY') {
      expectedTrade = await sundaeswapish.estimateBuyTrade(
        baseAmount,
        queryProvider,
        cardanoish.sundaeswapPoolId,
        baseToken[0]?.decimals,
        baseToken[0],
        quoteToken[0],
      );
    } else {
      expectedTrade = await sundaeswapish.estimateSellTrade(
        baseAmount,
        queryProvider,
        cardanoish.sundaeswapPoolId,
        baseToken[0]?.decimals,
        baseToken[0],
        quoteToken[0],
      );
    }
  } catch (error) {
    throw new HttpException(
      500,
      `Failed to estimate trade: ${error}`,
      TRADE_FAILED_ERROR_CODE,
    );
  }

  return {
    baseToken,
    quoteToken,
    requestAmount: baseAmount,
    expectedTrade,
    baseTokenAddress,
    quoteTokenAddress,
  };
}

export async function price(
  cardanoish: Cardano,
  sundaeswapish: Sundaeswap,
  req: PriceRequest,
): Promise<PriceResponse> {
  const startTimestamp: number = Date.now();
  // console.log(
  //   'MY connector Sundaeswap is reached---------------',
  //   sundaeswapish,
  // );
  let tradeInfo: TradeInfo;

  try {
    tradeInfo = await getTradeInfo(
      cardanoish,
      sundaeswapish,
      req.base,
      req.quote,
      req.amount,
      req.side,
      req.network as TSupportedNetworks,
    );
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(
        500,
        PRICE_FAILED_ERROR_MESSAGE + e.message,
        PRICE_FAILED_ERROR_CODE,
      );
    } else {
      throw new HttpException(
        500,
        UNKNOWN_ERROR_MESSAGE,
        UNKNOWN_ERROR_ERROR_CODE,
      );
    }
  }
  const price =
    Number(tradeInfo.expectedTrade.expectedAmount) / Number(req.amount);

  return {
    base: tradeInfo.baseTokenAddress,
    quote: tradeInfo.quoteTokenAddress,
    amount: new Decimal(req.amount).toString(),
    rawAmount: tradeInfo.expectedTrade.rawAmount,
    expectedAmount: tradeInfo.expectedTrade.expectedAmount,
    price: price.toString(),
    network: cardanoish.chain,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    gasPrice: 0,
    gasPriceToken: 'N/A',
    gasLimit: 0,
    gasCost: 'N/A',
  };
}

export async function trade(
  cardanoish: Cardano,
  sundaeswap: Sundaeswap,
  req: TradeRequest,
): Promise<TradeResponse> {
  const startTimestamp: number = Date.now();
  let base: CardanoTokenInfo[];
  let quote: CardanoTokenInfo[];
  let res: Transaction;
  try {
    // console.log(
    //   'MY connector sundaeswap is reached for trade---------------',
    //   sundaeswap,
    // );
    const { privateKey } = await cardanoish.getWalletFromAddress(req.address);
    const network = (req.network.charAt(0).toUpperCase() +
      req.network.slice(1)) as Network;

    const lucidInstance = await getBackendLucidInstance(
      network,
      cardanoish.blockfrostProjectId,
      cardanoish.apiURL,
      privateKey,
    );
    // console.log(lucidInstance);

    base = cardanoish.getTokenForSymbol(req.base);
    quote = cardanoish.getTokenForSymbol(req.quote);

    res = await sundaeswap.executeTrade(
      lucidInstance,
      cardanoish,
      req.network as TSupportedNetworks,
      req.amount,
      req.address,
      req.side,
      base[0],
      quote[0],
    );
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(
        500,
        TRADE_FAILED_ERROR_MESSAGE + e.message,
        TRADE_FAILED_ERROR_CODE,
      );
    } else {
      throw new HttpException(
        500,
        UNKNOWN_ERROR_MESSAGE,
        UNKNOWN_ERROR_ERROR_CODE,
      );
    }
  }
  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    base: base[0].policyId + base[0].assetName,
    quote: quote[0].policyId + quote[0].assetName,
    amount: req.amount,
    rawAmount: res.rawAmount.toString(),
    price: req.amount,
    gasPrice: 0,
    gasPriceToken: 'N/A',
    gasLimit: 0,
    gasCost: 'N/A',
    txHash: res.hash,
  };
}

export async function addLiquidity(
  cardanoish: Cardano,
  sundaeswap: Sundaeswap,
  req: AddLiquidityRequest,
): Promise<AddLiquidityResponse> {
  const startTimestamp: number = Date.now();
  let token0: CardanoTokenInfo[];
  let token1: CardanoTokenInfo[];
  let tx: Transaction;
  try {
    const { privateKey } = await cardanoish.getWalletFromAddress(req.address);
    const network = (req.network.charAt(0).toUpperCase() +
      req.network.slice(1)) as Network;

    const lucidInstance = await getBackendLucidInstance(
      network,
      cardanoish.blockfrostProjectId,
      cardanoish.apiURL,
      privateKey,
    );

    token0 = cardanoish.getTokenForSymbol(req.token0);
    token1 = cardanoish.getTokenForSymbol(req.token1);

    tx = await sundaeswap.addPosition(
      lucidInstance,
      cardanoish,
      req.network as TSupportedNetworks,
      token0[0],
      token1[0],
      req.amount0,
      req.amount1,
      req.address,
    );

    // console.log(`Liquidity added, txHash is ${tx.hash}.`);
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(
        500,
        TRADE_FAILED_ERROR_MESSAGE + e.message,
        TRADE_FAILED_ERROR_CODE,
      );
    } else {
      throw new HttpException(
        500,
        UNKNOWN_ERROR_MESSAGE,
        UNKNOWN_ERROR_ERROR_CODE,
      );
    }
  }

  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    token0: token0[0].policyId + token0[0].assetName,
    token1: token1[0].policyId + token1[0].assetName,
    tokenId: req.tokenId ? req.tokenId : 0,
    gasPrice: 'N/A',
    gasPriceToken: 'N/A',
    gasLimit: 0,
    gasCost: 'N/A',
    nonce: 0,
    txHash: tx.hash,
    fee: '0',
  };
}

export async function removeLiquidity(
  cardanoish: Cardano,
  sundaeswap: Sundaeswap,
  req: RemoveLiquidityRequest,
): Promise<RemoveLiquidityResponse> {
  const startTimestamp: number = Date.now();
  let tx: Transaction;
  try {
    const { privateKey } = await cardanoish.getWalletFromAddress(req.address);
    const network = (req.network.charAt(0).toUpperCase() +
      req.network.slice(1)) as Network;

    const lucidInstance = await getBackendLucidInstance(
      network,
      cardanoish.blockfrostProjectId,
      cardanoish.apiURL,
      privateKey,
    );
    const lpAmountInWallet = await cardanoish.getAssetBalance(privateKey, 'LP');

    tx = await sundaeswap.reducePosition(
      lucidInstance,
      cardanoish,
      req.network as TSupportedNetworks,
      req.address,
      lpAmountInWallet,
      req.decreasePercent ? req.decreasePercent : 100,
    );

    // console.log(`Liquidity removed, txHash is ${tx.hash}.`);
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(
        500,
        TRADE_FAILED_ERROR_MESSAGE + e.message,
        TRADE_FAILED_ERROR_CODE,
      );
    } else {
      throw new HttpException(
        500,
        UNKNOWN_ERROR_MESSAGE,
        UNKNOWN_ERROR_ERROR_CODE,
      );
    }
  }

  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    tokenId: req.tokenId,
    gasPrice: 'N/A',
    gasPriceToken: 'N/A',
    gasLimit: 0,
    gasCost: 'N/A',
    nonce: 0,
    txHash: tx.hash,
  };
}

export async function poolPrice(
  cardanoish: Cardano,
  sundaeswap: Sundaeswap,
  req: PoolPriceRequest,
): Promise<PoolPriceResponse> {
  const startTimestamp: number = Date.now();
  let poolData: any;
  let token0Address: string;
  let token1Address: string;
  try {
    poolData = await sundaeswap.poolPrice(
      cardanoish,
      req.network as TSupportedNetworks,
      req.period,
      req.interval,
    );

    token0Address = cardanoish.getTokenAddress(req.token0);
    token1Address = cardanoish.getTokenAddress(req.token1);
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(
        500,
        PRICE_FAILED_ERROR_MESSAGE + e.message,
        PRICE_FAILED_ERROR_CODE,
      );
    } else {
      throw new HttpException(
        500,
        UNKNOWN_ERROR_MESSAGE,
        UNKNOWN_ERROR_ERROR_CODE,
      );
    }
  }

  return {
    token0: token0Address,
    token1: token1Address,
    fee: 'N/A',
    period: req.period,
    prices: poolData.prices,
    pools: poolData.pools,
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
  };
}

export const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

async function getBackendLucidInstance(
  network: Network,
  projectId: string,
  blockfrostUrl: string,
  privateKey: string,
): Promise<Lucid> {
  try {
    const provider = new Blockfrost(blockfrostUrl, projectId);
    const lucid = await Lucid.new(provider, network);
    lucid.selectWalletFromPrivateKey(privateKey);
    return lucid;
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(
        500,
        LOAD_WALLET_ERROR_MESSAGE + e.message,
        LOAD_WALLET_ERROR_CODE,
      );
    } else {
      throw new HttpException(
        500,
        UNKNOWN_ERROR_MESSAGE,
        UNKNOWN_ERROR_ERROR_CODE,
      );
    }
  }
}
