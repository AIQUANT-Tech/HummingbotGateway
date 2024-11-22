import { EContractVersion, IPoolByIdentQuery, IPoolData, ISundaeProtocolParams, ISundaeProtocolParamsFull, TSupportedNetworks, TUTXO } from "../@types/index.js";
import { QueryProvider } from "../Abstracts/QueryProvider.abstract.class.js";
/**
 * This class provides a simple set of useful tooling, but primarily is used to
 * query data about pools on the SundaeSwap protocol.
 *
 * @example
 * ```ts
 * const query = new QueryProviderSundaeSwap("preview");
 * const { ident } = await query.findPoolData({
 *   ident: "02"
 * });
 *
 * console.log(ident); // "02"
 * ```
 *
 * @group Extensions
 */
export declare class QueryProviderSundaeSwap implements QueryProvider {
    protected network: TSupportedNetworks;
    baseUrl: string;
    constructor(network: TSupportedNetworks);
    findPoolData({ ident }: IPoolByIdentQuery): Promise<IPoolData>;
    findOpenOrderDatum(utxo: TUTXO): Promise<{
        datum: string;
        datumHash: string;
    }>;
    /**
     * Retrieves the script hashes for all available Protocols.
     *
     * @param {EContractVersion} version The protocol script hashes.
     */
    getProtocolParamsWithScriptHashes(version: undefined): Promise<ISundaeProtocolParams[]>;
    getProtocolParamsWithScriptHashes(version: EContractVersion): Promise<ISundaeProtocolParams>;
    /**
     * Retrieves the script hashes for all available Protocols.
     *
     * @param {EContractVersion} version The protocol script hashes.
     */
    getProtocolParamsWithScripts(version: undefined): Promise<ISundaeProtocolParamsFull[]>;
    getProtocolParamsWithScripts(version: EContractVersion): Promise<ISundaeProtocolParamsFull>;
}
//# sourceMappingURL=QueryProviderSundaeSwap.d.ts.map