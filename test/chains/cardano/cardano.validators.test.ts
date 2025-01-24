import {
    validateCardanoAddress,
    validateAssetSymbols,
} from '../../../src/chains/cardano/cardano.validators';

import 'jest-extended';

describe('validateCardanoAddress', () => {
    it('should pass for a well-formed Cardano address', () => {
        const req = { address: 'addr_test1vznd34ydghfh2aw8cnn5lgw90vpvlg82ngj30wzue0rw5jgct5m7d' };
        expect(validateCardanoAddress(req)).toEqual([]);
    });

    it('should fail for a string that does not start with (addr|addr_test)', () => {
        const req = { address: '0xFaA12FD102FE8623C9299c72' };
        expect(validateCardanoAddress(req)).toEqual(['Invalid Cardano address.']);
    });

    it('should fail for a string with non-hexadecimal characters', () => {
        const req = { address: 'addr_pqrst' };
        expect(validateCardanoAddress(req)).toEqual(['Invalid Cardano address.']);
    });
});

describe('validateAssetSymbols', () => {
    it('should pass for a well-formed asset symbols', () => {
        const req = { symbols: ['ADA', 'MIN'] };
        expect(validateAssetSymbols(req)).toEqual([]);
    });

    it('should fail for a string with non-hexadecimal characters', () => {
        const req = { symbols: ['ADA', ''] };
        expect(validateAssetSymbols(req)).toEqual([]);
    });
});
