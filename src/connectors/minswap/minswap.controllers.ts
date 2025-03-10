import { Cardano } from '../../chains/cardano/cardano';
import { MinSwap } from './minswap';
import { ConfigManagerV2 } from '../../services/config-manager-v2';

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
  ADA,
  Asset,
  calculateWithdraw,
  calculateDeposit,
  BlockfrostAdapter,
  calculateSwapExactIn,
  calculateSwapExactOut,
  Dex,
  NetworkId,
  PoolV1,
} from '@minswap/sdk';

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
} from 'lucid-cardano';

import {
  HttpException,
  TOKEN_NOT_SUPPORTED_ERROR_CODE,
  TOKEN_NOT_SUPPORTED_ERROR_MESSAGE,
} from '../../services/error-handler';

interface InitialResponse {
  network: Network;
  ttl: string;
  slippage: string;
  blockfrostUrl: string;
  blockfrostProjectId: string;
  poolId: string;
  blockfrostAdapterInstance: BlockfrostAdapter;
  address: string;
  lucid: Lucid;
}

interface InitialPriceResponse {
  network: Network;
  ttl: string;
  slippage: string;
  blockfrostUrl: string;
  blockfrostProjectId: string;
  poolId: string;
  blockfrostAdapterInstance: BlockfrostAdapter;
}

async function initializePrice(
  req: PriceRequest,
  cardanoish: Cardano,
): Promise<InitialPriceResponse> {
  let reqNetwork: any = req.network;
  let network: any = 'Preprod';
  let networkId = 0;
  if (reqNetwork == 'mainnet') {
    networkId = 1;
    network = 'Mainnet';
  }
  const blockfrostProjectId = cardanoish.blockfrostProjectId;
  const ttl: any = cardanoish.ttl;
  const slippage: any = cardanoish.allowedSlippage;
  const blockfrostUrl = cardanoish.apiURL;

  let poolId = cardanoish.defaultPoolId;
  if (req.poolId) {
    poolId = req.poolId;
  }

  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });
  return {
    network,
    ttl,
    slippage,
    blockfrostUrl,
    blockfrostProjectId,
    poolId,
    blockfrostAdapterInstance,
  };
}

async function initializeTrade(
  req: TradeRequest,
  cardanoish: Cardano,
): Promise<InitialResponse> {
  let reqNetwork: any = req.network;
  let network: any = 'Preprod';
  let networkId = 0;
  if (reqNetwork == 'mainnet') {
    networkId = 1;
    network = 'Mainnet';
  }
  const blockfrostProjectId = cardanoish.blockfrostProjectId;

  const ttl: any = cardanoish.ttl;
  const slippage: any = 0;
  const blockfrostUrl = cardanoish.apiURL;

  let poolId = ConfigManagerV2.getInstance().get(
    `cardano.defaultPoolId.${reqNetwork}.poolId`,
  );
  if (req.poolId) {
    poolId = req.poolId;
  }
  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });

  let address = req.address;
  const wallet = await cardanoish.getWalletFromAddress(req.address);

  const lucid = await getBackendLucidInstance(
    network,
    blockfrostProjectId,
    blockfrostUrl,
    wallet.privateKey,
  );

  return {
    network,
    ttl,
    slippage,
    blockfrostUrl,
    blockfrostProjectId,
    poolId,
    blockfrostAdapterInstance,
    address,
    lucid,
  };
}

async function commitTransaction(txCompleteReq: TxComplete): Promise<string> {
  const signedTx = await txCompleteReq.sign().complete();

  const txId = await signedTx.submit();
  //console.info(`Transaction submitted successfully: ${txId}`);
  return txId;
}

export async function price(
  cardanoish: Cardano,
  minSwap: MinSwap,
  req: PriceRequest,
): Promise<PriceResponse> {
  const startTimestamp: number = Date.now();
  console.log(
    'MY connector MinSwap is reached---------------',
    minSwap,
    BlockfrostAdapter,
    NetworkId,
  );
  const initialValue = await initializePrice(req, cardanoish);

  const api = initialValue.blockfrostAdapterInstance;

  const poolidentifier = initialValue.poolId;
  const returnedPool = await getPoolById(
    initialValue.network,
    api,
    poolidentifier,
  );
  // console.log(returnedPool.poolState)
  const [a, b] = await api.getV1PoolPrice({ pool: returnedPool.poolState });

  // console.log(`ADA/MIN price: ${a.toString()}; MIN/ADA price: ${b.toString()}`);

  /** here a is ADA/MIN and b is  MIN/ADA*/

  let reqType = req.side;
  let amountToSpend: number = Number(req.amount);
  let totalValue = 0.0;
  let expectedAmount = '';
  let conversionFactor = 0.0;

  if (reqType == 'BUY') {
    let wantToBuy = req.base;
    let willspend = req.quote;
    /*To BUY 5 base ADA,  calculate amount of quote MIN required   quote=MIN   base=ADA   amount=5    */

    if (willspend == 'MIN' && wantToBuy == 'ADA') {
      conversionFactor = Number(b);
    } else if (willspend == 'ADA' && wantToBuy == 'MIN') {
      conversionFactor = Number(a);
      /*To BUY 5 base MIN,  calculate amount of quote ADA required    quote=ADA    base=MIN   amount=5    */
    }
  } else if (reqType == 'SELL') {
    /*
    //When I sell 5 base ADA how many quote MIN can I get in return
    quote=MIN
    base=ADA
    amount=5
    I need to use b.toString as conversion factor
    */
    /*
    //When I sell 5 base MIN how many quote ADA can I get in return
    quote=ADA
    base=MIN
    amount=5
    I need to use a.toString as conversion factor
    */
    let wantToSell = req.base;
    let tokenReceive = req.quote;
    if (tokenReceive == 'MIN' && wantToSell == 'ADA') {
      conversionFactor = Number(b);
    } else if (tokenReceive == 'ADA' && wantToSell == 'MIN') {
      conversionFactor = Number(a);
    }
  }
  totalValue = amountToSpend * conversionFactor;
  expectedAmount = totalValue.toFixed(2).toString();

  const baseToken = getTokenAddressFromSymbol(cardanoish, req.base);
  const quoteToken = getTokenAddressFromSymbol(cardanoish, req.quote);

  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    base: baseToken,
    quote: quoteToken,
    amount: new Decimal(req.amount).toFixed(2).toString(),
    rawAmount: new Decimal(req.amount).mul(1000000).toString(),
    expectedAmount: expectedAmount,
    price: new Decimal(b.toString()).toFixed(2).toString(),
    gasPrice: 0,
    gasPriceToken: 'n/a',
    gasLimit: 0,
    gasCost: 'n/a',
  };
}

export async function trade(
  cardanoish: Cardano,
  minSwap: MinSwap,
  req: TradeRequest,
): Promise<TradeResponse> {
  const startTimestamp: number = Date.now();
  console.log(
    'MY connector MinSwap is reached for trade---------------',
    minSwap,
    BlockfrostAdapter,
    NetworkId,
  );
  const initialTradeVal = await initializeTrade(req, cardanoish);
  const api = initialTradeVal.blockfrostAdapterInstance;
  let txnHash = '';

  if (req.isCancelled && req.txnHash) {
    txnHash = req.txnHash;
    const txnId = cancelTx(initialTradeVal.lucid, api, txnHash, req.address);
    return {
      network: req.network,
      timestamp: startTimestamp,
      latency: latency(startTimestamp, Date.now()),
      base: '',
      quote: '',
      amount: '',
      rawAmount: '',
      expectedIn: '',
      price: '',
      gasPrice: 0.0,
      gasPriceToken: 'n/a',
      gasLimit: 0,
      gasCost: '',
      nonce: Math.random(),
      txHash: txnId,
    };
  }

  const utxos = await initialTradeVal.lucid.utxosAt(req.address);
  const baseToken = getTokenAddressFromSymbol(cardanoish, req.base);
  const quoteToken = getTokenAddressFromSymbol(cardanoish, req.quote);
  // console.log(utxos);
  // if (req.side === 'BUY') {
  //   console.log('BUY Trade: Base:', req.base, 'Quote:', req.quote);
  // } else if (req.side === 'SELL') {
  //   console.log('SELL Trade: Base:', req.base, 'Quote:', req.quote);
  // }

  let txnId = '';
  if (req.side == 'SELL') {
    txnId = await swapExactInTx(
      initialTradeVal.network,
      initialTradeVal.lucid,
      api,
      initialTradeVal.poolId,
      utxos,
      req,
      initialTradeVal,
    );
  } else if (req.side == 'BUY') {
    txnId = await swapExactOutTx(
      initialTradeVal.network,
      initialTradeVal.lucid,
      api,
      initialTradeVal.poolId,
      utxos,
      req,
      initialTradeVal,
    );
  }
  // console.log(txnId);
  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    base: baseToken,
    quote: quoteToken,
    amount: new Decimal(req.amount).toFixed(2).toString(),
    rawAmount: new Decimal(req.amount).toFixed(2).toString(),
    expectedIn: new Decimal(req.amount).toFixed(2).toString(),
    price: new Decimal(req.amount).toFixed(2).toString(),
    gasPrice: 0.0,
    gasPriceToken: 'n/a',
    gasLimit: 0,
    gasCost: '',
    nonce: Math.random(),
    txHash: txnId,
  };
}

export async function poolPrice(
  cardano: Cardano,
  req: PoolPriceRequest,
): Promise<PoolPriceResponse> {
  const startTimestamp: number = Date.now();
  const reqNetwork: any = req.network;

  let network: any = 'Preprod';
  let networkId = 0;
  if (reqNetwork == 'mainnet') {
    networkId = 1;
    network = 'Mainnet';
  }
  const blockfrostProjectId = cardano.blockfrostProjectId;

  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });

  let poolId = ConfigManagerV2.getInstance().get(
    `cardano.defaultPoolId.${req.network}.poolId`,
  );

  // console.log("working upto here");

  const { poolState } = await getPoolById(
    network,
    blockfrostAdapterInstance,
    poolId,
  );

  const [priceA, priceB] = await blockfrostAdapterInstance.getV1PoolPrice({
    pool: poolState,
  });
  // console.log(priceA, priceB);

  const token0Address = getTokenAddressFromSymbol(cardano, req.token0);

  const token1Address = getTokenAddressFromSymbol(cardano, req.token1);

  return {
    network: cardano.chain,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    token0: token0Address,
    token1: token1Address,
    fee: req.fee,
    period: req.period,
    interval: req.interval,
    prices: [priceA.toString(), priceB.toString()],
  };
}

export async function addLiquidity(
  cardanoish: Cardano,
  req: AddLiquidityRequest,
): Promise<AddLiquidityResponse> {
  const startTimestamp: number = Date.now();
  const reqNetwork: any = req.network;
  let network: any = 'Preprod';
  let networkId = 0;
  if (reqNetwork == 'mainnet') {
    networkId = 1;
    network = 'Mainnet';
  }
  const blockfrostProjectId = cardanoish.blockfrostProjectId;
  const blockfrostUrl = cardanoish.apiURL;

  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });

  let address = req.address;
  const wallet = await cardanoish.getWalletFromAddress(address);
  const lucid = await getBackendLucidInstance(
    network,
    blockfrostProjectId,
    blockfrostUrl,
    wallet.privateKey,
  );
  const utxos = await lucid.utxosAt(address);
  // console.log("utxos: ", utxos);

  const txComplete = await depositTx(
    network,
    lucid,
    blockfrostAdapterInstance,
    address,
    utxos,
    req,
  );

  const transactionId = await commitTransaction(txComplete);
  const token0Address = getTokenAddressFromSymbol(cardanoish, req.token0);
  const token1Address = getTokenAddressFromSymbol(cardanoish, req.token1);

  return {
    network: req.chain,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    token0: token0Address,
    token1: token1Address,
    fee: req.fee!,
    tokenId: req.tokenId ? req.tokenId : 0,
    gasPrice: 0,
    gasPriceToken: 'n/a',
    gasLimit: 0,
    gasCost: 'n/a',
    nonce: Math.random(),
    txHash: transactionId,
  };
}

async function depositTx(
  network: Network,
  lucid: Lucid,
  blockfrostAdapter: BlockfrostAdapter,
  address: Address,
  availableUtxos: UTxO[],
  req: AddLiquidityRequest,
): Promise<TxComplete> {
  let poolId = ConfigManagerV2.getInstance().get(
    `cardano.defaultPoolId.${req.network}.poolId`,
  );
  if (req.poolId) {
    poolId = req.poolId;
  }

  const { poolState, poolDatum } = await getPoolById(
    network,
    blockfrostAdapter,
    poolId,
  );
  // console.log(poolState);

  // Extract assetA and assetB details from poolDatum
  const { assetA, assetB } = poolDatum;

  // Ensure deposited amounts are valid and calculate the necessary amounts
  const amount0 = new Decimal(req.amount0).toFixed(0).toString();
  const amount1 = new Decimal(req.amount1).toFixed(0).toString();
  const depositedAmountA = BigInt(amount0) * BigInt(1_000_000);
  const depositedAmountB = BigInt(amount1);
  // console.log(depositedAmountA);
  // console.log(depositedAmountB);

  const { necessaryAmountA, necessaryAmountB, lpAmount } = calculateDeposit({
    depositedAmountA,
    depositedAmountB,
    reserveA: poolState.reserveA,
    reserveB: poolState.reserveB,
    totalLiquidity: poolDatum.totalLiquidity,
  });
  // console.log(poolState.reserveA + "!!!!" + poolState.reserveB);
  // console.log(poolDatum.totalLiquidity);

  // console.log("necessaryAmountA", necessaryAmountA + " : " + "necessaryAmountB", necessaryAmountB);
  // console.log("assetA: ", assetA);
  // console.log("assetB: ", assetB);
  // console.log("total LP", poolDatum.totalLiquidity);

  // Use Dex object to build deposit transaction
  const dex = new Dex(lucid);
  return await dex.buildDepositTx({
    assetA: assetA,
    assetB: assetB,
    amountA: depositedAmountA,
    amountB: depositedAmountB,
    minimumLPReceived: lpAmount,
    sender: address,
    availableUtxos: availableUtxos,
  });
}

export async function removeLiquidity(
  cardanoish: Cardano,
  req: RemoveLiquidityRequest,
): Promise<RemoveLiquidityResponse> {
  const startTimestamp: number = Date.now();
  const reqNetwork: any = req.network;
  let network: Network = 'Preprod';
  let networkId = 0;
  if (reqNetwork == 'mainnet') {
    networkId = 1;
    network = 'Mainnet';
  }

  const blockfrostProjectId = cardanoish.blockfrostProjectId;

  const blockfrostUrl = cardanoish.apiURL;

  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });
  let address = req.address;
  const wallet = await cardanoish.getWalletFromAddress(address);
  const lucid = await getBackendLucidInstance(
    network,
    blockfrostProjectId,
    blockfrostUrl,
    wallet.privateKey,
  );
  const utxos = await lucid.utxosAt(address);
  const txComplete = await withdrawTx(
    network,
    lucid,
    blockfrostAdapterInstance,
    address,
    utxos,
    req,
  );

  const txId = await commitTransaction(txComplete);

  return {
    network: req.chain,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    tokenId: req.tokenId,
    gasPrice: 0.0,
    gasPriceToken: 'n/a',
    gasLimit: 0.0,
    gasCost: 'n/a',
    nonce: Math.random(),
    txHash: txId,
  };
}

async function withdrawTx(
  network: Network,
  lucid: Lucid,
  blockfrostAdapter: BlockfrostAdapter,
  address: Address,
  availableUtxos: UTxO[],
  req: RemoveLiquidityRequest,
): Promise<TxComplete> {
  // Fetch the default pool ID
  let poolId = ConfigManagerV2.getInstance().get(
    `cardano.defaultPoolId.${req.network}.poolId`,
  );

  // Fetch pool state and datum
  const { poolState, poolDatum } = await getPoolById(
    network,
    blockfrostAdapter,
    poolId,
  );

  // Parse LP asset from pool state
  const lpAsset = Asset.fromString(poolState.assetLP);
  // console.log(lpAsset);

  // Determine withdrawal percentage, defaulting to 100%
  const withAmt = req.decreasePercent ? req.decreasePercent : 100;

  // Calculate LP amount in the wallet
  const lpAmountInWallet = calculateAssetAmount(availableUtxos, lpAsset);
  // console.log("lpAmountInWallet:::", lpAmountInWallet);

  if (lpAmountInWallet === 0n) {
    throw new Error('No LP tokens available in the wallet.');
  }

  // Calculate withdrawal amount (percentage of LP tokens in the wallet)
  const withdrawalAmount = (lpAmountInWallet * BigInt(withAmt)) / 100n;
  if (withdrawalAmount === 0n) {
    throw new Error(
      'Withdrawal amount is zero. Adjust the percentage or check LP tokens.',
    );
  }
  // console.log("withdrawalAmount:::", withdrawalAmount);

  // Calculate the assets to be received upon withdrawal
  const { amountAReceive, amountBReceive } = calculateWithdraw({
    withdrawalLPAmount: withdrawalAmount,
    reserveA: poolState.reserveA,
    reserveB: poolState.reserveB,
    totalLiquidity: poolDatum.totalLiquidity,
  });
  // console.log("amountAReceive:::", amountAReceive);
  // console.log("amountBReceive:::", amountBReceive);

  if (amountAReceive <= 0n || amountBReceive <= 0n) {
    throw new Error(
      'Received amounts are invalid. Check pool reserves or withdrawal amount.',
    );
  }

  // console.log("Building withdrawal transaction...");

  // Build and return the withdrawal transaction
  const dex = new Dex(lucid);
  return await dex.buildWithdrawTx({
    sender: address,
    lpAsset: lpAsset,
    lpAmount: withdrawalAmount,
    minimumAssetAReceived: amountAReceive,
    minimumAssetBReceived: amountBReceive,
    availableUtxos: availableUtxos,
  });
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
  const provider = new Blockfrost(blockfrostUrl, projectId);
  const lucid = await Lucid.new(provider, network);

  // console.log('address:::', address);
  //in the adrdress field we actually need to get the seed phrase to identify the wallet
  // lucid.selectWalletFromSeed(seedPhrase);
  lucid.selectWalletFromPrivateKey(privateKey);
  return lucid;
}

async function getPoolById(
  network: Network,
  blockfrostAdapter: BlockfrostAdapter,
  poolId: string,
): Promise<{ poolState: PoolV1.State; poolDatum: PoolV1.Datum }> {
  const pool = await blockfrostAdapter.getV1PoolById({
    id: poolId,
  });
  if (!pool) {
    throw new Error(`Not found PoolState of ID: ${poolId}`);
  }

  const rawRoolDatum = await blockfrostAdapter.getDatumByDatumHash(
    pool.datumHash,
  );
  const poolDatum = PoolV1.Datum.fromPlutusData(
    network === 'Mainnet' ? NetworkId.MAINNET : NetworkId.TESTNET,
    Data.from(rawRoolDatum) as Constr<Data>,
  );
  return {
    poolState: pool,
    poolDatum: poolDatum,
  };
}

async function swapExactInTx(
  network: Network,
  lucid: Lucid,
  blockfrostAdapter: BlockfrostAdapter,
  poolId: string,
  availableUtxos: UTxO[],
  req: TradeRequest,
  initialTradeVal: InitialResponse,
): Promise<string> {
  const { poolState, poolDatum } = await getPoolById(
    network,
    blockfrostAdapter,
    poolId,
  );
  // console.log('poolState:::', poolState);
  // console.log('poolDatum:::', poolDatum);

  // Calculate the amount of ADA to swap
  const swapAmountADA = BigInt(Math.floor(Number(req.amount) * 1_000_000)); // Convert ADA to lovelace
  // console.log('swapAmountADA:', swapAmountADA);

  // Calculate the amount of MIN received
  const { amountOut } = calculateSwapExactIn({
    amountIn: swapAmountADA,
    reserveIn: poolState.reserveA, // ADA reserve
    reserveOut: poolState.reserveB, // MIN reserve
  });

  // Adjust for slippage
  const slippageTolerance = BigInt(initialTradeVal.slippage || 0);
  const acceptedAmount =
    (amountOut * (BigInt(100) - slippageTolerance)) / BigInt(100);

  // console.log('AmountOut:', amountOut.toString(), 'AcceptedAmount:', acceptedAmount.toString());

  // Ensure sufficient MIN tokens are being exchanged for the given ADA
  if (acceptedAmount === BigInt(0)) {
    throw new Error('Insufficient output amount for the given input.');
  }

  const dex = new Dex(lucid);
  // console.log(req.address);
  const txComplete = await dex.buildSwapExactInTx({
    amountIn: swapAmountADA,
    assetIn: ADA,
    assetOut: poolDatum.assetB, // MIN asset
    minimumAmountOut: acceptedAmount,
    isLimitOrder: false,
    sender: req.address,
    availableUtxos: availableUtxos,
  });

  const transactionId = await commitTransaction(txComplete);

  return transactionId;
}

async function swapExactOutTx(
  network: Network,
  lucid: Lucid,
  blockfrostAdapter: BlockfrostAdapter,
  poolId: string,
  availableUtxos: UTxO[],
  req: TradeRequest,
  initialTradeVal: InitialResponse,
): Promise<string> {
  const { poolState, poolDatum } = await getPoolById(
    network,
    blockfrostAdapter,
    poolId,
  );
  // console.log("Swap Exact out transaction called");
  // console.log('Pool State:', poolState);
  // console.log('Pool Datum:', poolDatum);

  // Parse the requested amount (exact ADA to receive)
  const amount: number = Number(req.amount);
  const exactAmountOutADA = BigInt(Math.floor(amount * 1_000_000)); // Convert ADA to Lovelace

  // Calculate MIN required to get the exact ADA
  const { amountIn } = calculateSwapExactOut({
    exactAmountOut: exactAmountOutADA, // ADA you want to receive
    reserveIn: poolState.reserveB, // MIN available in the pool
    reserveOut: poolState.reserveA, // ADA available in the pool
  });

  const slippageTolerance = BigInt(initialTradeVal.slippage || 1); // Set default slippage to 1%
  const necessaryAmountIn =
    (amountIn * (BigInt(100) + slippageTolerance)) / BigInt(100); // Add slippage

  // console.log('Necessary MIN Input:', necessaryAmountIn.toString());
  // console.log('Expected ADA Output:', exactAmountOutADA.toString());

  const dex = new Dex(lucid);

  const txComplete = await dex.buildSwapExactOutTx({
    maximumAmountIn: necessaryAmountIn, // Maximum MIN to spend
    assetIn: poolDatum.assetB, // MIN
    assetOut: ADA, // ADA
    expectedAmountOut: exactAmountOutADA, // ADA to receive
    sender: req.address,
    availableUtxos: availableUtxos,
  });

  const transactionId = await commitTransaction(txComplete);

  return transactionId;
}

async function cancelTx(
  lucid: Lucid,
  blockFrostAdapter: BlockfrostAdapter,
  transactionHash: string,
  address: Address,
): Promise<string> {
  const orderOutRef: OutRef = {
    txHash: transactionHash,
    outputIndex: 0,
  };

  const orderUtxo: any = (await lucid.utxosByOutRef([orderOutRef]))[0];

  orderUtxo.datum = await blockFrostAdapter.getDatumByDatumHash(
    orderUtxo.datumHash,
  );
  const dex = new Dex(lucid);
  const cancelTx = await dex.buildCancelOrder({
    orderUtxo,
    sender: address,
  });
  const transactionId = await commitTransaction(cancelTx);

  return transactionId;
}

function getTokenAddressFromSymbol(
  cardano: Cardano,
  tokenSymbol: string,
): string {
  const tokenAddress = cardano.getTokenAddress(tokenSymbol);
  if (!tokenAddress)
    throw new HttpException(
      500,
      TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + tokenSymbol,
      TOKEN_NOT_SUPPORTED_ERROR_CODE,
    );
  return tokenAddress;
}

function calculateAssetAmount(utxos: UTxO[], asset: Asset): bigint {
  return utxos.reduce((acc, utxo) => {
    const assetValue = utxo.assets[asset.policyId + asset.tokenName];
    if (assetValue) {
      return acc + BigInt(assetValue); // Ensure addition is performed with BigInt
    }
    return acc;
  }, 0n); // Initialize the accumulator with BigInt zero
}
