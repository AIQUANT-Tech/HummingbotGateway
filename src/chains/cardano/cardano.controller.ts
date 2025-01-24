import { Cardano, CardanoTokenInfo } from './cardano';
import { BalanceRequest } from '../../network/network.requests';
import { validateCardanoBalanceRequest, validateAssetsRequest, validateCardanoPollRequest } from './cardano.validators';
import {
    PollRequest,
    getNetworkId
} from './cardano.requests';
import {
    HttpException,
    LOAD_WALLET_ERROR_CODE,
    LOAD_WALLET_ERROR_MESSAGE,
    TOKEN_NOT_SUPPORTED_ERROR_CODE,
    TOKEN_NOT_SUPPORTED_ERROR_MESSAGE,
} from '../../services/error-handler';

import { TokensRequest } from '../../network/network.requests';
import { TokenInfo } from '../../services/base';
export class CardanoController {

    static async poll(
        cardano: Cardano,
        req: PollRequest
    ): Promise<Object | undefined> {
        validateCardanoPollRequest(req);

        return await cardano.getTransaction(req.txHash);
    }

    static async balances(chain: Cardano, request: BalanceRequest): Promise<{ balances: Record<string, string> }> {
        validateCardanoBalanceRequest(request);

        // Selected wallet private key after decrypting it
        const wallet = await chain.getWalletFromAddress(request.address);

        const balances: Record<string, string> = {};

        // Get native token balance if included in request
        if (request.tokenSymbols.includes(chain.nativeTokenSymbol)) {
            balances[chain.nativeTokenSymbol] = await chain.getNativeBalance(wallet.privateKey);
        }

        // Iterate through requested token symbols
        for (const token of request.tokenSymbols) {
            if (token === chain.nativeTokenSymbol) continue;

            try {
                balances[token] = await chain.getAssetBalance(wallet.privateKey, token);
            } catch (error) {
                // Handle token not supported errors
                throw new HttpException(
                    500,
                    TOKEN_NOT_SUPPORTED_ERROR_MESSAGE + error,
                    TOKEN_NOT_SUPPORTED_ERROR_CODE
                );
            }
        }

        return { balances };
    }

    static async getTokens(
        cardano: Cardano,
        request: TokensRequest
    ): Promise<{ tokens: TokenInfo[] }> {
        let cardanoTokens: CardanoTokenInfo[] = [];
        validateAssetsRequest(request);
        if (!request.tokenSymbols) {
            cardanoTokens = cardano.storedTokenList;
        } else {
            for (const t of request.tokenSymbols as []) {
                const arr = cardano.getTokenForSymbol(t);
                if (arr !== undefined) {
                    arr.forEach((token) => {
                        cardanoTokens.push(token);
                    });
                }
            }
        }
        const tokens: TokenInfo[] = [];

        // Convert xrpTokens into tokens
        cardanoTokens.map((cardanoToken) => {
            const token: TokenInfo = {
                address: cardanoToken.policyId + cardanoToken.assetName,
                chainId: getNetworkId(request.network),
                decimals: 6,
                name: cardanoToken.name,
                symbol: cardanoToken.symbol,
            };
            tokens.push(token);
        });

        return { tokens };
    }

}
