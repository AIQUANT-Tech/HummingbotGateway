import { AssetAmount, IAssetAmountMetadata } from "./AssetAmount.js";
export interface IAssetRatioPool<T extends IAssetAmountMetadata = any> {
    assetA: T;
    assetB: T;
}
/**
 * This class represents an AssetRatio, which includes a numerator and a denominator AssetAmounts, and optionally, an AssetRatioPool.
 *
 * @class
 * @template T - Metadata type for the assets, which extends from the IAssetAmountMetadata interface.
 *
 * @property {AssetAmount<T>} numerator - The numerator part of the ratio, represented as an AssetAmount.
 * @property {AssetAmount<T>} denominator - The denominator part of the ratio, represented as an AssetAmount.
 * @property {IAssetRatioPool} [pool] - Optional property to represent an asset ratio pool.
 *
 * @example
 * const assetRatio = new AssetRatio(numeratorAsset, denominatorAsset, assetsPool);
 */
export declare class AssetRatio<T extends IAssetAmountMetadata = any> {
    pool?: IAssetRatioPool;
    numerator: AssetAmount<T>;
    denominator: AssetAmount<T>;
    /**
     * Creates a new AssetRatio.
     *
     * @constructor
     * @param {AssetAmount<T>} numerator - The numerator AssetAmount.
     * @param {AssetAmount<T>} denominator - The denominator AssetAmount.
     * @param {IAssetRatioPool} [pool] - Optional assets pool data.
     *
     * If the pool and metadata for both numerator and denominator are provided, the numerator and denominator
     * are arranged according to the pool's assetA assetId. If not, they are kept as they were provided.
     */
    constructor(numerator: AssetAmount<T>, denominator: AssetAmount<T>, pool?: IAssetRatioPool);
    /**
     * Calculates the limit price.
     *
     * The limit price is calculated by dividing the numerator amount by the denominator amount,
     * then adjusting for the difference in decimal places between the numerator and denominator.
     *
     * @returns {number} The calculated limit price.
     */
    getLimitPrice(): number;
    /**
     * Creates an asset ratio from a given limit price.
     *
     * The ratio is calculated by multiplying the denominator's amount with the limit price, adjusting for decimal differences.
     *
     * @param {number} limitPrice - The limit price used to create the asset ratio.
     * @returns {AssetRatio<T>} The created asset ratio.
     */
    updateLimitPrice(limitPrice: number): AssetRatio<T>;
}
//# sourceMappingURL=AssetRatio.d.ts.map