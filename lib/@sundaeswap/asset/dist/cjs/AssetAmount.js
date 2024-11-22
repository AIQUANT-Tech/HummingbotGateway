"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetAmount = void 0;
var _fraction = require("@sundaeswap/fraction");
var _Asset = require("./Asset.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Class representing a fungible token with BigInt amount, decimals and id.
 * @template T
 * @extends {IAssetAmountMetadata}
 * @implements {TFungibleToken}
 */
var AssetAmount = exports.AssetAmount = /*#__PURE__*/function () {
  /**
   * Creates a new `AssetAmount` instance with `amount`, `decimals` and `metadata`
   * @param {TIntegerLike} amount - The token amount, bigint represented as string, number or bigint. Default: 0n.
   * @param {number | T} metadata - The metadata associated with the asset amount.
   */
  function AssetAmount() {
    var _this = this;
    var _amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0n;
    var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AssetAmount.DEFAULT_FUNGIBLE_TOKEN_DECIMALS;
    _classCallCheck(this, AssetAmount);
    _defineProperty(this, "metadata", void 0);
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "decimals", void 0);
    _defineProperty(this, "amount", void 0);
    _defineProperty(this, "value", void 0);
    _defineProperty(this, "withAmount", function (amount) {
      var _this$metadata;
      return new AssetAmount(amount, (_this$metadata = _this === null || _this === void 0 ? void 0 : _this.metadata) !== null && _this$metadata !== void 0 ? _this$metadata : _this.decimals);
    });
    _defineProperty(this, "withValue", function (value) {
      var _this$metadata2;
      return AssetAmount.fromValue(value, (_this$metadata2 = _this === null || _this === void 0 ? void 0 : _this.metadata) !== null && _this$metadata2 !== void 0 ? _this$metadata2 : _this.decimals);
    });
    _defineProperty(this, "add", function (rhs) {
      return _this.withAmount(_this.amount + rhs.amount);
    });
    _defineProperty(this, "plus", this.add);
    _defineProperty(this, "subtract", function (rhs) {
      return _this.withAmount(_this.amount - rhs.amount);
    });
    _defineProperty(this, "minus", this.subtract);
    _defineProperty(this, "sub", this.subtract);
    _defineProperty(this, "addValue", function (value) {
      return _this.withValue(_this.value.add(value));
    });
    _defineProperty(this, "plusValue", this.add);
    _defineProperty(this, "subtractValue", function (value) {
      return _this.withValue(_this.value.sub(value));
    });
    _defineProperty(this, "minusValue", this.subtract);
    _defineProperty(this, "subValue", this.subtract);
    _defineProperty(this, "equalsAssetId", function (rhs) {
      return (0, _Asset.stringIdEquals)(_this, rhs);
    });
    _defineProperty(this, "isSameAsset", this.equalsAssetId);
    this.amount = BigInt(_amount);
    this.decimals = typeof metadata === "number" ? metadata : metadata.decimals;
    this.metadata = typeof metadata === "number" ? undefined : metadata;
    this.id = typeof metadata === "number" ? undefined : metadata.id;
    this.value = AssetAmount.toValue(this.amount, this.decimals);
  }
  return _createClass(AssetAmount, [{
    key: "withMetadata",
    value: function withMetadata(metadata) {
      return new AssetAmount(this.amount, metadata);
    }
  }, {
    key: "exchangeMultiply",
    value:
    /**
     * Multiplies the asset amount with an asset ratio and returns a new AssetAmount.
     * @param {AssetRatio<T>} ar - The asset ratio to multiply with.
     * @throws {Error} - Throws an error if the metadata is invalid or if the metadata does not match with the denominator's metadata.
     * @returns {AssetAmount<T>} - A new AssetAmount representing the multiplication result.
     */
    function exchangeMultiply(ar) {
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
  }, {
    key: "exchangeDivide",
    value: function exchangeDivide(ar) {
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
  }, {
    key: "exchangeAt",
    value: function exchangeAt(ar) {
      var _this$metadata3, _ar$denominator$metad;
      if (((_this$metadata3 = this.metadata) === null || _this$metadata3 === void 0 ? void 0 : _this$metadata3.assetId) === ((_ar$denominator$metad = ar.denominator.metadata) === null || _ar$denominator$metad === void 0 ? void 0 : _ar$denominator$metad.assetId)) {
        return this.exchangeMultiply(ar);
      } else {
        return this.exchangeDivide(ar);
      }
    }
  }], [{
    key: "toValue",
    value:
    /**
     * Represent a token amount and decimals as `Fraction` (`value`)
     * @param {bigint} amount - The amount of token.
     * @param {number} decimals - The decimal places of the token amount.
     * @returns {Fraction} - The token amount represented as a fraction.
     */
    function toValue(amount) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return new _fraction.Fraction(amount, 10n ** BigInt(decimals));
    }

    /**
     * Creates a new `AssetAmount` instance with fraction like `value`, `decimals` and `id`
     * @template T
     * @param {TFractionLike} value - The token amount represented as a fraction.
     * @param {number | T} metadata - The metadata associated with the asset amount.
     * @returns {AssetAmount<T>} - A new AssetAmount instance.
     */
  }, {
    key: "fromValue",
    value: function fromValue(value) {
      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AssetAmount.DEFAULT_FUNGIBLE_TOKEN_DECIMALS;
      var decimals = typeof metadata === "number" ? metadata : metadata.decimals;
      return new AssetAmount(_fraction.Fraction.asFraction(value).multiply(Math.pow(10, decimals)).quotient, metadata);
    }
  }]);
}();
_defineProperty(AssetAmount, "DEFAULT_FUNGIBLE_TOKEN_DECIMALS", 0);
_defineProperty(AssetAmount, "INVALID_METADATA", "Cannot perform exchange calculation on an AssetAmount with no metadata.");
//# sourceMappingURL=AssetAmount.js.map