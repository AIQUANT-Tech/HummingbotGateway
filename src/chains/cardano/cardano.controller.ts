import { Cardano } from './cardano';
import { BalanceRequest } from '../../network/network.requests';
import { validateCardanoBalanceRequest } from './cardano.validators';

export class CardanoController {
    // balances function that fetches the balance for native token(ada) through fetching all utxos and calculating balances from that
    static async balances(chain: Cardano, request: BalanceRequest): Promise<{ balances: Record<string, string> }> {
        validateCardanoBalanceRequest(request);
        // selected wallet private key after decrypting it.
        const wallet = await chain.getWalletFromAddress(request.address);

        const balances: Record<string, string> = {};

        if (request.tokenSymbols.includes(chain.nativeTokenSymbol)) {
            balances[chain.nativeTokenSymbol] = await chain.getNativeBalance(wallet.privateKey);
        }

        return { balances };
    }
}
