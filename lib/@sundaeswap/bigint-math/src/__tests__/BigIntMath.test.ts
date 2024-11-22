import { test, describe, expect } from "bun:test";
import { abs, max, min, rootNth, sign, sqrt } from "../BigIntMath.js";

describe("BigintMath", () => {
  test("min", () => expect(min(1n, -1n, 23n, 4n, -444n)).toBe(-444n));

  test("max", () => expect(max(1n, -1n, 23n, 4n, -444n)).toBe(23n));

  test("sign", () => {
    expect(sign(0n)).toBe(0n);
    expect(sign(4211n)).toBe(1n);
    expect(sign(-144n)).toBe(-1n);
    expect(sign(-132n)).toBe(-1n);
  });

  test("abs", () => {
    expect(abs(0n)).toBe(0n);
    expect(abs(4211n)).toBe(4211n);
    expect(abs(-4211n)).toBe(4211n);
    expect(abs(-144n)).toBe(144n);
  });

  test("sqrt", () => {
    expect(sqrt(144n)).toBe(12n);
    expect(() => sqrt(-144n)).toThrow();
  });

  test("rootNth", () => {
    expect(rootNth(27n, 3n)).toBe(3n);
    expect(() => rootNth(-144n)).toThrow();
  });
});
