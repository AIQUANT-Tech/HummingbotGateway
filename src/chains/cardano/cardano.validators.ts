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
const invalidTxHashError: string = 'The txHash param must be a string.';


const validateCardanoChain: Validator = mkValidator(
    'chain',
    invalidChainError,
    (val) => typeof val === 'string' && val === 'cardano'
);

const validateTxHash: Validator = mkValidator(
    'txHash',
    invalidTxHashError,
    (val) => typeof val === 'string'
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

export const validateAssetSymbols: Validator = (req: any) => {
    const errors: Array<string> = [];
    if (req.assetSymbols) {
        if (Array.isArray(req.assetSymbols)) {
            req.tokenSymbols.forEach((symbol: any) => {
                if (typeof symbol !== 'string') {
                    errors.push(invalidTokenSymbolsError);
                }
            });
        } else if (typeof req.assetSymbols !== 'string') {
            errors.push(invalidTokenSymbolsError);
        }
    }
    return errors;
};
export const validateAssetsRequest: RequestValidator = mkRequestValidator([
    validateNetwork,
    validateAssetSymbols,
]);

export const validateCardanoPollRequest: RequestValidator = mkRequestValidator(
    [validateNetwork, validateTxHash]
);

export const validateCardanoBalanceRequest: RequestValidator =
    mkRequestValidator([
        validateCardanoChain,
        validateNetwork,
        validateCardanoAddress,
        validateTokenSymbols,
    ]);