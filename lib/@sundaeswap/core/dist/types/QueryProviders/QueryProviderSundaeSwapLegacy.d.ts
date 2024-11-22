import { TUTXO } from "../@types/datumbuilder.js";
import { IPoolData } from "../@types/queryprovider.js";
import { TSupportedNetworks } from "../@types/utilities.js";
import { QueryProvider } from "../Abstracts/QueryProvider.abstract.class.js";
/**
 * Legacy query interface for the legacy API.
 */
export interface IPoolQueryLegacy {
    /** The pool pair, as an array of {@link IPoolDataAsset.assetId} */
    pair: [string, string];
    /** The desired pool fee as a percentage string. */
    fee: string;
    /** Narrow the results even more if you want to get by ident. */
    ident?: string;
}
/**
 * This class provides a simple set of useful tooling, but primarily is used to
 * query data about pools on the SundaeSwap protocol.
 *
 * @example
 * ```ts
 * const query = new QueryProviderSundaeSwapLegacy("preview");
 * const { ident } = await query.findPoolData({
 *   pair: [assetAId, assetBId],
 *   fee: "0.03"
 * });
 *
 * console.log(ident); // "02"
 * ```
 *
 * @group Extensions
 */
export declare class QueryProviderSundaeSwapLegacy implements QueryProvider {
    protected network: TSupportedNetworks;
    baseUrl: string;
    constructor(network: TSupportedNetworks);
    findPoolData({ pair: [coinA, coinB], fee, ident, }: IPoolQueryLegacy): Promise<IPoolData>;
    findOpenOrderDatum(utxo: TUTXO): Promise<{
        datum: string;
        datumHash: string;
    }>;
}
//# sourceMappingURL=QueryProviderSundaeSwapLegacy.d.ts.map