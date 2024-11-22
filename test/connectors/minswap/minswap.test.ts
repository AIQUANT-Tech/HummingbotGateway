jest.useFakeTimers();
//const { MockProvider } = require('mock-ethers-provider');
import { price as minswapPrice } from '../../../src/connectors/minswap/minswap.controllers';

import { trade as minswapTrade } from '../../../src/connectors/minswap/minswap.controllers';
import { removeLiquidity as minswapremoveLiquidity } from '../../../src/connectors/minswap/minswap.controllers';
import { addLiquidity as minswapaddLiquidity } from '../../../src/connectors/minswap/minswap.controllers';

import { Cardano as CardanoChain } from '../../../src/chains/cardano/cardano';
import {
  PriceRequest,
  //PriceResponse,
  TradeRequest,
 // TradeResponse,
  RemoveLiquidityRequest,
 // RemoveLiquidityResponse,
  AddLiquidityRequest,
 // AddLiquidityResponse,
} from '../../../src/amm/amm.requests';
import { MinSwap } from '../../../src/connectors/minswap/minswap';
describe('verify Minswap MIN/ADA pool token price', () => {
  it('Should return the price factor and total expected price when available', async () => {
    let request: PriceRequest = {
      chain: 'cardano',
      network: 'preprod', // the target network of the chain (e.g. preprod)
      connector: 'minswap', //the target connector
      poolId:
        '3bb0079303c57812462dec9de8fb867cef8fd3768de7f12c77f6f0dd80381d0d',
      quote: 'MIN',
      base: 'ADA',
      amount: '5',
      side: 'BUY', //it can be BUY or SELL
    };
    const expectedPrice = await minswapPrice(
      CardanoChain.getInstance('preprod'),
      MinSwap.getInstance(request.network),
      request,
    );
    expect(expectedPrice).toHaveProperty('price');
    expect(expectedPrice).toHaveProperty('expectedAmount');
  });
});

describe('to place a BUY/SELL transaction on MIN/ADA pool', () => {
  it('Should execute BUY/SELL trade and return the transaction hash when successful', async () => {
    let request: TradeRequest = {
      chain: 'cardano',
      network: 'mainnet', // the target network of the chain (e.g. preprod)
      connector: 'minswap',
      poolId:
        '3bb0079303c57812462dec9de8fb867cef8fd3768de7f12c77f6f0dd80381d0d',
      quote: 'MIN',
      base: 'ADA',
      amount: '5',
      seedPhrase: 'walletseedphrase', //to connect to the cardano user wallet
      side: 'BUY', //it can be BUY or SELL
      address: 'stringaddress'
    };
    const expectedTrade = await minswapTrade(
      CardanoChain.getInstance('preprod'),
      MinSwap.getInstance(request.network),
      request,
    );
    expect(expectedTrade).toHaveProperty('txHash');
    expect(expectedTrade).toHaveProperty('latency');
    expect(expectedTrade).toHaveProperty('nonce');
  });
});
describe('to place a CANCEL transaction on MIN/ADA pool', () => {
  it('Should execute CANCEL trade and return the transaction hash when successful', async () => {
    let request: TradeRequest = {
      chain: 'cardano',
      network: 'mainnet', // the target network of the chain (e.g. preprod)
      connector: 'minswap', //the target connector
      poolId:
        '3bb0079303c57812462dec9de8fb867cef8fd3768de7f12c77f6f0dd80381d0d',
      quote: 'MIN',
      base: 'ADA',
      amount: '5',
      side: 'BUY',
      seedPhrase: 'walletseedphrase', //to connect to the cardano user wallet
      isCancelled: true, //to identify cancel txn for cardano
      txnHash: 'transactionhash', //this is to cancel txn for Cardano
      address: 'stringaddress'
    };
    const expectedTrade = await minswapTrade(
      CardanoChain.getInstance('preprod'),
      MinSwap.getInstance(request.network),
      request,
    );
    expect(expectedTrade).toHaveProperty('txHash');
    expect(expectedTrade).toHaveProperty('latency');
    expect(expectedTrade).toHaveProperty('nonce');
  });
});
describe('to add liquidity to the identified MIN/ADA pool', () => {
  it('Should add liquidity to the identified MIN/ADA pool when successful', async () => {
    let request: AddLiquidityRequest = {
      chain: 'cardano',
      network: 'preprod', // the target network of the chain (e.g. preprod)
      connector: 'minswap', //the target connector
      poolId:
        '3bb0079303c57812462dec9de8fb867cef8fd3768de7f12c77f6f0dd80381d0d',
      address: 'walletaddress',
      token0: 'MIN', //depositedAmountA
      token1: 'ADA', //depositedAmountB
      amount0: '5',
      amount1: '5',
      seedPhrase: 'walletseedphrase', //to connect to the cardano user wallet
    };
    const expectedTrade = await minswapaddLiquidity(
      CardanoChain.getInstance('preprod'),
      request
    );
    expect(expectedTrade).toHaveProperty('token0');
    expect(expectedTrade).toHaveProperty('token1');
    expect(expectedTrade).toHaveProperty('fee');
    expect(expectedTrade).toHaveProperty('tokenId');
    expect(expectedTrade).toHaveProperty('nonce');
    expect(expectedTrade).toHaveProperty('txHash');
  });
});

describe('to remove liquidity from the identified MIN/ADA pool', () => {
  it('Should remove liquidity from the identified MIN/ADA pool when successful', async () => {
    let request: RemoveLiquidityRequest = {
      chain: 'cardano',
      network: 'preprod', // the target network of the chain (e.g. preprod)
      connector: 'minswap', //the target connector
      poolId: 'poolId', //poolId here
      tokenId : 5,
      address: 'walletaddress',
      decreasePercent: 5, //for cardano need to send the waithdrawal amount here
      seedPhrase: 'walletseedphrase', //to connect to the cardano user wallet
    };
    const expectedTrade = await minswapremoveLiquidity(
      CardanoChain.getInstance('preprod'),
      request
    );
    expect(expectedTrade).toHaveProperty('tokenId');
    expect(expectedTrade).toHaveProperty('txHash');
    expect(expectedTrade).toHaveProperty('nonce');
    expect(expectedTrade).toHaveProperty('latency');
  });
});
