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
  const slippage: any = 0;//cardanoish.allowedSlippage;
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
  let seedphrase = '';
  if (req.seedPhrase) {
    seedphrase = req.seedPhrase;
  }

  const lucid = await getBackendLucidInstance(
    network,
    blockfrostProjectId,
    blockfrostUrl,
    req.address,
    seedphrase,
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

  const [a, b] = await api.getV1PoolPrice({ pool: returnedPool.poolState });
  console.log(`ADA/MIN price: ${a.toString()}; MIN/ADA price: ${b.toString()}`);

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

  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    base: req.base,
    quote: req.quote,
    amount: new Decimal(req.amount).toFixed(2).toString(),
    rawAmount: expectedAmount,
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

  return {
    network: req.network,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    base: req.base,
    quote: req.quote,
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

  const slippage: any = cardanoish.allowedSlippage;
  const blockfrostUrl = cardanoish.apiURL;

  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });

  let seedphrase = '';
  if (req.seedPhrase) {
    seedphrase = req.seedPhrase;
  }
  const lucid = await getBackendLucidInstance(
    network,
    blockfrostProjectId,
    blockfrostUrl,
    req.address,
    seedphrase,
  );
  const utxos = await lucid.utxosAt(req.address);

  const txComplete = await withdrawTx(
    network,
    lucid,
    blockfrostAdapterInstance,
    req.address,
    utxos,
    req,
    slippage,
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
  //const ttl :any=  cardanoish.ttl;
  const slippage: any = cardanoish.allowedSlippage;
  const blockfrostUrl = cardanoish.apiURL;

  let blockfrostAdapterInstance = new BlockfrostAdapter({
    networkId: networkId,
    blockFrost: new BlockFrostAPI({
      projectId: blockfrostProjectId,
      network: reqNetwork,
    }),
  });

  let seedphrase = '';
  if (req.seedPhrase) {
    seedphrase = req.seedPhrase;
  }

  const lucid = await getBackendLucidInstance(
    network,
    blockfrostProjectId,
    blockfrostUrl,
    req.address,
    seedphrase,
  );

  const utxos = await lucid.utxosAt(req.address);

  const txComplete = await depositTx(
    network,
    lucid,
    blockfrostAdapterInstance,
    req.address,
    utxos,
    req,
    slippage,
  );

  const transactionId = await commitTransaction(txComplete);

  return {
    network: req.chain,
    timestamp: startTimestamp,
    latency: latency(startTimestamp, Date.now()),
    token0: req.token0,
    token1: req.token1,
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
export const latency = (startTime: number, endTime: number): number => {
  return (endTime - startTime) / 1000;
};

async function getBackendLucidInstance(
  network: Network,
  projectId: string,
  blockfrostUrl: string,
  address: Address,
  seedPhrase: string,
): Promise<Lucid> {
  const provider = new Blockfrost(blockfrostUrl, projectId);
  const lucid = await Lucid.new(provider, network);

  console.log('address:::', address);
  lucid.selectWalletFromSeed(seedPhrase); //in the adrdress field we actually need to get the seed phrase to identify the wallet
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

  /*
  BUY : acquire particular base by selling quote  calculateSwapExactOut
SELL : sell particular base to acquire quote  calculateSwapExactIn
*/
  const swapAmountADA = BigInt(req.amount)*BigInt(1000000);

  const { amountOut } = calculateSwapExactIn({
    amountIn: swapAmountADA, //exact amount of input tokens that the user wants to swap
    reserveIn: poolState.reserveA, //total amount of the input token currently available in the liquidity pool
    reserveOut: poolState.reserveB, //total amount of the output token currently available in the liquidity pool
  });

  // Because pool is always fluctuating, so you should determine the impact of amount which you will receive
  const slippageTolerance = BigInt(initialTradeVal.slippage);
  const acceptedAmount =
    (amountOut * (BigInt(100) - slippageTolerance)) / BigInt(100);

  const dex = new Dex(lucid);

  const txComplete = await dex.buildSwapExactInTx({
    amountIn: swapAmountADA,
    assetIn: ADA,
    assetOut: poolDatum.assetB,
    minimumAmountOut: acceptedAmount,
    isLimitOrder: false,
    sender: req.address,
    availableUtxos: availableUtxos,
  });

  const transactionId = await commitTransaction(txComplete);

  return transactionId;
}

async function depositTx(
  network: Network,
  lucid: Lucid,
  blockfrostAdapter: BlockfrostAdapter,
  address: Address,
  availableUtxos: UTxO[],
  req: AddLiquidityRequest,
  slippage: number,
): Promise<TxComplete> {
  let reqPoolId = ConfigManagerV2.getInstance().get('cardano.defaultPoolId');
  if (req.poolId) {
    reqPoolId = req.poolId;
  }
  const { poolState, poolDatum } = await getPoolById(
    network,
    blockfrostAdapter,
    reqPoolId,
  );

  const depositedAmountA = BigInt(req.token0);
  const depositedAmountB = BigInt(req.token1);

  const { necessaryAmountA, necessaryAmountB, lpAmount } = calculateDeposit({
    depositedAmountA: depositedAmountA,
    depositedAmountB: depositedAmountB,
    reserveA: poolState.reserveA,
    reserveB: poolState.reserveB,
    totalLiquidity: poolDatum.totalLiquidity,
  });

  // Because pool is always fluctuating, so you should determine the impact of amount which you will receive
  const slippageTolerance = BigInt(slippage);
  const acceptedLPAmount =
    (lpAmount * (BigInt(100) - slippageTolerance)) / BigInt(100);

  const dex = new Dex(lucid);
  return await dex.buildDepositTx({
    amountA: necessaryAmountA,
    amountB: necessaryAmountB,
    assetA: poolDatum.assetA,
    assetB: poolDatum.assetB,
    sender: address,
    minimumLPReceived: acceptedLPAmount,
    availableUtxos: availableUtxos,
  });
}

async function withdrawTx(
  network: Network,
  lucid: Lucid,
  blockfrostAdapter: BlockfrostAdapter,
  address: Address,
  availableUtxos: UTxO[],
  req: RemoveLiquidityRequest,
  slippage: number,
): Promise<TxComplete> {
  let reqPoolId = ConfigManagerV2.getInstance().get('cardano.defaultPoolId');
  if (req.tokenId) {
    reqPoolId = req.poolId;
  }
  const { poolState, poolDatum } = await getPoolById(
    network,
    blockfrostAdapter,
    reqPoolId,
  );

  const lpAsset = Asset.fromString(poolState.assetLP);

  const withAmt: any = req.decreasePercent;
  const withdrawalAmount = BigInt(withAmt); //this is the amount you want to withdraw---

  const { amountAReceive, amountBReceive } = calculateWithdraw({
    withdrawalLPAmount: withdrawalAmount,
    reserveA: poolState.reserveA,
    reserveB: poolState.reserveB,
    totalLiquidity: poolDatum.totalLiquidity,
  });

  // Because pool is always fluctuating, so you should determine the impact of amount which you will receive
  const slippageTolerance = BigInt(slippage);
  const acceptedAmountAReceive =
    (amountAReceive * (BigInt(100) - slippageTolerance)) / BigInt(100);
  const acceptedAmountBReceive =
    (amountBReceive * (BigInt(100) - slippageTolerance)) / BigInt(100);

  const dex = new Dex(lucid);
  return await dex.buildWithdrawTx({
    lpAsset: lpAsset,
    lpAmount: withdrawalAmount,
    sender: address,
    minimumAssetAReceived: acceptedAmountAReceive,
    minimumAssetBReceived: acceptedAmountBReceive,
    availableUtxos: availableUtxos,
  });
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

  /*  swap MIN to get ADA base: ADA , quote : MIN

*/
  const exactAmountOutADA = BigInt(req.amount) * BigInt(1000000);

  const { amountIn } = calculateSwapExactOut({
    exactAmountOut: exactAmountOutADA,
    reserveIn: poolState.reserveA,
    reserveOut: poolState.reserveB,
  });

  // Because pool is always fluctuating, so you should determine the impact of amount which you will receive
  const slippageTolerance = BigInt(initialTradeVal.slippage);
  const necessaryAmountIn =
    (amountIn * (BigInt(100) - slippageTolerance)) / BigInt(100);

  const dex = new Dex(lucid);

  const txComplete = await dex.buildSwapExactOutTx({
    maximumAmountIn: necessaryAmountIn,
    assetIn: ADA,
    assetOut: poolDatum.assetB,
    expectedAmountOut: exactAmountOutADA,
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
