import { Cardano, CardanoTokenInfo } from './cardano';
import { BalanceRequest } from '../../network/network.requests';
import { validateCardanoBalanceRequest, validateAssetsRequest, validateCardanoPollRequest } from './cardano.validators';
import {
    CardanoAsset,
    AssetsRequest,
    AssetsResponse,
    // OptInRequest,
    PollRequest,
    getNetworkId
} from './cardano.requests';
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

    // balances function that fetches the balance for native token(ada) through fetching all utxos and calculating balances from that
    static async balances(chain: Cardano, request: BalanceRequest): Promise<{ balances: Record<string, string> }> {
        validateCardanoBalanceRequest(request);
        // selected wallet private key after decrypting it.
        const wallet = await chain.getWalletFromAddress(request.address);

        const balances: Record<string, string> = {};

        if (request.tokenSymbols.includes(chain.nativeTokenSymbol)) {
            balances[chain.nativeTokenSymbol] = await chain.getNativeBalance(wallet.privateKey);
        }

        for (const token of request.tokenSymbols) {
            if (token === chain.nativeTokenSymbol) continue;
            balances[token] = await chain.getAssetBalance(wallet.privateKey, token);
        }

        return { balances };
    }

    static async getTokens(
        cardano: Cardano,
        request: TokensRequest
    ): Promise<{ tokens: TokenInfo[] }> {
        console.log(request);
        console.log(cardano);
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
