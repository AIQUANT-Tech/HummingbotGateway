import {
  invalidEthPrivateKeyError,
  isEthPrivateKey,
  validatePrivateKey,
  invalidChainError,
  invalidAddressError,
  validateChain,
  validateAddress,
  validateAccountID,
  isNearPrivateKey,
  isCosmosPrivateKey,
  isCardanoPrivateKey,
  invalidCosmosPrivateKeyError,
  invalidAccountIDError,
} from '../../../src/services/wallet/wallet.validators';

import { missingParameter } from '../../../src/services/validators';

import 'jest-extended';

describe('isEthPrivateKey', () => {
  it('pass against a well formed private key', () => {
    expect(
      isEthPrivateKey(
        'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4' // noqa: mock
      )
    ).toEqual(true);
  });

  it('fail against a string that is too short', () => {
    expect(isEthPrivateKey('da857cbda0ba96757fed842617a40693d0')).toEqual(
      false
    );
  });

  it('fail against a string that has non-hexadecimal characters', () => {
    expect(
      isEthPrivateKey(
        'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747qwer'
      )
    ).toEqual(false);
  });
});

describe('isCosmosPrivateKey', () => {
  it('pass against a well formed private key', () => {
    expect(
      isCosmosPrivateKey(
        '218507defde7d91a9eba858437115b8aea68e3cbc7a4b68b3edac53d5ec89515' // noqa: mock
      )
    ).toEqual(true);
  });

  it('fail against a string that is invalid', () => {
    expect(
      isCosmosPrivateKey(
        '218507defde7d91a9eba858437115b8aea68e3cbc7a4b68b3edac53d5ec8951' // noqa: mock
      )
    ).toEqual(false);
  });
});

describe('isNearPrivateKey', () => {
  it('pass against a well formed private key', () => {
    expect(
      isNearPrivateKey(
        'ed25519:5r1MuqBa3L9gpXHqULS3u2B142c5jA8szrEiL8cprvhjJDe6S2xz9Q4uppgaLegmuPpq4ftBpcMw7NNoJHJefiTt'
      )
    ).toEqual(true);
  });

  it('fail against a string that is invalid', () => {
    expect(isEthPrivateKey('ed25519')).toEqual(false);
  });
});

describe('isCardanoPrivateKey', () => {
  it('pass against a well formed private key', () => {
    expect(
      isCardanoPrivateKey(
        'ed25519_sk1n24dk27xar2skjef5a5xvpk0uy0sqw62tt7hlv7wcpd4xp4fhy5sdask94' // noqa: mock
      )
    ).toEqual(true);
  });

  it('fail against a string that is invalid', () => {
    expect(
      isCardanoPrivateKey(
        'test123' // noqa: mock
      )
    ).toEqual(false);
  });
});

describe('validatePrivateKey', () => {
  it('valid when req.privateKey is an ethereum key', () => {
    expect(
      validatePrivateKey({
        chain: 'ethereum',
        privateKey:
          'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a near key', () => {
    expect(
      validatePrivateKey({
        chain: 'near',
        privateKey:
          'ed25519:5r1MuqBa3L9gpXHqULS3u2B142c5jA8szrEiL8cprvhjJDe6S2xz9Q4uppgaLegmuPpq4ftBpcMw7NNoJHJefiTt',
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a harmony key', () => {
    expect(
      validatePrivateKey({
        chain: 'harmony',
        privateKey:
          'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a cronos key', () => {
    expect(
      validatePrivateKey({
        chain: 'cronos',
        privateKey:
          'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a polygon key', () => {
    expect(
      validatePrivateKey({
        chain: 'polygon',
        privateKey:
          'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a avalanche key', () => {
    expect(
      validatePrivateKey({
        chain: 'avalanche',
        privateKey:
          'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is an binance-smart-chain key', () => {
    expect(
      validatePrivateKey({
        chain: 'binance-smart-chain',
        privateKey:
          'da857cbda0ba96757fed842617a40693d06d00001e55aa972955039ae747bac4', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a cosmos key', () => {
    expect(
      validatePrivateKey({
        chain: 'cosmos',
        privateKey:
          '218507defde7d91a9eba858437115b8aea68e3cbc7a4b68b3edac53d5ec89516', // noqa: mock
      })
    ).toEqual([]);
  });

  it('valid when req.privateKey is a cardano key', () => {
    expect(
      validatePrivateKey({
        chain: 'cardano',
        privateKey:
          'ed25519_sk1n24dk27xar2skjef5a5xvpk0uy0sqw62tt7hlv7wcpd4xp4fhy5sdask94', // noqa: mock
      })
    ).toEqual([]);
  });

  it('return error when req.privateKey does not exist', () => {
    expect(
      validatePrivateKey({
        chain: 'ethereum',
        hello: 'world',
      })
    ).toEqual([missingParameter('privateKey')]);
  });


  it('return error when req.chain does not exist', () => {
    expect(
      validatePrivateKey({
        privateKey:
          '5r1MuqBa3L9gpXHqULS3u2B142c5jA8szrEiL8cprvhjJDe6S2xz9Q4uppgaLegmuPpq4ftBpcMw7NNoJHJefiTt',
      })
    ).toEqual([missingParameter('chain')]);
  });

  it('return error when req.privateKey is invalid ethereum key', () => {
    expect(
      validatePrivateKey({
        chain: 'ethereum',
        privateKey: 'world',
      })
    ).toEqual([invalidEthPrivateKeyError]);
  });

  it('return error when req.privateKey is invalid binance-smart-chain key', () => {
    expect(
      validatePrivateKey({
        chain: 'binance-smart-chain',
        privateKey: 'someErroneousPrivateKey',
      })
    ).toEqual([invalidEthPrivateKeyError]);
  });

  it('return error when req.privateKey is invalid cosmos key', () => {
    expect(
      validatePrivateKey({
        chain: 'cosmos',
        privateKey: 'someErroneousPrivateKey',
      })
    ).toEqual([invalidCosmosPrivateKeyError]);
  });
});

describe('validateChain', () => {
  it('valid when chain is ethereum', () => {
    expect(
      validateChain({
        chain: 'ethereum',
      })
    ).toEqual([]);
  });

  it('valid when chain is avalanche', () => {
    expect(
      validateChain({
        chain: 'avalanche',
      })
    ).toEqual([]);
  });

  it('valid when chain is harmony', () => {
    expect(
      validateChain({
        chain: 'harmony',
      })
    ).toEqual([]);
  });

  it('valid when chain is binance-smart-chain', () => {
    expect(
      validateChain({
        chain: 'binance-smart-chain',
      })
    ).toEqual([]);
  });

  it('valid when chain is cronos', () => {
    expect(
      validateChain({
        chain: 'cronos',
      })
    ).toEqual([]);
  });

  it('valid when chain is binance-smart-chain', () => {
    expect(
      validateChain({
        chain: 'binance-smart-chain',
      })
    ).toEqual([]);
  });

  it('valid when chain is cosmos', () => {
    expect(
      validateChain({
        chain: 'cosmos',
      })
    ).toEqual([]);
  });

  it('valid when chain is cardano', () => {
    expect(
      validateChain({
        chain: 'cardano',
      })
    ).toEqual([]);
  });

  it('return error when req.chain does not exist', () => {
    expect(
      validateChain({
        hello: 'world',
      })
    ).toEqual([missingParameter('chain')]);
  });

  it('return error when req.chain is invalid', () => {
    expect(
      validateChain({
        chain: 'shibainu',
      })
    ).toEqual([invalidChainError]);
  });
});

describe('validateAddress', () => {
  it('valid when address is a string', () => {
    expect(
      validateAddress({
        address: '0x000000000000000000000000000000000000000',
      })
    ).toEqual([]);
  });

  it('valid when cardano address is a string', () => {
    expect(
      validateAddress({
        address: 'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d',
      })
    ).toEqual([]);
  });

  it('return error when req.address does not exist', () => {
    expect(
      validateAddress({
        hello: 'world',
      })
    ).toEqual([missingParameter('address')]);
  });

  it('return error when req.address is not a string', () => {
    expect(
      validateAddress({
        address: 1,
      })
    ).toEqual([invalidAddressError]);
  });
});

describe('validateAccountID', () => {
  it('valid when account ID is a string', () => {
    expect(
      validateAccountID({
        accountId: '0x000000000000000000000000000000000000000',
      })
    ).toEqual([]);
  });

  it('valid when account ID is not specified', () => {
    expect(validateAccountID({})).toEqual([]);
  });

  it('return error when req.accountId is not a string', () => {
    expect(validateAccountID({ accountId: 1 })).toEqual([
      invalidAccountIDError,
    ]);
  });
});
