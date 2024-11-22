function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { AssetAmount } from "./AssetAmount.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AssetRatio {
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
  constructor(numerator, denominator, pool) {
    this.pool = pool;
    _defineProperty(this, "numerator", void 0);
    _defineProperty(this, "denominator", void 0);
    if (pool && numerator?.metadata && denominator?.metadata) {
      this.numerator = pool.assetA.assetId === numerator.metadata.assetId ? numerator : denominator;
      this.denominator = pool.assetA.assetId === numerator.metadata.assetId ? denominator : numerator;
    } else {
      this.numerator = numerator;
      this.denominator = denominator;
    }
  }

  /**
   * Calculates the limit price.
   *
   * The limit price is calculated by dividing the numerator amount by the denominator amount,
   * then adjusting for the difference in decimal places between the numerator and denominator.
   *
   * @returns {number} The calculated limit price.
   */
  getLimitPrice() {
    const decimalOffset = this.denominator.decimals - this.numerator.decimals;
    return Number(this.numerator.amount.toString()) / Number(this.denominator.amount.toString()) * 10 ** decimalOffset;
  }

  /**
   * Creates an asset ratio from a given limit price.
   *
   * The ratio is calculated by multiplying the denominator's amount with the limit price, adjusting for decimal differences.
   *
   * @param {number} limitPrice - The limit price used to create the asset ratio.
   * @returns {AssetRatio<T>} The created asset ratio.
   */
  updateLimitPrice(limitPrice) {
    const decimalOffset = this.numerator.decimals - this.denominator.decimals;
    const adjustedLimitPrice = limitPrice * 10 ** decimalOffset;
    const newNumeratorAmount = BigInt(Math.round(Number(this.denominator.amount.toString()) * adjustedLimitPrice));
    const numerator = new AssetAmount(newNumeratorAmount, this.numerator?.metadata ?? this.numerator.decimals);
    return new AssetRatio(numerator, this.denominator, this.pool);
  }
}
//# sourceMappingURL=AssetRatio.js.map