import { Cardano } from '../../../src/chains/cardano/cardano';
import { patch, unpatch } from '../../../test/services/patch';
import { CardanoTokenInfo } from '../../../src/chains/cardano/cardano';
import {
    HttpException,
    LOAD_WALLET_ERROR_CODE,
    LOAD_WALLET_ERROR_MESSAGE,
} from '../../../src/services/error-handler';

import {
    CardanoController,
} from '../../../src/chains/cardano/cardano.controller';

let cardano: Cardano;

beforeAll(async () => {
    cardano = Cardano.getInstance('preprod');
    await cardano.init();
});

afterEach(() => {
    unpatch();
});


afterAll(async () => {
    await cardano.close();
});


describe('init', () => {
    it('should wait for the first init() call to finish in future immediate init() calls', async () => {
        let firstCallFullfilled = false;

        // Ensure the first `init` call is awaited properly
        const firstCall = cardano.init().then(() => {
            firstCallFullfilled = true;
        });

        // Wait for the first call to complete
        await firstCall;

        // Now make the second `init` call
        await cardano.init();

        // Assert that the first call was completed before the second
        expect(firstCallFullfilled).toEqual(true);
    });
});

const min: CardanoTokenInfo = {
    policyId: 'e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed72',
    assetName: '4d494e',
    decimals: 6,
    name: "Minswap Token",
    symbol: 'MIN',
    logoURI: "https://ibb.co/L1Tp0rQ"
};

describe('getTokenSymbolsToTokens', () => {
    it('should return correct token for the symbol', () => {
        // Mock the function using patch or jest mock (depending on the method)
        patch(cardano, 'getTokenForSymbol', () => {
            return min;
        });

        // Make the assertion
        expect(cardano.getTokenForSymbol('MIN')).toEqual(min);
    });
});

const mockAddress = 'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d';

describe('balances', () => {
    it('fail if wallet not found', async () => {
        const err = 'wallet does not exist';

        // Patch `getWallet` to throw the error
        patch(cardano, 'getWalletFromAddress', () => {
            throw new HttpException(
                500,
                LOAD_WALLET_ERROR_MESSAGE + 'Error: ' + err,
                LOAD_WALLET_ERROR_CODE
            );
        });


        await expect(
            CardanoController.balances(cardano, {
                chain: 'cardano',
                network: 'preprod',
                address: mockAddress,
                tokenSymbols: ['ADA', 'MIN'],
            })
        ).rejects.toThrow(
            new HttpException(
                500,
                LOAD_WALLET_ERROR_MESSAGE + 'Error: ' + err,
                LOAD_WALLET_ERROR_CODE
            )
        );
    });
});
