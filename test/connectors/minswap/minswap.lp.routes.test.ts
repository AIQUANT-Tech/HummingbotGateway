import express from 'express';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import { Cardano } from '../../../src/chains/cardano/cardano';
import { MinSwap } from '../../../src/connectors/minswap/minswap';
import * as MinswapController from '../../../src/connectors/minswap/minswap.controllers';
import { AmmLiquidityRoutes } from '../../../src/amm/amm.routes';
import { patch, unpatch } from '../../services/patch';

let app: Express;
let cardano: Cardano;
let minswap: MinSwap;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  cardano = Cardano.getInstance('preprod');
  await cardano.init();

  minswap = MinSwap.getInstance('preprod');
  await minswap.init();
  app.use('/amm/liquidity', AmmLiquidityRoutes.router);
});

afterEach(() => {
  unpatch();
});

afterAll(async () => {
  await cardano.close();
});

const address: string =
  'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d';

const patchGetWallet = () => {
  patch(cardano, 'getWalletFromAddress', () => {
    return {
      privateKey:
        'ed25519_sk1wyzdzm3uyw8dg58y5vup33ujql9ml4e6zyshy90yqf6xj3knmfzsdp6lq4',
    };
  });
};

const patchInit = () => {
  patch(minswap, 'init', async () => {
    return;
  });
};

const patchStoredTokenList = () => {
  patch(cardano, 'tokenList', () => {
    return [
      [
        {
          policyId: '',
          assetName: 'lovelace',
          decimals: 6,
          name: 'Cardano Native Token',
          symbol: 'ADA',
          logoURI: 'https://ibb.co/N1Jmswk',
        },
      ],
      [
        {
          policyId: 'e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed72',
          assetName: '4d494e',
          decimals: 6,
          name: 'Minswap Token',
          symbol: 'MIN',
          logoURI: 'https://ibb.co/L1Tp0rQ',
        },
      ],
    ];
  });
};

const patchGetTokenBySymbol = () => {
  patch(cardano, 'getTokenForSymbol', (symbol: string) => {
    let result;
    switch (symbol) {
      case 'ADA':
        result = [
          {
            policyId: '',
            assetName: 'lovelace',
            decimals: 6,
            name: 'Cardano Native Token',
            symbol: 'ADA',
            logoURI: 'https://ibb.co/N1Jmswk',
          },
        ];
        break;
      case 'MIN':
        result = [
          {
            policyId:
              'e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed72',
            assetName: '4d494e',
            decimals: 6,
            name: 'Minswap Token',
            symbol: 'MIN',
            logoURI: 'https://ibb.co/L1Tp0rQ',
          },
        ];
        break;
    }
    return result;
  });
};

describe('POST /liquidity/price', () => {
  const patchForBuy = () => {
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
    patch(minswap, 'poolPrice', () => {
      return ['100', '105'];
    });
  };
  it('should return 200 when all parameter are OK', async () => {
    patchForBuy();
    await request(app)
      .post(`/amm/liquidity/price`)
      .send({
        chain: 'cardano',
        network: 'preprod',
        connector: 'minswap',
        token0: 'ADA',
        token1: 'MIN',
        fee: 'LOW',
        period: 120,
        interval: 60,
      })
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('should return 404 when the fee is invalid', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/liquidity/price`)
      .send({
        chain: 'cardano',
        network: 'preprod',
        connector: 'minswap',
        token0: 'ADA',
        token1: 'MIN',
        fee: 11,
        period: 120,
        interval: 60,
      })
      .set('Accept', 'application/json')
      .expect(404);
  });
});

describe('POST /amm/liquidity/add', () => {
  beforeEach(() => {
    patch(
      MinswapController,
      'addLiquidity',
      async (_cardano: any, req: any) => ({
        network: req.network,
        timestamp: Date.now(),
        latency: 0,
        token0: req.token0,
        token1: req.token1,
        fee: req.fee!,
        tokenId: req.tokenId ?? 0,
        gasPrice: 0,
        gasPriceToken: 'n/a',
        gasLimit: 0,
        gasCost: 'n/a',
        nonce: 0,
        txHash: 'FAKE_ADD_HASH',
      }),
    );
  });

  it('returns 200 when parameters are OK', async () => {
    const res = await request(app).post('/amm/liquidity/add').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      token0: 'ADA',
      token1: 'MIN',
      amount0: '1',
      amount1: '2',
      fee: 'LOW',
    });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('FAKE_ADD_HASH');
  });

  it('returns 500 on unrecognized token0', async () => {
    // stub to throw if token0 invalid
    patch(MinswapController, 'addLiquidity', async () => {
      throw new Error('bad token');
    });

    const res = await request(app).post('/amm/liquidity/add').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      token0: 'DOGE',
      token1: 'MIN',
      amount0: '1',
      amount1: '2',
      fee: 'LOW',
    });

    expect(res.status).toBe(500);
  });

  it('returns 404 on invalid fee tier', async () => {
    // leave addLiquidity stubbed, but controller fee‐validation should catch invalid fee
    const res = await request(app).post('/amm/liquidity/add').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      token0: 'ADA',
      token1: 'MIN',
      amount0: '1',
      amount1: '2',
      fee: 'INVALID_FEE',
    });

    expect(res.status).toBe(404);
  });
});

describe('POST /amm/liquidity/remove', () => {
  beforeEach(() => {
    patch(
      MinswapController,
      'removeLiquidity',
      async (_cardano: any, req: any) => ({
        network: req.network,
        timestamp: Date.now(),
        latency: 0,
        tokenId: req.tokenId,
        gasPrice: 0,
        gasPriceToken: 'n/a',
        gasLimit: 0,
        gasCost: 'n/a',
        nonce: 0,
        txHash: 'FAKE_REMOVE_HASH',
      }),
    );
  });

  it('returns 200 when parameters are OK', async () => {
    const res = await request(app).post('/amm/liquidity/remove').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      tokenId: 0,
      decreasePercent: 50,
    });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('FAKE_REMOVE_HASH');
  });

  it('returns 404 on invalid tokenId', async () => {
    // leave removeLiquidity stubbed, but controller param‐validation should catch invalid tokenId
    const res = await request(app).post('/amm/liquidity/remove').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      tokenId: 'INVALID',
      decreasePercent: 50,
    });

    expect(res.status).toBe(404);
  });
});
