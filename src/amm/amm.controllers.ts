import {
  EstimateGasResponse,
  PerpAvailablePairsResponse,
  PerpCreateTakerRequest,
  PerpCreateTakerResponse,
  PerpMarketRequest,
  PerpMarketResponse,
  PerpPositionRequest,
  PerpPositionResponse,
  PerpPricesResponse,
  PriceRequest,
  PriceResponse,
  TradeRequest,
  TradeResponse,
  AddLiquidityRequest,
  AddLiquidityResponse,
  RemoveLiquidityRequest,
  RemoveLiquidityResponse,
  CollectEarnedFeesRequest,
  PositionRequest,
  PositionResponse,
  PoolPriceRequest,
  PoolPriceResponse,
  PerpBalanceRequest,
  PerpBalanceResponse,
} from './amm.requests';
import {
  price as uniswapPrice,
  trade as uniswapTrade,
  addLiquidity as uniswapV3AddLiquidity,
  removeLiquidity as uniswapV3RemoveLiquidity,
  collectEarnedFees as uniswapV3CollectEarnedFees,
  positionInfo as uniswapV3PositionInfo,
  poolPrice as uniswapV3PoolPrice,
  estimateGas as uniswapEstimateGas,
} from '../connectors/uniswap/uniswap.controllers';
import {
  price as carbonPrice,
  trade as carbonTrade,
  estimateGas as carbonEstimateGas,
} from '../connectors/carbon/carbon.controllers';
import {
  price as refPrice,
  trade as refTrade,
  estimateGas as refEstimateGas,
} from '../connectors/ref/ref.controllers';
import {
  price as tinymanPrice,
  trade as tinymanTrade,
  estimateGas as tinymanEstimateGas,
} from '../connectors/tinyman/tinyman.controllers';
import {
  getPriceData as perpPriceData,
  createTakerOrder,
  estimateGas as perpEstimateGas,
  getPosition,
  getAvailablePairs,
  checkMarketStatus,
  getAccountValue,
} from '../connectors/perp/perp.controllers';
import {
  price as plentyPrice,
  trade as plentyTrade,
  estimateGas as plentyEstimateGas,
} from '../connectors/plenty/plenty.controllers';
import {
  price as quipuPrice,
  trade as quipuTrade,
  estimateGas as quipuEstimateGas,
} from '../connectors/quipuswap/quipuswap.controllers';
import {
  getInitializedChain,
  getConnector,
} from '../services/connection-manager';
import {
  Chain as Ethereumish,
  Nearish,
  NetworkSelectionRequest,
  Perpish,
  RefAMMish,
  Tezosish,
  Uniswapish,
  UniswapLPish,
} from '../services/common-interfaces';
import { Algorand } from '../chains/algorand/algorand';
import { Tinyman } from '../connectors/tinyman/tinyman';
import { Plenty } from '../connectors/plenty/plenty';
import { QuipuSwap } from '../connectors/quipuswap/quipuswap';
import { Osmosis } from '../chains/osmosis/osmosis';
import { Carbonamm } from '../connectors/carbon/carbonAMM';
import { MinSwap } from '../connectors/minswap/minswap';
import { Sundaeswap } from '../connectors/sundaeswap/sundaeswap';
import {
  price as minswapPrice,
  trade as minswapTrade,
  removeLiquidity as minswapRemoveLiquidity,
  addLiquidity as minswapAddLiquidity,
  poolPrice as minswapPoolPrice,
} from '../connectors/minswap/minswap.controllers';

import {
  price as sundaeswapPrice,
  trade as sundaeswapTrade,
  addLiquidity as sundaeswapAddLiquidity,
  removeLiquidity as sundaeswapRemoveLiquidity,
  poolPrice as sundaeswapPoolPrice,
} from '../connectors/sundaeswap/sundaeswap.controllers';

import { Cardano } from '../chains/cardano/cardano';

export async function price(req: PriceRequest): Promise<PriceResponse> {
  const chain = await getInitializedChain<
    Algorand | Ethereumish | Nearish | Tezosish | Osmosis | Cardano
  >(req.chain, req.network);
  if (chain instanceof Osmosis) {
    return chain.controller.price(chain as unknown as Osmosis, req);
  }

  const connector:
    | Uniswapish
    | RefAMMish
    | Tinyman
    | Plenty
    | QuipuSwap
    | MinSwap
    | Sundaeswap = await getConnector<
    Uniswapish | RefAMMish | Tinyman | Plenty | QuipuSwap | MinSwap | Sundaeswap
  >(req.chain, req.network, req.connector);

  if (connector instanceof Plenty) {
    return plentyPrice(<Tezosish>chain, connector, req);
  } else if (connector instanceof QuipuSwap) {
    return quipuPrice(<Tezosish>chain, connector, req);
  } else if (connector instanceof Carbonamm) {
    return carbonPrice(<Ethereumish>chain, connector, req);
  } else if ('routerAbi' in connector) {
    // we currently use the presence of routerAbi to distinguish Uniswapish from RefAMMish
    return uniswapPrice(<Ethereumish>chain, connector, req);
  } else if (connector instanceof Tinyman) {
    return tinymanPrice(chain as unknown as Algorand, connector, req);
  } else if (connector instanceof MinSwap) {
    return minswapPrice(<Cardano>chain, connector, req);
  } else if (connector instanceof Sundaeswap) {
    return sundaeswapPrice(<Cardano>chain, connector, req);
  } else {
    return refPrice(<Nearish>chain, connector as RefAMMish, req);
  }
}

export async function trade(req: TradeRequest): Promise<TradeResponse> {
  const chain = await getInitializedChain<
    Algorand | Ethereumish | Nearish | Tezosish | Osmosis | Cardano
  >(req.chain, req.network);
  if (chain instanceof Osmosis) {
    return chain.controller.trade(chain as unknown as Osmosis, req);
  }

  const connector:
    | Uniswapish
    | RefAMMish
    | Tinyman
    | Plenty
    | QuipuSwap
    | MinSwap
    | Sundaeswap = await getConnector<
    Uniswapish | RefAMMish | Tinyman | Plenty | QuipuSwap | MinSwap | Sundaeswap
  >(req.chain, req.network, req.connector);

  if (connector instanceof Plenty) {
    return plentyTrade(<Tezosish>chain, connector, req);
  } else if (connector instanceof QuipuSwap) {
    return quipuTrade(<Tezosish>chain, connector, req);
  } else if (connector instanceof Carbonamm) {
    return carbonTrade(<Ethereumish>chain, connector, req);
  } else if ('routerAbi' in connector) {
    // we currently use the presence of routerAbi to distinguish Uniswapish from RefAMMish
    return uniswapTrade(<Ethereumish>chain, connector, req);
  } else if (connector instanceof Tinyman) {
    return tinymanTrade(chain as unknown as Algorand, connector, req);
  } else if (connector instanceof MinSwap) {
    return minswapTrade(<Cardano>chain, connector, req);
  } else if (connector instanceof Sundaeswap) {
    return sundaeswapTrade(<Cardano>chain, connector, req);
  } else {
    return refTrade(<Nearish>chain, connector as RefAMMish, req);
  }
}

export async function addLiquidity(
  req: AddLiquidityRequest,
): Promise<AddLiquidityResponse> {
  const chain = await getInitializedChain<Cardano | Ethereumish | Osmosis>(
    req.chain,
    req.network,
  );
  if (chain instanceof Osmosis) {
    return chain.controller.addLiquidity(chain as unknown as Osmosis, req);
  }
  const connector: UniswapLPish | MinSwap | Sundaeswap = await getConnector<
    UniswapLPish | MinSwap | Sundaeswap
  >(req.chain, req.network, req.connector);
  if (connector instanceof MinSwap) {
    return minswapAddLiquidity(<Cardano>chain, req);
  } else if (connector instanceof Sundaeswap) {
    return sundaeswapAddLiquidity(<Cardano>chain, connector, req);
  } else {
    return uniswapV3AddLiquidity(<Ethereumish>chain, connector, req);
  }
}

export async function reduceLiquidity(
  req: RemoveLiquidityRequest,
): Promise<RemoveLiquidityResponse> {
  const chain = await getInitializedChain<Cardano | Ethereumish | Osmosis>(
    req.chain,
    req.network,
  );
  if (chain instanceof Osmosis) {
    return chain.controller.removeLiquidity(chain as unknown as Osmosis, req);
  }
  const connector: UniswapLPish | MinSwap | Sundaeswap = await getConnector<
    UniswapLPish | MinSwap | Sundaeswap
  >(req.chain, req.network, req.connector);
  if (connector instanceof MinSwap) {
    return minswapRemoveLiquidity(<Cardano>chain, req);
  } else if (connector instanceof Sundaeswap) {
    return sundaeswapRemoveLiquidity(<Cardano>chain, connector, req);
  } else {
    return uniswapV3RemoveLiquidity(<Ethereumish>chain, connector, req);
  }
}

export async function collectFees(
  req: CollectEarnedFeesRequest,
): Promise<RemoveLiquidityResponse> {
  const chain = await getInitializedChain<Ethereumish | Osmosis>(
    req.chain,
    req.network,
  );
  if (chain instanceof Osmosis) {
    return chain.controller.collectFees(chain as unknown as Osmosis, req);
  }
  const connector: UniswapLPish = await getConnector<UniswapLPish>(
    req.chain,
    req.network,
    req.connector,
  );
  return uniswapV3CollectEarnedFees(chain, connector, req);
}

export async function positionInfo(
  req: PositionRequest,
): Promise<PositionResponse> {
  const chain = await getInitializedChain<Ethereumish | Osmosis>(
    req.chain,
    req.network,
  );
  if (chain instanceof Osmosis) {
    return chain.controller.poolPositions(chain as unknown as Osmosis, req);
  }
  const connector: UniswapLPish = await getConnector<UniswapLPish>(
    req.chain,
    req.network,
    req.connector,
  );
  return uniswapV3PositionInfo(chain, connector, req);
}

export async function poolPrice(
  req: PoolPriceRequest,
): Promise<PoolPriceResponse> {
  const chain = await getInitializedChain<Ethereumish | Cardano | Osmosis>(
    req.chain,
    req.network,
  );
  if (chain instanceof Osmosis) {
    return chain.controller.poolPrice(chain as unknown as Osmosis, req);
  }
  const connector: UniswapLPish | MinSwap | Sundaeswap = await getConnector<
    UniswapLPish | MinSwap | Sundaeswap
  >(req.chain, req.network, req.connector);

  if (connector instanceof MinSwap) {
    return minswapPoolPrice(<Cardano>chain, req);
  } else if (connector instanceof Sundaeswap) {
    return sundaeswapPoolPrice(<Cardano>chain, connector, req);
  } else {
    // return uniswapV3AddLiquidity(<Ethereumish>chain, connector, req);
    return uniswapV3PoolPrice(<Ethereumish>chain, connector, req);
  }
}

export async function estimateGas(
  req: NetworkSelectionRequest,
): Promise<EstimateGasResponse> {
  const chain = await getInitializedChain<
    Algorand | Ethereumish | Nearish | Tezosish | Osmosis
  >(req.chain, req.network);
  if (chain instanceof Osmosis) {
    return chain.controller.estimateGas(chain as unknown as Osmosis);
  }

  const connector: Uniswapish | RefAMMish | Tinyman | Plenty | QuipuSwap =
    await getConnector<Uniswapish | RefAMMish | Plenty | QuipuSwap>(
      req.chain,
      req.network,
      req.connector,
    );

  if (connector instanceof Plenty) {
    return plentyEstimateGas(<Tezosish>chain, connector);
  } else if (connector instanceof QuipuSwap) {
    return quipuEstimateGas(<Tezosish>chain, connector);
  } else if (connector instanceof Carbonamm) {
    return carbonEstimateGas(<Ethereumish>chain, connector);
  } else if ('routerAbi' in connector) {
    // we currently use the presence of routerAbi to distinguish Uniswapish from RefAMMish
    return uniswapEstimateGas(<Ethereumish>chain, connector);
  } else if (connector instanceof Tinyman) {
    return tinymanEstimateGas(chain as unknown as Algorand, connector);
  } else {
    return refEstimateGas(<Nearish>chain, connector as RefAMMish);
  }
}

// perp
export async function perpMarketPrices(
  req: PriceRequest,
): Promise<PerpPricesResponse> {
  const chain = await getInitializedChain<Ethereumish>(req.chain, req.network);
  const connector: Perpish = await getConnector<Perpish>(
    req.chain,
    req.network,
    req.connector,
  );
  return perpPriceData(chain, connector, req);
}

export async function perpOrder(
  req: PerpCreateTakerRequest,
  isOpen: boolean,
): Promise<PerpCreateTakerResponse> {
  const chain = await getInitializedChain<Ethereumish>(req.chain, req.network);
  const connector: Perpish = await getConnector<Perpish>(
    req.chain,
    req.network,
    req.connector,
    req.address,
  );
  return createTakerOrder(chain, connector, req, isOpen);
}

export async function perpPosition(
  req: PerpPositionRequest,
): Promise<PerpPositionResponse> {
  const chain = await getInitializedChain<Ethereumish>(req.chain, req.network);
  const connector: Perpish = await getConnector<Perpish>(
    req.chain,
    req.network,
    req.connector,
    req.address,
  );
  return getPosition(chain, connector, req);
}

export async function perpBalance(
  req: PerpBalanceRequest,
): Promise<PerpBalanceResponse> {
  const chain = await getInitializedChain(req.chain, req.network);
  const connector: Perpish = <Perpish>(
    await getConnector(req.chain, req.network, req.connector, req.address)
  );
  return getAccountValue(chain, connector);
}

export async function perpPairs(
  req: NetworkSelectionRequest,
): Promise<PerpAvailablePairsResponse> {
  const chain = await getInitializedChain<Ethereumish>(req.chain, req.network);
  const connector: Perpish = await getConnector<Perpish>(
    req.chain,
    req.network,
    req.connector,
  );
  return getAvailablePairs(chain, connector);
}

export async function getMarketStatus(
  req: PerpMarketRequest,
): Promise<PerpMarketResponse> {
  const chain = await getInitializedChain<Ethereumish>(req.chain, req.network);
  const connector: Perpish = await getConnector<Perpish>(
    req.chain,
    req.network,
    req.connector,
  );
  return checkMarketStatus(chain, connector, req);
}

export async function estimatePerpGas(
  req: NetworkSelectionRequest,
): Promise<EstimateGasResponse> {
  const chain = await getInitializedChain<Ethereumish>(req.chain, req.network);
  const connector: Perpish = await getConnector<Perpish>(
    req.chain,
    req.network,
    req.connector,
  );
  return perpEstimateGas(chain, connector);
}
