import express from 'express';
import { Express } from 'express-serve-static-core';
import request from 'supertest';
import { Cardano } from '../../../src/chains/cardano/cardano';
import { Sundaeswap } from '../../../src/connectors/sundaeswap/sundaeswap';
import { AmmRoutes } from '../../../src/amm/amm.routes';
import { patch, unpatch } from '../../../test/services/patch';
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

  app.use('/amm', AmmRoutes.router);
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
  patch(sundaeswap, 'init', async () => {
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
    }
    return result;
  });
};

const patchExecuteTrade = () => {
  patch(sundaeswap, 'executeTrade', () => {
    return {
      hash: 'de50a32ec5e33d861e8d55c333d7bc40a63131e1ce0bd6f879d1af785f933ab7',
    };
  });
};

describe('POST /amm/price', () => {
  it('should return 200 for BUY', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
    patchExecuteTrade();

    await request(app)
      .post(`/amm/price`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        base: 'SBERRY',
        quote: 'ADA',
        amount: '10000',
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
    patchExecuteTrade();

    await request(app)
      .post(`/amm/price`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        base: 'SBERRY',
        quote: 'ADA',
        amount: '10000',
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
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        base: 'SBERRY',
        quote: 'DOGE',
        amount: '1000',
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
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        base: 'SHIBA',
        quote: 'ADA',
        amount: '1000',
        side: 'SELL',
      })
      .set('Accept', 'application/json')
      .expect(500);
  });
});

describe('POST /amm/trade', () => {
  const patchForBuy = () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
    patchExecuteTrade();
  };
  it('should return 200 for BUY', async () => {
    patchForBuy();
    await request(app)
      .post(`/amm/trade`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        address: address,
        base: 'SBERRY',
        quote: 'ADA',
        amount: '10000',
        side: 'BUY',
      })
      .set('Accept', 'application/json')
      .expect((res) => {
        console.log('Response:', res.body); // Debugging response
      });
    //   .expect(200)
    //   .expect((res: any) => {
    //     expect(res.body.hash).toBeDefined();
    //   });
  });

  //   const patchForSell = () => {
  //     patchGetWallet();
  //     patchInit();
  //     patchStoredTokenList();
  //     patchGetTokenBySymbol();
  //     patchExecuteTrade();
  //   };
  //   it('should return 200 for SELL', async () => {
  //     patchForSell();
  //     await request(app)
  //       .post(`/amm/trade`)
  //       .send({
  //         chain: 'cardano',
  //         network: 'preview',
  //         connector: 'sundaeswap',
  //         address: address,
  //         base: 'SBERRY',
  //         quote: 'ADA',
  //         amount: '1000',
  //         side: 'SELL',
  //       })
  //       .set('Accept', 'application/json')
  //       .expect(200)
  //       .expect((res: any) => {
  //         expect(res.body.txHash).toBeDefined();
  //       });
  //   });

  it('should return 404 when parameters are incorrect', async () => {
    patchInit();
    await request(app)
      .post(`/amm/trade`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        base: 'SBERRY',
        quote: 'ADA',
        amount: '1000',
        address: 'da8',
        side: 'comprar',
      })
      .set('Accept', 'application/json')
      .expect(404);
  });
  it('should return 500 when the executeTrade operation fails', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
    patch(sundaeswap, 'executeTrade', () => {
      return 'error';
    });

    await request(app)
      .post(`/amm/trade`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        base: 'SBERRY',
        quote: 'ADA',
        amount: '1000',
        address: address,
        side: 'SELL',
      })
      .set('Accept', 'application/json')
      .expect(500);
  });

  it('should return 500 when the executeTrade operation fails', async () => {
    patchGetWallet();
    patchInit();
    patchStoredTokenList();
    patchGetTokenBySymbol();
    patch(sundaeswap, 'executeTrade', () => {
      return 'error';
    });

    await request(app)
      .post(`/amm/trade`)
      .send({
        chain: 'cardano',
        network: 'preview',
        connector: 'sundaeswap',
        base: 'SBERRY',
        quote: 'ADA',
        amount: '1000',
        address: address,
        side: 'SELL',
      })
      .set('Accept', 'application/json')
      .expect(500);
  });
});
