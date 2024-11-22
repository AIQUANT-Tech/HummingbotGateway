import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import type { EContractVersion, EPoolCoin, ICurrentFeeFromDecayingFeeArgs, IPoolData, ISundaeProtocolParams, TFee, TSupportedNetworks } from "../@types/index.js";
export declare class SundaeUtils {
    static ADA_ASSET_IDS: string[];
    static MAINNET_OFFSET: number;
    static PREVIEW_OFFSET: number;
    /**
     * Helper function to check if an asset is ADA.
     * @param {IAssetAmountMetadata} asset The asset metadata.
     * @returns {boolean}
     */
    static isAdaAsset(asset?: IAssetAmountMetadata): boolean;
    /**
     * Helper function to check if a pool identifier is a valid V3 pool identifier.
     * @param poolIdent The pool identifier to be checked.
     * @returns {boolean} Returns true if the pool identifier is a valid V3 pool identifier, otherwise false.
     */
    static isV3PoolIdent(poolIdent: string): boolean;
    /**
     * Determines if a given asset is a Liquidity Pool (LP) asset based on its policy ID, associated protocols, and version.
     * This method checks whether the asset's policy ID matches the hash of the 'pool.mint' validator in the specified protocol version.
     *
     * @static
     * @param {Object} params - The parameters for the method.
     * @param {string} params.assetPolicyId - The policy ID of the asset to be checked.
     * @param {IProtocol[]} params.protocols - An array of protocol objects, where each protocol corresponds to a different contract version.
     * @param {EContractVersion} params.version - The version of the contract to be used for validating the asset.
     * @returns {boolean} Returns true if the asset's policy ID matches the 'pool.mint' validator hash in the specified protocol version, otherwise false.
     */
    static isLPAsset({ assetPolicyId, protocols, version, }: {
        assetPolicyId: string;
        protocols: ISundaeProtocolParams[];
        version: EContractVersion;
    }): boolean;
    static sortSwapAssetsWithAmounts(assets: [
        AssetAmount<IAssetAmountMetadata>,
        AssetAmount<IAssetAmountMetadata>
    ]): [AssetAmount<IAssetAmountMetadata>, AssetAmount<IAssetAmountMetadata>];
    static getAssetSwapDirection(asset: IAssetAmountMetadata, assets: [IAssetAmountMetadata, IAssetAmountMetadata]): EPoolCoin;
    /**
     * Subtracts the pool fee percentage from the asset amount.
     *
     * @param {AssetAmount<IAssetAmountMetadata>} amount The amount we are subtracting from.
     * @param {TFee} fee The fee percentage, represented as a tuple: [numerator, denominator].
     * @returns
     */
    static subtractPoolFeeFromAmount(amount: AssetAmount<IAssetAmountMetadata>, fee: TFee): number;
    static getCurrentFeeFromDecayingFee({ endFee, endSlot, network, startFee, startSlot, }: ICurrentFeeFromDecayingFeeArgs): number;
    /**
     * Calculates the current fee based on a decaying fee structure between a start and an end point in time.
     * The fee decays linearly from the start fee to the end fee over the period from the start slot to the end slot.
     *
     * @param {ICurrentFeeFromDecayingFeeArgs} args - An object containing necessary arguments:
     *   @param {number[]} args.endFee - The fee percentage at the end of the decay period, represented as a Fraction.
     *   @param {number} args.endSlot - The slot number representing the end of the fee decay period.
     *   @param {TSupportedNetworks} args.network - The network identifier to be used for slot to Unix time conversion.
     *   @param {number[]} args.startFee - The starting fee percentage at the beginning of the decay period, represented as a Fraction.
     *   @param {number} args.startSlot - The slot number representing the start of the fee decay period.
     *
     * @returns {number} The interpolated fee percentage as a number, based on the current time within the decay period.
     *
     * @example
     * ```ts
     * const currentFee = getCurrentFeeFromDecayingFee({
     *   endFee: [1, 100], // 1%
     *   endSlot: 12345678,
     *   network: 'preview',
     *   startFee: [2, 100], // 2%
     *   startSlot: 12345600
     * });
     * console.log(currentFee); // Outputs the current fee percentage based on the current time
     * ```
     */
    static getMinReceivableFromSlippage(pool: IPoolData, suppliedAsset: AssetAmount<IAssetAmountMetadata>, slippage: number): AssetAmount<IAssetAmountMetadata>;
    /**
     * Helper function to test equality of asset ids. This is necessary
     * because of inconsistent naming conventions across the industry for
     * the asset id of the native Cardano token ADA. The function also
     * normalizes the asset ids by ensuring they follow a standard format
     * before comparing them. If an asset id does not contain a '.', it is
     * normalized by appending a '.' at the end. This normalization step
     * ensures consistent comparisons regardless of slight variations in
     * the asset id format.
     *
     * @param {string} aId The first asset's assetId (both policy and asset name IDs).
     * @param {string} bId The second asset's assetId (both policy and asset name IDs).
     * @returns {boolean}
     */
    static isAssetIdsEqual(aId: string, bId: string): boolean;
    /**
     * Takes an array of {@link IAsset} and aggregates them into an object of amounts.
     * This is useful for when you are supplying an asset that is both for the payment and
     * the Order.
     *
     * @param suppliedAssets
     */
    static accumulateSuppliedAssets({ scooperFee, suppliedAssets, orderDeposit, }: {
        orderDeposit?: bigint;
        suppliedAssets: AssetAmount<IAssetAmountMetadata>[];
        scooperFee: bigint;
    }): Record<
    /** The PolicyID and the AssetName concatenated together with no period. */
    string | "lovelace", 
    /** The amount as a bigint (no decimals) */
    bigint>;
    /**
     * Calculates the best liquidity pool for a given swap based on the available pools,
     * the given asset, and the taken asset. It determines the best pool by
     * finding the one that provides the highest output for a fixed input amount.
     *
     * @param {IPoolData[]} availablePools - An array of available liquidity pools for the selected pair.
     * @param {AssetAmount<IAssetAmountMetadata>} [given] - The asset amount and metadata of the given asset.
     * @param {AssetAmount<IAssetAmountMetadata>} [taken] - The asset amount and metadata of the taken asset.
     * @returns {IPoolData | undefined} The liquidity pool that offers the best swap outcome, or undefined if no suitable pool is found.
     */
    static getBestPoolBySwapOutcome({ availablePools, given, taken, }: {
        availablePools: IPoolData[];
        given?: AssetAmount<IAssetAmountMetadata>;
        taken?: AssetAmount<IAssetAmountMetadata>;
    }): IPoolData | undefined;
    /**
     * Split a long string into an array of chunks for metadata.
     *
     * @param str Full string that you wish to split by chunks of 64.
     * @param prefix Optional prefix to add to each chunk. This is useful if your transaction builder has helper functions to convert strings to CBOR bytestrings (i.e. Lucid will convert strings with a `0x` prefix).
     */
    static splitMetadataString(str: string, prefix?: string): string[];
    /**
     * Helper function to convert unix timestamp to slot
     * by subtracting the network's slot offset.
     *
     * @param {number} unix The time in seconds.
     * @param {TSupportedNetworks} network The network.
     * @returns {number}
     */
    static unixToSlot(unix: number | string, network: TSupportedNetworks): number;
    /**
     * Helper function to convert slot to unix timestamp
     * by adding the network's slot offset.
     *
     * @param {number} unix The time in seconds.
     * @param {TSupportedNetworks} network The network.
     * @returns {number}
     */
    static slotToUnix(unix: number | string, network: TSupportedNetworks): number;
}
//# sourceMappingURL=SundaeUtils.class.d.ts.map