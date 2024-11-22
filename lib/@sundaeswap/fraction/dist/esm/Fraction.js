var _Fraction;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// eslint-disable-next-line no-use-before-define

export let FractionError = /*#__PURE__*/function (FractionError) {
  FractionError["DivisionByZero"] = "DivisionByZero";
  return FractionError;
}({}); // InvalidDecimals = "InvalidDecimals",

/**
 * Represents a rational number.
 * Provides basic arithmetic operations, and parsing/formatting.
 * TODO localized formatting
 */
export class Fraction {
  static compare(a, b) {
    if (a.greaterThan(b)) return 1;
    if (a.lessThan(b)) return -1;
    return 0;
  }
  static asFraction(fraction) {
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

  static parseString(fractionString) {
    // Parse a number in various forms (1000, 1.0003, 1.23e4, 1.23e-4) into a numerator and denominator
    fractionString = fractionString.replace(/,/g, "");
    if (fractionString.match(/[eE]/)) {
      const [base, exponent] = fractionString.split(/[eE]/).map(Number);
      const exponentBig = BigInt(Math.abs(exponent));
      const scale = 10n ** exponentBig;
      const baseFraction = this.parseString(base.toString());
      return exponent > 0 ? baseFraction.multiply(scale) : baseFraction.divide(scale);
    }
    if (fractionString.includes(".")) {
      const [integerPart, fractionalPart] = fractionString.split(".");
      const numerator = BigInt(integerPart + fractionalPart);
      const denominator = 10n ** BigInt(fractionalPart.length);

      // Simplify the fraction using the GCD function
      const gcd = (a, b) => b === 0n ? a : gcd(b, a % b);
      const divisor = gcd(numerator, denominator);
      return new Fraction(numerator / divisor, denominator / divisor);
    }
    return new Fraction(fractionString);
  }
  constructor(numerator, denominator) {
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
      [numerator, denominator] = numerator;
    }
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator || 1n);
    if (this.denominator === 0n) throw new Error(FractionError.DivisionByZero);
  }
  abs() {
    return this.lessThan(Fraction.ZERO) ? this.multiply(-1) : this;
  }
  add(rhs) {
    rhs = Fraction.asFraction(rhs);
    return new Fraction(this.numerator * rhs.denominator + rhs.numerator * this.denominator, this.denominator * rhs.denominator);
  }
  subtract(rhs) {
    rhs = Fraction.asFraction(rhs);
    return new Fraction(this.numerator * rhs.denominator - rhs.numerator * this.denominator, this.denominator * rhs.denominator);
  }
  multiply(rhs) {
    rhs = Fraction.asFraction(rhs);
    return new Fraction(this.numerator * rhs.numerator, this.denominator * rhs.denominator);
  }
  divide(rhs) {
    rhs = Fraction.asFraction(rhs);
    return new Fraction(this.numerator * rhs.denominator, this.denominator * rhs.numerator);
  }
  lessThan(rhs) {
    rhs = Fraction.asFraction(rhs);
    return this.numerator * rhs.denominator < rhs.numerator * this.denominator;
  }
  lessThanOrEqual(rhs) {
    rhs = Fraction.asFraction(rhs);
    return this.numerator * rhs.denominator <= rhs.numerator * this.denominator;
  }
  equals(rhs) {
    rhs = Fraction.asFraction(rhs);
    return this.numerator * rhs.denominator === rhs.numerator * this.denominator;
  }
  greaterThan(rhs) {
    rhs = Fraction.asFraction(rhs);
    return this.numerator * rhs.denominator > rhs.numerator * this.denominator;
  }
  greaterThanOrEqual(rhs) {
    rhs = Fraction.asFraction(rhs);
    return this.numerator * rhs.denominator >= rhs.numerator * this.denominator;
  }
  invert() {
    return new Fraction(this.denominator, this.numerator);
  }
  get quotient() {
    return this.numerator / this.denominator;
  }
  getQuotient() {
    return this.numerator / this.denominator;
  }
  get remainder() {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }
  toPrecision(decimals) {
    return Fraction.parseString(this.toString(decimals));
  }
  getRemainder() {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }
  getRemainderOrNull() {
    const remainder = this.getRemainder();
    return remainder.equals(Fraction.ZERO) ? null : remainder;
  }
  formatQuotientToLocaleString(locale) {
    return Intl.NumberFormat(locale).format(this.getQuotient());
  }
  remainderToString(decimals = Fraction.MAX_DECIMALS) {
    if (decimals <= 0) return "";
    const remainder = this.getRemainder();
    return remainder.equals(Fraction.ZERO) ? "" : remainder.multiply(10n ** BigInt(decimals)).getQuotient().toString().replace(/^-/, "").substring(0, decimals).padStart(decimals, "0").replace(/0*$/, "");
  }
  toNumber(decimals = Fraction.MAX_DECIMALS) {
    return Number(this.toString(decimals));
  }
  toString(decimals = Fraction.MAX_DECIMALS) {
    const formattedIntegerPart = this.getQuotient().toString();
    const formattedFractionalPart = this.remainderToString(decimals);
    return formattedFractionalPart ? `${formattedIntegerPart}.${formattedFractionalPart}` : formattedIntegerPart;
  }

  /**
   * @override
   * @param _key
   * @returns
   */
  toJSON(_key) {
    return this.toString();
  }
}
_Fraction = Fraction;
_defineProperty(Fraction, "MAX_DECIMALS", 30);
_defineProperty(Fraction, "ZERO", new _Fraction(0));
_defineProperty(Fraction, "ONE", new _Fraction(1));
_defineProperty(Fraction, "HUNDRED", new _Fraction(100));
_defineProperty(Fraction, "THOUSAND", new _Fraction(1000));
//# sourceMappingURL=Fraction.js.map