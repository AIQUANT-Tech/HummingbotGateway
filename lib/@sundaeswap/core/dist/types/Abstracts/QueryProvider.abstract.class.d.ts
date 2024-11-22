import type { TUTXO } from "../@types/datumbuilder.js";
import type { IPoolData } from "../@types/queryprovider.js";
/**
 * The base Provider interface by which you can implement custom Provider classes.
 *
 * @group Extension Builders
 */
export declare abstract class QueryProvider {
    abstract baseUrl: string;
    /**
     * Finds a matching pool on the SundaeSwap protocol.
     *
     * @param query The query object as defined by the implementing class.
     * @returns {Promise<IPoolData>} Returns the queried pool's data.
     */
    abstract findPoolData: (query: any) => Promise<IPoolData>;
    /**
     * Finds the associated UTXO data of an open order.
     *
     * @param utxo The transaction hash and index of the open order in the escrow contract.
     */
    abstract findOpenOrderDatum: (utxo: TUTXO) => Promise<{
        datum: string;
        datumHash: string;
    }>;
}
//# sourceMappingURL=QueryProvider.abstract.class.d.ts.map