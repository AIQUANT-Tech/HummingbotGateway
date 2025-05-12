import express from 'express';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import { Cardano } from '../../../src/chains/cardano/cardano';
import { MinSwap } from '../../../src/connectors/minswap/minswap';
import * as MinswapController from '../../../src/connectors/minswap/minswap.controllers';
import { AmmRoutes } from '../../../src/amm/amm.routes';
import { patch, unpatch } from '../../../test/services/patch';
let app: Express;
let cardano: Cardano;
let minswap: any;

beforeAll(async () => {
  app = express();
  app.use(express.json());

  cardano = Cardano.getInstance('preprod');
  await cardano.init();

  minswap = MinSwap.getInstance('preprod');
  await minswap.init();

  app.use('/amm', AmmRoutes.router);
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
          policyId: 'ada',
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

const patchTrade = () => {
  patch(
    MinswapController,
    'trade',
    async (_cardano: any, _minswap: any, req: any) => ({
      network: req.network,
      timestamp: Date.now(),
      latency: 0,
      base: req.base,
      quote: req.quote,
      amount: req.amount,
      rawAmount: req.amount,
      expectedIn: req.amount,
      price: req.amount,
      gasPrice: 0,
      gasPriceToken: 'n/a',
      gasLimit: 0,
      gasCost: '',
      nonce: req.nonce ?? 0,
      txHash: 'FAKE_HASH',
    }),
  );
};

describe('POST /amm/price', () => {
  it('should return 200 for BUY', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/price`)
      .send({
        chain: 'cardano',
        network: 'preprod',
        connector: 'minswap',
        address: address,
        base: 'ADA',
        quote: 'MIN',
        amount: '100',
        side: 'BUY',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res: any) => {
        expect(res.body.amount).toBeDefined();
        expect(res.body.rawAmount).toBeDefined();
      });
  });

  it('should return 200 for SELL', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/price`)
      .send({
        chain: 'cardano',
        network: 'preprod',
        connector: 'minswap',
        address: address,
        base: 'ADA',
        quote: 'MIN',
        amount: '100',
        side: 'SELL',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then((res: any) => {
        expect(res.body.amount).toBeDefined();
        expect(res.body.rawAmount).toBeDefined();
      });
  });

  it('should return 500 for unrecognized quote symbol', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/price`)
      .send({
        chain: 'cardano',
        network: 'preprod',
        connector: 'minswap',
        address: address,
        base: 'ADA',
        quote: 'DOGE',
        amount: '100',
        side: 'SELL',
      })
      .set('Accept', 'application/json')
      .expect(500);
  });

  it('should return 500 for unrecognized base symbol', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/price`)
      .send({
        chain: 'cardano',
        network: 'preprod',
        connector: 'minswap',
        address: address,
        base: 'SHIBA',
        quote: 'MIN',
        amount: '100',
        side: 'SELL',
      })
      .set('Accept', 'application/json')
      .expect(500);
  });
});

describe('POST /amm/trade', () => {
  it('should return 200 for BUY', async () => {
    // Stub the entire trade() controller for BUY
    patchTrade();

    const res = await request(app).post('/amm/trade').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      base: 'ADA',
      quote: 'MIN',
      amount: '100',
      side: 'BUY',
    });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('FAKE_HASH');
  });

  it('should return 200 for SELL', async () => {
    // Stub the entire trade() controller for SELL
    patchTrade();

    const res = await request(app).post('/amm/trade').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      base: 'ADA',
      quote: 'MIN',
      amount: '100',
      side: 'SELL',
    });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('FAKE_HASH');
  });

  it('should return 404 when parameters are incorrect', async () => {
    const res = await request(app).post('/amm/trade').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      base: 'ADA',
      quote: 'MIN',
      amount: '100',
      address: 'bad_addr',
      side: 'comprar',
    });

    expect(res.status).toBe(404);
  });

  it('should return 500 when swapExactInTx fails', async () => {
    // Stubbing trade itself to throw for SELL path
    patch(MinswapController, 'trade', async () => {
      throw new Error('boom');
    });

    const res = await request(app).post('/amm/trade').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      base: 'ADA',
      quote: 'MIN',
      amount: '100',
      side: 'SELL',
    });

    expect(res.status).toBe(500);
  });

  it('should return 500 when swapExactOutTx fails', async () => {
    // Stubbing trade itself to throw for BUY path
    patch(MinswapController, 'trade', async () => {
      throw new Error('boom');
    });

    const res = await request(app).post('/amm/trade').send({
      chain: 'cardano',
      network: 'preprod',
      connector: 'minswap',
      address: address,
      base: 'ADA',
      quote: 'MIN',
      amount: '100',
      side: 'BUY',
    });

    expect(res.status).toBe(500);
  });
});
