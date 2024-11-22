"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SundaeSDK = exports.SDK_OPTIONS_DEFAULTS = void 0;
const index_js_1 = require("./@types/index.js");
const DatumBuilder_Lucid_V1_class_js_1 = require("./DatumBuilders/DatumBuilder.Lucid.V1.class.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("./DatumBuilders/DatumBuilder.Lucid.V3.class.js");
const QueryProviderSundaeSwap_js_1 = require("./QueryProviders/QueryProviderSundaeSwap.js");
const TxBuilder_Lucid_V1_class_js_1 = require("./TxBuilders/TxBuilder.Lucid.V1.class.js");
const TxBuilder_Lucid_V3_class_js_1 = require("./TxBuilders/TxBuilder.Lucid.V3.class.js");
exports.SDK_OPTIONS_DEFAULTS = {
    minLockAda: 5000000n,
    debug: false,
};
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
class SundaeSDK {
    builders = new Map();
    queryProvider;
    options;
    /**
     * Builds a class instance using the arguments specified.
     *
     * @param {ISundaeSDKOptions} args - The primary arguments object for the SDK.
     * @returns {SundaeSDK}
     */
    constructor(args) {
        this.queryProvider =
            args.customQueryProvider ||
                new QueryProviderSundaeSwap_js_1.QueryProviderSundaeSwap(args.wallet.network);
        this.options = {
            ...args,
            ...exports.SDK_OPTIONS_DEFAULTS,
        };
        this.registerTxBuilders();
    }
    /**
     * Registers TxBuilders depending on the TxBuilder
     * type. Currently we only support Lucid, but plan on adding
     * more types in the future. This gives full flexibility to the
     * client in which they can utilize the SDK according to their
     * software stack.
     */
    registerTxBuilders() {
        switch (this.options.wallet.builder.type) {
            case index_js_1.ETxBuilderType.LUCID:
                this.builders.set(index_js_1.EContractVersion.V1, new TxBuilder_Lucid_V1_class_js_1.TxBuilderLucidV1(this.options.wallet.builder.lucid, new DatumBuilder_Lucid_V1_class_js_1.DatumBuilderLucidV1(this.options.wallet.network)));
                this.builders.set(index_js_1.EContractVersion.V3, new TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3(this.options.wallet.builder.lucid, new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3(this.options.wallet.network)));
                // Helper: initialize wallet if not already done so.
                if (!this.options.wallet.builder.lucid.wallet) {
                    window.cardano[this.options.wallet.name]
                        .enable()
                        .then((api) => this.options.wallet.builder.lucid.selectWallet(api));
                }
                break;
            default:
                throw new Error("A valid wallet provider type must be defined in your options object.");
        }
    }
    /**
     * Utility method to retrieve the SDK options object.
     *
     * @returns {ISundaeSDKOptions}
     */
    getOptions() {
        return this.options;
    }
    /**
     * Creates the appropriate transaction builder by which you can create valid transactions.
     *
     * @returns {TxBuilder}
     */
    builder(contractVersion = index_js_1.EContractVersion.V1) {
        if (!this.builders.has(contractVersion)) {
            throw new Error("Could not find a matching TxBuilder for this version. Please register a custom builder with `.registerBuilder()` first, then try again.");
        }
        switch (contractVersion) {
            case index_js_1.EContractVersion.V3: {
                return this.builders.get(contractVersion);
            }
            default:
            case index_js_1.EContractVersion.V1: {
                return this.builders.get(contractVersion);
            }
        }
    }
    /**
     * Utility method to retrieve the provider instance.
     *
     * @returns {QueryProvider} - The QueryProvider instance.
     */
    query() {
        return this.queryProvider;
    }
}
exports.SundaeSDK = SundaeSDK;
//# sourceMappingURL=SundaeSDK.class.js.map