"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetRatio = void 0;
var _AssetAmount = require("./AssetAmount.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var AssetRatio = exports.AssetRatio = /*#__PURE__*/function () {
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
  function AssetRatio(numerator, denominator, pool) {
    _classCallCheck(this, AssetRatio);
    this.pool = pool;
    _defineProperty(this, "numerator", void 0);
    _defineProperty(this, "denominator", void 0);
    if (pool && numerator !== null && numerator !== void 0 && numerator.metadata && denominator !== null && denominator !== void 0 && denominator.metadata) {
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
  return _createClass(AssetRatio, [{
    key: "getLimitPrice",
    value: function getLimitPrice() {
      var decimalOffset = this.denominator.decimals - this.numerator.decimals;
      return Number(this.numerator.amount.toString()) / Number(this.denominator.amount.toString()) * Math.pow(10, decimalOffset);
    }

    /**
     * Creates an asset ratio from a given limit price.
     *
     * The ratio is calculated by multiplying the denominator's amount with the limit price, adjusting for decimal differences.
     *
     * @param {number} limitPrice - The limit price used to create the asset ratio.
     * @returns {AssetRatio<T>} The created asset ratio.
     */
  }, {
    key: "updateLimitPrice",
    value: function updateLimitPrice(limitPrice) {
      var _this$numerator$metad, _this$numerator;
      var decimalOffset = this.numerator.decimals - this.denominator.decimals;
      var adjustedLimitPrice = limitPrice * Math.pow(10, decimalOffset);
      var newNumeratorAmount = BigInt(Math.round(Number(this.denominator.amount.toString()) * adjustedLimitPrice));
      var numerator = new _AssetAmount.AssetAmount(newNumeratorAmount, (_this$numerator$metad = (_this$numerator = this.numerator) === null || _this$numerator === void 0 ? void 0 : _this$numerator.metadata) !== null && _this$numerator$metad !== void 0 ? _this$numerator$metad : this.numerator.decimals);
      return new AssetRatio(numerator, this.denominator, this.pool);
    }
  }]);
}();
//# sourceMappingURL=AssetRatio.js.map