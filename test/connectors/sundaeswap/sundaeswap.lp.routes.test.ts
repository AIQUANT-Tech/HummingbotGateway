import express from 'express';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import { Cardano } from '../../../src/chains/cardano/cardano';
import { Sundaeswap } from '../../../src/connectors/sundaeswap/sundaeswap';
import { AmmLiquidityRoutes } from '../../../src/amm/amm.routes';
import { patch, unpatch } from '../../services/patch';

let app: Express;
let cardano: Cardano;
let sundaeswap: Sundaeswap;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  cardano = Cardano.getInstance('preview');
  await cardano.init();

  sundaeswap = Sundaeswap.getInstance('preview');
  await sundaeswap.init();
  app.use('/amm/liquidity', AmmLiquidityRoutes.router);
});

afterEach(() => {
  unpatch();
});

afterAll(async () => {
  await cardano.close();
});

const address: string =
  'addr_test1vz5x8hgp7tunnvm33m9mp4pwdxr3vrd5k03r4dq4yuh3znsyp3sum';

const patchGetWallet = () => {
  patch(cardano, 'getWalletFromAddress', () => {
    return {
      privateKey:
        'ed25519_sk14sx563crklgujpwhxcq8zehjwtv9rp2r4g6f6ntvet3f0eu2ztzqna56m9',
    };
  });
};

const patchInit = () => {
  patch(Sundaeswap, 'init', async () => {
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
          policyId: '99b071ce8580d6a3a11b4902145adb8bfd0d2a03935af8cf66403e15',
          assetName: '534245525259',
          decimals: 0,
          name: 'SBERRY Token',
          symbol: 'SBERRY',
          logoURI: 'https://ibb.co/hJbVKRJW',
        },
      ],
      [
        {
          policyId: '44a1eb2d9f58add4eb1932bd0048e6a1947e85e3fe4f32956a110414',
          assetName:
            '0014df102baab4c73a1cd60176f903a29a9c92ed4237c88622da51e9179121a3',
          decimals: 0,
          name: 'Sundaeswap Liquidity pool token',
          symbol: 'LP',
          logoURI: 'hhttps://ibb.co/JWr1GWs3',
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
            policyId: 'ada',
            assetName: 'lovelace',
            decimals: 6,
            name: 'Cardano Native Token',
            symbol: 'ADA',
            logoURI: 'https://ibb.co/N1Jmswk',
          },
        ];
        break;
      case 'SBERRY':
        result = [
          {
            policyId:
              '99b071ce8580d6a3a11b4902145adb8bfd0d2a03935af8cf66403e15',
            assetName: '534245525259',
            decimals: 0,
            name: 'SBERRY Token',
            symbol: 'SBERRY',
            logoURI: 'https://ibb.co/hJbVKRJW',
          },
        ];
        break;
      case 'LP':
        result = [
          {
            policyId:
              '44a1eb2d9f58add4eb1932bd0048e6a1947e85e3fe4f32956a110414',
            assetName:
              '0014df102baab4c73a1cd60176f903a29a9c92ed4237c88622da51e9179121a3',
            decimals: 0,
            name: 'Sundaeswap Liquidity pool token',
            symbol: 'LP',
            logoURI: 'hhttps://ibb.co/JWr1GWs3',
          },
        ];
    }
    return result;
  });
};

describe('POST /liquidity/price', () => {
  const patchForBuy = () => {
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
    patch(sundaeswap, 'poolPrice', () => {
      return ['100', '105'];
    });
  };
  it('should return 200 when all parameter are OK', async () => {
    patchForBuy();
    await request(app)
      .post(`/amm/liquidity/price`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        token0: 'SBERRY',
        token1: 'ADA',
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
        network: 'preview',
        connector: 'sundaeswap',
        token0: 'SBERRY',
        token1: 'ADA',
        fee: 11,
        period: 120,
        interval: 60,
      })
      .set('Accept', 'application/json')
      .expect(404);
  });
});

describe('POST /liquidity/add', () => {
  it('should return 200 when all parameter are OK', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/liquidity/add`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        token0: 'SBERRY',
        token1: 'ADA',
        amount0: '107043',
        amount1: '10',
        fee: 'LOW',
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.txHash).toBeDefined();
      });
  });

  it('should return 500 for unrecognized token0 symbol', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/liquidity/add`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        token0: 'DOGE',
        token1: 'ADA',
        amount0: '1000',
        amount1: '40258550',
        fee: 'LOW',
      })
      .set('Accept', 'application/json')
      .expect(500);
  });

  it('should return 404 for invalid fee tier', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/liquidity/add`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        token0: 'SBERRY',
        token1: 'ADA',
        amount0: '1000',
        amount1: '40258550',
        fee: 300,
      })
      .set('Accept', 'application/json')
      .expect(404);
  });
});

describe('POST /liquidity/remove', () => {
  const patchForBuy = () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
  };
  it('should return 200 when all parameter are OK', async () => {
    patchForBuy();
    await request(app)
      .post(`/amm/liquidity/remove`)
      .send({
        address: address,
        tokenId: 0,
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        decreasePercent: 50,
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.txHash).toBeDefined();
      });
  });

  it('should return 404 when the tokenId is invalid', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();

    await request(app)
      .post(`/amm/liquidity/remove`)
      .send({
        address: address,
        tokenId: 'Invalid',
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        decreasePercent: 50,
      })
      .set('Accept', 'application/json')
      .expect(404);
  });
});
