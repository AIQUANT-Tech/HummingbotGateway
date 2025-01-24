import request from 'supertest';
import { Cardano } from '../../../src/chains/cardano/cardano';
import { patch, unpatch } from '../../../test/services/patch';
import { gatewayApp } from '../../../src/app';
import {
    NETWORK_ERROR_CODE,
    UNKNOWN_ERROR_ERROR_CODE,
    NETWORK_ERROR_MESSAGE,
    UNKNOWN_ERROR_MESSAGE,
} from '../../../src/services/error-handler';
import * as transactionSuccesful from './fixtures/transaction-succesful.json';
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

const patchGetWallet = () => {
    patch(cardano, 'getWalletFromAddress', () => {
        return {
            privateKey:
                'ed25519_sk1wyzdzm3uyw8dg58y5vup33ujql9ml4e6zyshy90yqf6xj3knmfzsdp6lq4',
        };
    });
};

const patchGetNativeBalance = () => {
    patch(cardano, 'getNativeBalance', () => 100);
};


const patchGetTokenBySymbol = () => {
    patch(cardano, 'getTokenForSymbol', (symbol: string) => {
        let result;
        switch (symbol) {
            case 'ADA':
                result = [{
                    policyId: '',
                    assetName: 'lovelace',
                    decimals: 6,
                    name: 'Cardano Native Token',
                    symbol: 'ADA',
                    logoURI: 'https://ibb.co/N1Jmswk',
                }];
                break;
            case 'MIN':
                result = [{
                    policyId: 'e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed72',
                    assetName: '4d494e',
                    decimals: 6,
                    name: 'Minswap Token',
                    symbol: 'MIN',
                    logoURI: 'https://ibb.co/L1Tp0rQ',
                }];
                break;
        }
        return result;
    });
};

describe('POST /chain/balances', () => {
    it('should return 200 asking for supported tokens', async () => {
        patchGetWallet();
        patchGetTokenBySymbol();
        patchGetNativeBalance();

        await request(gatewayApp)
            .post(`/chain/balances`)
            .send({
                chain: 'cardano',
                network: 'preprod',
                address:
                    'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d',
                tokenSymbols: ['ADA', 'MIN'],
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                console.log(res.body);
                expect(res.body.balances.ADA).toBeDefined();
                expect(res.body.balances.MIN).toBeDefined();
            });
    });


    it('should return 200 asking for native token', async () => {
        patchGetWallet();
        patchGetTokenBySymbol();
        patchGetNativeBalance();

        await request(gatewayApp)
            .post(`/chain/balances`)
            .send({
                chain: 'cardano',
                network: 'preprod',
                address:
                    'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d',
                tokenSymbols: ['ADA'],
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => expect(res.body.balances.ADA).toBeDefined())

    });

    it('should return 500 for unsupported tokens', async () => {
        patchGetWallet();
        patchGetTokenBySymbol();
        patchGetNativeBalance();

        await request(gatewayApp)
            .post(`/chain/balances`)
            .send({
                chain: 'cardano',
                network: 'preprod',
                address:
                    'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d',
                tokenSymbols: ['XXX', 'YYY'],
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500);
    });

    it('should return 404 when parameters are invalid', async () => {
        await request(gatewayApp)
            .post(`/chain/balances`)
            .send({
                chain: 'cardano',
                network: 'preprod',
                address:
                    'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d',
            })
            .expect(404);
    });
});

describe('POST /chain/poll', () => {
    it('should get a NETWORK_ERROR_CODE when the network is unavailable', async () => {

        const res = await request(gatewayApp).post('/chain/poll').send({
            chain: 'cardano',
            network: 'testnet',
            txHash:
                '93a025572c09b2ebe9a3306f46e83510d3b2347fb023b89bfe41e4d92d0cf092', // noqa: mock
        });

        expect(res.statusCode).toEqual(503);
        expect(res.body.errorCode).toEqual(NETWORK_ERROR_CODE);
        expect(res.body.message).toEqual(NETWORK_ERROR_MESSAGE);
    });

    it('should get a UNKNOWN_ERROR_ERROR_CODE when an unknown error is thrown', async () => {
        patch(cardano, 'getTransaction', () => {
            throw new Error();
        });

        const res = await request(gatewayApp).post('/chain/poll').send({
            txHash:
                '93a025572c09b2ebe9a3306f46e83510d3b2347fb023b89bfe41e4d92d0cf092', // noqa: mock
        });

        expect(res.statusCode).toEqual(503);
        expect(res.body.errorCode).toEqual(UNKNOWN_ERROR_ERROR_CODE);
    });


    it('should get status = confirmed for a succesful query', async () => {
        patch(cardano, 'getTransaction', () => transactionSuccesful);
        const res = await request(gatewayApp).post('/chain/poll').send({
            chain: 'cardano',
            network: 'preprod',
            txHash:
                '93a025572c09b2ebe9a3306f46e83510d3b2347fb023b89bfe41e4d92d0cf092', // noqa: mock
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.block).toBeDefined();
        expect(res.body.blockHeight).toBeDefined();
    });

    it('should get unknown error when txHash is not valid', async () => {

        const res = await request(gatewayApp).post('/chain/poll').send({
            chain: 'cardano',
            network: 'preprod',
            txHash:
                'abcd', // noqa: mock
        });
        expect(res.statusCode).toEqual(503);
        expect(res.body.errorCode).toEqual(UNKNOWN_ERROR_ERROR_CODE);
        expect(res.body.message).toEqual(UNKNOWN_ERROR_MESSAGE);
    });
});
