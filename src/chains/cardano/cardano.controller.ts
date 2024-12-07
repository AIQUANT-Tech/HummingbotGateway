import { Cardano } from './cardano';
import { BalanceRequest } from '../../network/network.requests';
import { validateCardanoBalanceRequest, validateAssetsRequest, validateCardanoPollRequest } from './cardano.validators';
import {
    CardanoAsset,
    AssetsRequest,
    AssetsResponse,
    // OptInRequest,
    PollRequest,
} from './cardano.requests';
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
            balances[token] = await chain.getAssetBalance(wallet.privateKey);
        }

        return { balances };
    }

    static async getTokens(
        cardano: Cardano,
        request: AssetsRequest
    ): Promise<AssetsResponse> {
        validateAssetsRequest(request);

        let assets: CardanoAsset[] = [];
        console.log("cardano ", cardano);
        console.log("request ", request);
        console.log("request.tokenSymbols ", request.tokenSymbols);
        return {
            assets: assets,
        };
    }
}
