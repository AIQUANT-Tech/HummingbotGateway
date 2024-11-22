import { Fraction, TFractionLike, TIntegerLike } from "@sundaeswap/fraction";
import { IHasStringId, TFungibleToken } from "./Asset.js";
import { AssetRatio } from "./AssetRatio.js";
export interface IAssetAmountExtraMetadata {
    [key: string]: any;
}
export interface IAssetAmountMetadata extends IAssetAmountExtraMetadata {
    id?: string;
    assetId: string;
    decimals: number;
}
/**
 * Class representing a fungible token with BigInt amount, decimals and id.
 * @template T
 * @extends {IAssetAmountMetadata}
 * @implements {TFungibleToken}
 */
export declare class AssetAmount<T extends IAssetAmountMetadata = IAssetAmountMetadata> implements TFungibleToken {
    static readonly DEFAULT_FUNGIBLE_TOKEN_DECIMALS = 0;
    static INVALID_METADATA: string;
    readonly metadata: T;
    readonly id: string;
    readonly decimals: number;
    readonly amount: bigint;
    readonly value: Fraction;
    /**
     * Represent a token amount and decimals as `Fraction` (`value`)
     * @param {bigint} amount - The amount of token.
     * @param {number} decimals - The decimal places of the token amount.
     * @returns {Fraction} - The token amount represented as a fraction.
     */
    static toValue(amount: bigint, decimals?: number): Fraction;
    /**
     * Creates a new `AssetAmount` instance with fraction like `value`, `decimals` and `id`
     * @template T
     * @param {TFractionLike} value - The token amount represented as a fraction.
     * @param {number | T} metadata - The metadata associated with the asset amount.
     * @returns {AssetAmount<T>} - A new AssetAmount instance.
     */
    static fromValue<T extends IAssetAmountMetadata = IAssetAmountMetadata>(value: TFractionLike, metadata?: number | T): AssetAmount<T>;
    /**
     * Creates a new `AssetAmount` instance with `amount`, `decimals` and `metadata`
     * @param {TIntegerLike} amount - The token amount, bigint represented as string, number or bigint. Default: 0n.
     * @param {number | T} metadata - The metadata associated with the asset amount.
     */
    constructor(amount?: TIntegerLike, metadata?: number | T);
    withAmount: (amount: TIntegerLike) => AssetAmount<T>;
    withValue: (value: TFractionLike) => AssetAmount<T>;
    withMetadata<U extends IAssetAmountMetadata>(metadata: U): AssetAmount<U>;
    add: (rhs: AssetAmount) => AssetAmount<T>;
    plus: (rhs: AssetAmount) => AssetAmount<T>;
    subtract: (rhs: AssetAmount) => AssetAmount<T>;
    minus: (rhs: AssetAmount) => AssetAmount<T>;
    sub: (rhs: AssetAmount) => AssetAmount<T>;
    addValue: (value: TFractionLike) => AssetAmount<T>;
    plusValue: (rhs: AssetAmount) => AssetAmount<T>;
    subtractValue: (value: TFractionLike) => AssetAmount<T>;
    minusValue: (rhs: AssetAmount) => AssetAmount<T>;
    subValue: (rhs: AssetAmount) => AssetAmount<T>;
    equalsAssetId: (rhs: IHasStringId) => boolean;
    isSameAsset: (rhs: IHasStringId) => boolean;
    /**
     * Multiplies the asset amount with an asset ratio and returns a new AssetAmount.
     * @param {AssetRatio<T>} ar - The asset ratio to multiply with.
     * @throws {Error} - Throws an error if the metadata is invalid or if the metadata does not match with the denominator's metadata.
     * @returns {AssetAmount<T>} - A new AssetAmount representing the multiplication result.
     */
    exchangeMultiply(ar: AssetRatio<T>): AssetAmount<T>;
    /**
     * Divides the asset amount by an asset ratio and returns a new AssetAmount.
     * @param {AssetRatio<T>} ar - The asset ratio to divide by.
     * @throws {Error} - Throws an error if the metadata is invalid or if the metadata does not match with the numerator's metadata.
     * @returns {AssetAmount<T>} - A new AssetAmount representing the division result.
     */
    exchangeDivide(ar: AssetRatio<T>): AssetAmount<T>;
    /**
     * Performs multiplication or division on the asset amount using an asset ratio, depending on the metadata.
     * @param {AssetRatio<T>} ar - The asset ratio for the operation.
     * @returns {AssetAmount<T>} - A new AssetAmount representing the result of the operation.
     */
    exchangeAt(ar: AssetRatio<T>): AssetAmount<T>;
}
//# sourceMappingURL=AssetAmount.d.ts.map