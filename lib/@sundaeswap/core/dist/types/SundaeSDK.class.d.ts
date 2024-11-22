import { EContractVersion, ISundaeSDKOptions } from "./@types/index.js";
import { QueryProvider } from "./Abstracts/QueryProvider.abstract.class.js";
import { TxBuilderLucidV1 } from "./TxBuilders/TxBuilder.Lucid.V1.class.js";
import { TxBuilderLucidV3 } from "./TxBuilders/TxBuilder.Lucid.V3.class.js";
export declare const SDK_OPTIONS_DEFAULTS: Pick<ISundaeSDKOptions, "minLockAda" | "debug">;
/**
 * The main SundaeSDK class that contains all the necessary sub-classes for
 * interacting with the SundaeSwap protocol.
 *
 * ```ts
 * const sdk = new SundaeSDK({
 *   baseType: EBasePrototype.Lucid,
 *   network: "preview"
 * });
 *
 * sdk.builder().buildSwapTx({ ...args })
 *   .then(async ({ build, sign }) => {
 *     const { fees } = await build();
 *     console.log(fees);
 *
 *     const { submit } = await sign();
 *     const txHash = submit();
 *
 *     console.log(txHash);
 *   })
 * ```
 */
export declare class SundaeSDK {
    private builders;
    private queryProvider;
    private options;
    /**
     * Builds a class instance using the arguments specified.
     *
     * @param {ISundaeSDKOptions} args - The primary arguments object for the SDK.
     * @returns {SundaeSDK}
     */
    constructor(args: ISundaeSDKOptions);
    /**
     * Registers TxBuilders depending on the TxBuilder
     * type. Currently we only support Lucid, but plan on adding
     * more types in the future. This gives full flexibility to the
     * client in which they can utilize the SDK according to their
     * software stack.
     */
    private registerTxBuilders;
    /**
     * Utility method to retrieve the SDK options object.
     *
     * @returns {ISundaeSDKOptions}
     */
    getOptions(): ISundaeSDKOptions;
    builder(contractVersion: EContractVersion.V1): TxBuilderLucidV1;
    builder(contractVersion: EContractVersion.V3): TxBuilderLucidV3;
    builder(contractVersion?: EContractVersion): TxBuilderLucidV1 | TxBuilderLucidV3;
    /**
     * Utility method to retrieve the provider instance.
     *
     * @returns {QueryProvider} - The QueryProvider instance.
     */
    query(): QueryProvider;
}
//# sourceMappingURL=SundaeSDK.class.d.ts.map