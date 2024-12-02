import {
    invalidTokenSymbolsError,
    mkRequestValidator,
    mkValidator,
    RequestValidator,
    validateTokenSymbols,
    Validator,
} from '../../services/validators';

const invalidChainError: string = 'The chain param is not a string.';
const invalidNetworkError: string = 'The network param is not a string.';
const invalidCardanoAddressError = "Invalid Cardano address.";


const validateCardanoChain: Validator = mkValidator(
    'chain',
    invalidChainError,
    (val) => typeof val === 'string' && val === 'cardano'
);


export const validateNetwork: Validator = mkValidator(
    'network',
    invalidNetworkError,
    (val) => typeof val === 'string'
);

const cardanoAddressRegex = /^(addr|addr_test)[0-9a-zA-Z]{1,}$/;

export const validateCardanoAddress: Validator = mkValidator(
    'address',
    invalidCardanoAddressError,
    (val) => typeof val === 'string' && cardanoAddressRegex.test(val)
);

export const validateCardanoBalanceRequest: RequestValidator =
    mkRequestValidator([
        validateCardanoChain,
        validateNetwork,
        validateCardanoAddress,
        validateTokenSymbols,
    ]);