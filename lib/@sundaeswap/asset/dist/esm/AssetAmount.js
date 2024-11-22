function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Fraction } from "@sundaeswap/fraction";
import { stringIdEquals } from "./Asset.js";
/**
 * Class representing a fungible token with BigInt amount, decimals and id.
 * @template T
 * @extends {IAssetAmountMetadata}
 * @implements {TFungibleToken}
 */
export class AssetAmount {
  /**
   * Represent a token amount and decimals as `Fraction` (`value`)
   * @param {bigint} amount - The amount of token.
   * @param {number} decimals - The decimal places of the token amount.
   * @returns {Fraction} - The token amount represented as a fraction.
   */
  static toValue(amount, decimals = 0) {
    return new Fraction(amount, 10n ** BigInt(decimals));
  }

  /**
   * Creates a new `AssetAmount` instance with fraction like `value`, `decimals` and `id`
   * @template T
   * @param {TFractionLike} value - The token amount represented as a fraction.
   * @param {number | T} metadata - The metadata associated with the asset amount.
   * @returns {AssetAmount<T>} - A new AssetAmount instance.
   */

  static fromValue(value, metadata = AssetAmount.DEFAULT_FUNGIBLE_TOKEN_DECIMALS) {
    const decimals = typeof metadata === "number" ? metadata : metadata.decimals;
    return new AssetAmount(Fraction.asFraction(value).multiply(10 ** decimals).quotient, metadata);
  }

  /**
   * Creates a new `AssetAmount` instance with `amount`, `decimals` and `metadata`
   * @param {TIntegerLike} amount - The token amount, bigint represented as string, number or bigint. Default: 0n.
   * @param {number | T} metadata - The metadata associated with the asset amount.
   */
  constructor(_amount = 0n, metadata = AssetAmount.DEFAULT_FUNGIBLE_TOKEN_DECIMALS) {
    _defineProperty(this, "metadata", void 0);
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "decimals", void 0);
    _defineProperty(this, "amount", void 0);
    _defineProperty(this, "value", void 0);
    _defineProperty(this, "withAmount", amount => {
      return new AssetAmount(amount, this?.metadata ?? this.decimals);
    });
    _defineProperty(this, "withValue", value => {
      return AssetAmount.fromValue(value, this?.metadata ?? this.decimals);
    });
    _defineProperty(this, "add", rhs => {
      return this.withAmount(this.amount + rhs.amount);
    });
    _defineProperty(this, "plus", this.add);
    _defineProperty(this, "subtract", rhs => {
      return this.withAmount(this.amount - rhs.amount);
    });
    _defineProperty(this, "minus", this.subtract);
    _defineProperty(this, "sub", this.subtract);
    _defineProperty(this, "addValue", value => {
      return this.withValue(this.value.add(value));
    });
    _defineProperty(this, "plusValue", this.add);
    _defineProperty(this, "subtractValue", value => {
      return this.withValue(this.value.sub(value));
    });
    _defineProperty(this, "minusValue", this.subtract);
    _defineProperty(this, "subValue", this.subtract);
    _defineProperty(this, "equalsAssetId", rhs => {
      return stringIdEquals(this, rhs);
    });
    _defineProperty(this, "isSameAsset", this.equalsAssetId);
    this.amount = BigInt(_amount);
    this.decimals = typeof metadata === "number" ? metadata : metadata.decimals;
    this.metadata = typeof metadata === "number" ? undefined : metadata;
    this.id = typeof metadata === "number" ? undefined : metadata.id;
    this.value = AssetAmount.toValue(this.amount, this.decimals);
  }
  withMetadata(metadata) {
    return new AssetAmount(this.amount, metadata);
  }
  /**
   * Multiplies the asset amount with an asset ratio and returns a new AssetAmount.
   * @param {AssetRatio<T>} ar - The asset ratio to multiply with.
   * @throws {Error} - Throws an error if the metadata is invalid or if the metadata does not match with the denominator's metadata.
   * @returns {AssetAmount<T>} - A new AssetAmount representing the multiplication result.
   */
  exchangeMultiply(ar) {
    if (!this.metadata || !ar.denominator.metadata || !ar.numerator.metadata) {
      throw new Error(AssetAmount.INVALID_METADATA);
    }
    return new AssetAmount(this.amount * ar.numerator.amount / ar.denominator.amount, ar.numerator.metadata);
  }

  /**
   * Divides the asset amount by an asset ratio and returns a new AssetAmount.
   * @param {AssetRatio<T>} ar - The asset ratio to divide by.
   * @throws {Error} - Throws an error if the metadata is invalid or if the metadata does not match with the numerator's metadata.
   * @returns {AssetAmount<T>} - A new AssetAmount representing the division result.
   */
  exchangeDivide(ar) {
    if (!this.metadata || !ar.denominator.metadata || !ar.numerator.metadata) {
      throw new Error(AssetAmount.INVALID_METADATA);
    }
    return new AssetAmount(this.amount * ar.denominator.amount / ar.numerator.amount, ar.denominator.metadata);
  }

  /**
   * Performs multiplication or division on the asset amount using an asset ratio, depending on the metadata.
   * @param {AssetRatio<T>} ar - The asset ratio for the operation.
   * @returns {AssetAmount<T>} - A new AssetAmount representing the result of the operation.
   */
  exchangeAt(ar) {
    if (this.metadata?.assetId === ar.denominator.metadata?.assetId) {
      return this.exchangeMultiply(ar);
    } else {
      return this.exchangeDivide(ar);
    }
  }
}
_defineProperty(AssetAmount, "DEFAULT_FUNGIBLE_TOKEN_DECIMALS", 0);
_defineProperty(AssetAmount, "INVALID_METADATA", "Cannot perform exchange calculation on an AssetAmount with no metadata.");
//# sourceMappingURL=AssetAmount.js.map