export type TFractionLike = number | string | bigint | Fraction;
export type TIntegerLike = number | string | bigint;
export declare enum FractionError {
    DivisionByZero = "DivisionByZero"
}
/**
 * Represents a rational number.
 * Provides basic arithmetic operations, and parsing/formatting.
 * TODO localized formatting
 */
export declare class Fraction {
    static readonly MAX_DECIMALS = 30;
    static readonly ZERO: Fraction;
    static readonly ONE: Fraction;
    static readonly HUNDRED: Fraction;
    static readonly THOUSAND: Fraction;
    static compare(a: Fraction, b: Fraction): number;
    static asFraction(fraction: TFractionLike): Fraction;
    static parseString(fractionString: string): Fraction;
    readonly numerator: bigint;
    readonly denominator: bigint;
    constructor(numerator: TIntegerLike | [bigint, bigint], denominator?: TIntegerLike);
    abs(): Fraction;
    add(rhs: TFractionLike): Fraction;
    sub: (rhs: TFractionLike) => Fraction;
    subtract(rhs: TFractionLike): Fraction;
    mul: (rhs: TFractionLike) => Fraction;
    multiply(rhs: TFractionLike): Fraction;
    div: (rhs: TFractionLike) => Fraction;
    divide(rhs: TFractionLike): Fraction;
    lt: (rhs: TFractionLike) => boolean;
    lessThan(rhs: TFractionLike): boolean;
    lte: (rhs: TFractionLike) => boolean;
    lessThanOrEqual(rhs: TFractionLike): boolean;
    eq: (rhs: TFractionLike) => boolean;
    equals(rhs: TFractionLike): boolean;
    gt: (rhs: TFractionLike) => boolean;
    greaterThan(rhs: TFractionLike): boolean;
    gte: (rhs: TFractionLike) => boolean;
    greaterThanOrEqual(rhs: TFractionLike): boolean;
    invert(): Fraction;
    get quotient(): bigint;
    getQuotient(): bigint;
    get remainder(): Fraction;
    toPrecision(decimals: number): Fraction;
    getRemainder(): Fraction;
    getRemainderOrNull(): Fraction | null;
    formatQuotientToLocaleString(locale?: string): string;
    remainderToString(decimals?: number): string;
    toNumber(decimals?: number): number;
    toString(decimals?: number): string;
    /**
     * @override
     * @param _key
     * @returns
     */
    toJSON(_key?: string | number): string;
}
//# sourceMappingURL=Fraction.d.ts.map