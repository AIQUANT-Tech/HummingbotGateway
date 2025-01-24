import request from 'supertest';
import { gatewayApp } from '../../../src/app';
import { patch, unpatch } from '../patch';
import { Ethereum } from '../../../src/chains/ethereum/ethereum';
import { Avalanche } from '../../../src/chains/avalanche/avalanche';
import { Harmony } from '../../../src/chains/harmony/harmony';
import { Cardano } from '../../../src/chains/cardano/cardano';
import { ConfigManagerCertPassphrase } from '../../../src/services/config-manager-cert-passphrase';
import { GetWalletResponse } from '../../../src/services/wallet/wallet.requests';
let avalanche: Avalanche;
let eth: Ethereum;
let harmony: Harmony;
let cardano: Cardano;

beforeAll(async () => {
  patch(ConfigManagerCertPassphrase, 'readPassphrase', () => 'a');

  avalanche = Avalanche.getInstance('fuji');
  eth = Ethereum.getInstance('goerli');
  harmony = Harmony.getInstance('testnet');
  cardano = Cardano.getInstance('preprod');
});

beforeEach(() =>
  patch(ConfigManagerCertPassphrase, 'readPassphrase', () => 'a')
);

afterAll(async () => {
  await avalanche.close();
  await eth.close();
  await harmony.close();
  await cardano.close();
});

afterEach(() => unpatch());

const twoAddress = '0x2b5ad5c4795c026514f8317c7a215e218dccd6cf';
const cardanoAddress = 'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d'

const twoPrivateKey =
  '0000000000000000000000000000000000000000000000000000000000000002'; // noqa: mock
const cardanoPrivateKey = 'ed25519_sk1n24dk27xar2skjef5a5xvpk0uy0sqw62tt7hlv7wcpd4xp4fhy5sdask94'

// encoding of twoPrivateKey with the password 'a'
const encodedPrivateKey = {
  address: '2b5ad5c4795c026514f8317c7a215e218dccd6cf',
  id: '116e3405-ea6c-40ba-93c0-6a835ad2ea99',
  version: 3,
  Crypto: {
    cipher: 'aes-128-ctr',
    cipherparams: { iv: 'dccf7a5f7d66bc6a61cf4fda422dcd55' },
    ciphertext:
      'ce561ad92c6a507a9399f51d64951b763f01b4956f15fd298ceb7a1174d0394a', // noqa: mock
    kdf: 'scrypt',
    kdfparams: {
      salt: 'a88d99c6d01150af02861ebb1ace3b633a33b2a20561fe188a0c260a84d1ba99', // noqa: mock
      n: 131072,
      dklen: 32,
      p: 1,
      r: 8,
    },
    mac: '684b0111ed08611ad993c76b4524d5dcda18b26cb930251983c36f40160eba8f', // noqa: mock
  },
};

const cardanoEncryptedPrivateKey = {
  "algorithm": "aes-256-ctr",
  "iv": {
    "type": "Buffer",
    "data": [
      58, 68, 80, 141, 10, 254, 236, 255, 100, 50, 161, 116, 234, 131, 30, 53
    ]
  },
  "salt": {
    "type": "Buffer",
    "data": [
      85, 152, 161, 10, 209, 245, 196, 130, 253, 57, 52, 30, 128, 187, 197, 115,
      34, 100, 132, 10, 131, 167, 228, 40, 130, 81, 88, 13, 177, 90, 171, 128
    ]
  },
  "encrypted": {
    "type": "Buffer",
    "data": [
      76, 105, 161, 25, 20, 41, 160, 24, 85, 0, 118, 2, 138, 237, 191, 213, 21,
      11, 20, 228, 149, 153, 215, 45, 61, 77, 217, 85, 139, 45, 169, 64, 172,
      149, 87, 168, 82, 192, 89, 217, 202, 171, 239, 55, 211, 243, 242, 54, 27,
      172, 14, 236, 14, 222, 181, 125, 65, 196, 82, 188, 81, 92, 38, 189, 215,
      147, 152, 67, 38
    ]
  }
}


describe('POST /wallet/add', () => {
  it('return 200 for well formed ethereum request', async () => {
    patch(eth, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(eth, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'ethereum',
        network: 'goerli',
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 200 for well formed avalanche request', async () => {
    patch(avalanche, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(avalanche, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'avalanche',
        network: 'fuji',
      })

      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 200 for well formed harmony request', async () => {
    patch(harmony, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(harmony, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'harmony',
        network: 'testnet',
      })

      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 200 for well formed cardano request', async () => {
    patch(cardano, 'getWalletFromPrivateKey', () => {
      return {
        address: cardanoAddress,
      };
    });

    patch(cardano, 'encrypt', () => {
      return JSON.stringify(cardanoEncryptedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: cardanoPrivateKey,
        chain: 'cardano',
        network: 'preprod',
      })

      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 404 for ill-formed avalanche request', async () => {
    patch(avalanche, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(avalanche, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({})
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('return 404 for ill-formed harmony request', async () => {
    patch(harmony, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(harmony, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({})
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('DELETE /wallet/remove', () => {
  it('return 200 for well formed ethereum request', async () => {
    patch(eth, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(eth, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'ethereum',
        network: 'goerli',
      })

      .expect('Content-Type', /json/)
      .expect(200);

    await request(gatewayApp)
      .delete(`/wallet/remove`)
      .send({
        address: twoAddress,
        chain: 'ethereum',
      })

      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 200 for well formed harmony request', async () => {
    patch(harmony, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(harmony, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'harmony',
        network: 'testnet',
      })

      .expect('Content-Type', /json/)
      .expect(200);

    await request(gatewayApp)
      .delete(`/wallet/remove`)
      .send({
        address: twoAddress,
        chain: 'harmony',
      })

      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 200 for well formed cardano request', async () => {
    patch(cardano, 'getWalletFromPrivateKey', () => {
      return {
        address: cardanoAddress,
      };
    });

    patch(cardano, 'encrypt', () => {
      return JSON.stringify(cardanoEncryptedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: cardanoPrivateKey,
        chain: 'cardano',
        network: 'preprod',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    await request(gatewayApp)
      .delete(`/wallet/remove`)
      .send({
        address: cardanoAddress,
        chain: 'cardano',
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('return 404 for ill-formed request', async () => {
    await request(gatewayApp).delete(`/wallet/delete`).send({}).expect(404);
  });
});

describe('GET /wallet', () => {
  it('return 200 for well formed ethereum request', async () => {
    patch(eth, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(eth, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'ethereum',
        network: 'goerli',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    await request(gatewayApp)
      .get(`/wallet`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const wallets: GetWalletResponse[] = res.body;
        const addresses: string[][] = wallets
          .filter((wallet) => wallet.chain === 'ethereum')
          .map((wallet) => wallet.walletAddresses);

        expect(addresses[0]).toContain(twoAddress);
      });
  });

  it('return 200 for well formed harmony request', async () => {
    patch(harmony, 'getWalletFromPrivateKey', () => {
      return {
        address: twoAddress,
      };
    });

    patch(harmony, 'encrypt', () => {
      return JSON.stringify(encodedPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: twoPrivateKey,
        chain: 'harmony',
        network: 'testnet',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    await request(gatewayApp)
      .get(`/wallet`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const wallets: GetWalletResponse[] = res.body;
        const addresses: string[][] = wallets
          .filter((wallet) => wallet.chain === 'harmony')
          .map((wallet) => wallet.walletAddresses);

        expect(addresses[0]).toContain(twoAddress);
      });
  });

  it('return 200 for well formed cardano request', async () => {
    patch(cardano, 'getWalletFromPrivateKey', () => {
      return {
        address: cardanoAddress,
      };
    });

    patch(cardano, 'encrypt', () => {
      return JSON.stringify(cardanoPrivateKey);
    });

    await request(gatewayApp)
      .post(`/wallet/add`)
      .send({
        privateKey: cardanoPrivateKey,
        chain: 'cardano',
        network: 'preprod',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    await request(gatewayApp)
      .get(`/wallet`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        const wallets: GetWalletResponse[] = res.body;
        const addresses: string[][] = wallets
          .filter((wallet) => wallet.chain === 'cardano')
          .map((wallet) => wallet.walletAddresses);

        expect(addresses[0]).toContain(cardanoAddress);
      });
  });
});
