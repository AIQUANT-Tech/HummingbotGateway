"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FractionError = exports.Fraction = void 0;
var _Fraction;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// eslint-disable-next-line no-use-before-define
var FractionError = exports.FractionError = /*#__PURE__*/function (FractionError) {
  FractionError["DivisionByZero"] = "DivisionByZero";
  return FractionError;
}({}); // InvalidDecimals = "InvalidDecimals",
/**
 * Represents a rational number.
 * Provides basic arithmetic operations, and parsing/formatting.
 * TODO localized formatting
 */
var Fraction = exports.Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    _classCallCheck(this, Fraction);
    _defineProperty(this, "numerator", void 0);
    _defineProperty(this, "denominator", void 0);
    _defineProperty(this, "sub", this.subtract);
    _defineProperty(this, "mul", this.multiply);
    _defineProperty(this, "div", this.divide);
    _defineProperty(this, "lt", this.lessThan);
    _defineProperty(this, "lte", this.lessThanOrEqual);
    _defineProperty(this, "eq", this.equals);
    _defineProperty(this, "gt", this.greaterThan);
    _defineProperty(this, "gte", this.greaterThanOrEqual);
    if (Array.isArray(numerator)) {
      var _numerator = numerator;
      var _numerator2 = _slicedToArray(_numerator, 2);
      numerator = _numerator2[0];
      denominator = _numerator2[1];
    }
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator || 1n);
    if (this.denominator === 0n) throw new Error(FractionError.DivisionByZero);
  }
  return _createClass(Fraction, [{
    key: "abs",
    value: function abs() {
      return this.lessThan(Fraction.ZERO) ? this.multiply(-1) : this;
    }
  }, {
    key: "add",
    value: function add(rhs) {
      rhs = Fraction.asFraction(rhs);
      return new Fraction(this.numerator * rhs.denominator + rhs.numerator * this.denominator, this.denominator * rhs.denominator);
    }
  }, {
    key: "subtract",
    value: function subtract(rhs) {
      rhs = Fraction.asFraction(rhs);
      return new Fraction(this.numerator * rhs.denominator - rhs.numerator * this.denominator, this.denominator * rhs.denominator);
    }
  }, {
    key: "multiply",
    value: function multiply(rhs) {
      rhs = Fraction.asFraction(rhs);
      return new Fraction(this.numerator * rhs.numerator, this.denominator * rhs.denominator);
    }
  }, {
    key: "divide",
    value: function divide(rhs) {
      rhs = Fraction.asFraction(rhs);
      return new Fraction(this.numerator * rhs.denominator, this.denominator * rhs.numerator);
    }
  }, {
    key: "lessThan",
    value: function lessThan(rhs) {
      rhs = Fraction.asFraction(rhs);
      return this.numerator * rhs.denominator < rhs.numerator * this.denominator;
    }
  }, {
    key: "lessThanOrEqual",
    value: function lessThanOrEqual(rhs) {
      rhs = Fraction.asFraction(rhs);
      return this.numerator * rhs.denominator <= rhs.numerator * this.denominator;
    }
  }, {
    key: "equals",
    value: function equals(rhs) {
      rhs = Fraction.asFraction(rhs);
      return this.numerator * rhs.denominator === rhs.numerator * this.denominator;
    }
  }, {
    key: "greaterThan",
    value: function greaterThan(rhs) {
      rhs = Fraction.asFraction(rhs);
      return this.numerator * rhs.denominator > rhs.numerator * this.denominator;
    }
  }, {
    key: "greaterThanOrEqual",
    value: function greaterThanOrEqual(rhs) {
      rhs = Fraction.asFraction(rhs);
      return this.numerator * rhs.denominator >= rhs.numerator * this.denominator;
    }
  }, {
    key: "invert",
    value: function invert() {
      return new Fraction(this.denominator, this.numerator);
    }
  }, {
    key: "quotient",
    get: function get() {
      return this.numerator / this.denominator;
    }
  }, {
    key: "getQuotient",
    value: function getQuotient() {
      return this.numerator / this.denominator;
    }
  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(this.numerator % this.denominator, this.denominator);
    }
  }, {
    key: "toPrecision",
    value: function toPrecision(decimals) {
      return Fraction.parseString(this.toString(decimals));
    }
  }, {
    key: "getRemainder",
    value: function getRemainder() {
      return new Fraction(this.numerator % this.denominator, this.denominator);
    }
  }, {
    key: "getRemainderOrNull",
    value: function getRemainderOrNull() {
      var remainder = this.getRemainder();
      return remainder.equals(Fraction.ZERO) ? null : remainder;
    }
  }, {
    key: "formatQuotientToLocaleString",
    value: function formatQuotientToLocaleString(locale) {
      return Intl.NumberFormat(locale).format(this.getQuotient());
    }
  }, {
    key: "remainderToString",
    value: function remainderToString() {
      var decimals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Fraction.MAX_DECIMALS;
      if (decimals <= 0) return "";
      var remainder = this.getRemainder();
      return remainder.equals(Fraction.ZERO) ? "" : remainder.multiply(10n ** BigInt(decimals)).getQuotient().toString().replace(/^-/, "").substring(0, decimals).padStart(decimals, "0").replace(/0*$/, "");
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      var decimals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Fraction.MAX_DECIMALS;
      return Number(this.toString(decimals));
    }
  }, {
    key: "toString",
    value: function toString() {
      var decimals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Fraction.MAX_DECIMALS;
      var formattedIntegerPart = this.getQuotient().toString();
      var formattedFractionalPart = this.remainderToString(decimals);
      return formattedFractionalPart ? "".concat(formattedIntegerPart, ".").concat(formattedFractionalPart) : formattedIntegerPart;
    }

    /**
     * @override
     * @param _key
     * @returns
     */
  }, {
    key: "toJSON",
    value: function toJSON(_key) {
      return this.toString();
    }
  }], [{
    key: "compare",
    value: function compare(a, b) {
      if (a.greaterThan(b)) return 1;
      if (a.lessThan(b)) return -1;
      return 0;
    }
  }, {
    key: "asFraction",
    value: function asFraction(fraction) {
      return fraction instanceof Fraction ? fraction : Fraction.parseString(fraction.toString());
    }

    // static fromLocaleString(numStr: string, locale?: string): Fraction {
    //   const { decimalSeparator, groupSeparator } = getLocaleFormatOptions(locale);
    //   const [integerPart, fractionalPart] = numStr.split(decimalSeparator);
    //   const quotient = BigInt(integerPart.split(groupSeparator).join(""));
    //   if (!fractionalPart?.length) return new Fraction(quotient);
    //   const denominator = 10n ** BigInt(fractionalPart.length);
    //   return new Fraction(
    //     quotient * denominator + BigInt(fractionalPart),
    //     denominator
    //   );
    // }
  }, {
    key: "parseString",
    value: function parseString(fractionString) {
      // Parse a number in various forms (1000, 1.0003, 1.23e4, 1.23e-4) into a numerator and denominator
      fractionString = fractionString.replace(/,/g, "");
      if (fractionString.match(/[eE]/)) {
        var _fractionString$split = fractionString.split(/[eE]/).map(Number),
          _fractionString$split2 = _slicedToArray(_fractionString$split, 2),
          base = _fractionString$split2[0],
          exponent = _fractionString$split2[1];
        var exponentBig = BigInt(Math.abs(exponent));
        var scale = Math.pow(10n, exponentBig);
        var baseFraction = this.parseString(base.toString());
        return exponent > 0 ? baseFraction.multiply(scale) : baseFraction.divide(scale);
      }
      if (fractionString.includes(".")) {
        var _fractionString$split3 = fractionString.split("."),
          _fractionString$split4 = _slicedToArray(_fractionString$split3, 2),
          integerPart = _fractionString$split4[0],
          fractionalPart = _fractionString$split4[1];
        var numerator = BigInt(integerPart + fractionalPart);
        var denominator = Math.pow(10n, BigInt(fractionalPart.length));

        // Simplify the fraction using the GCD function
        var gcd = function gcd(a, b) {
          return b === 0n ? a : gcd(b, a % b);
        };
        var divisor = gcd(numerator, denominator);
        return new Fraction(numerator / divisor, denominator / divisor);
      }
      return new Fraction(fractionString);
    }
  }]);
}();
_Fraction = Fraction;
_defineProperty(Fraction, "MAX_DECIMALS", 30);
_defineProperty(Fraction, "ZERO", new _Fraction(0));
_defineProperty(Fraction, "ONE", new _Fraction(1));
_defineProperty(Fraction, "HUNDRED", new _Fraction(100));
_defineProperty(Fraction, "THOUSAND", new _Fraction(1000));
//# sourceMappingURL=Fraction.js.map