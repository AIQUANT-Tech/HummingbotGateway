import { describe, it, expect } from "bun:test";
import { AssetAmount, AssetRatio, IAssetRatioPool } from "../index.js";

const testRatio1 = new AssetRatio(
  new AssetAmount(10000000n, 6),
  new AssetAmount(200000n, 4),
);

const testRatio2 = new AssetRatio(
  new AssetAmount(10000000n, 6),
  new AssetAmount(20n, 0),
);

const testRatio3 = new AssetRatio(
  new AssetAmount(200n, 0),
  new AssetAmount(10000000n, 3),
);

const testRatio4 = new AssetRatio(
  new AssetAmount(20000000n, 6),
  new AssetAmount(10000000n, 6),
);

const testPool: IAssetRatioPool = {
  assetA: {
    assetId: "assetA",
    decimals: 6,
  },
  assetB: {
    assetId: "assetB",
    decimals: 6,
  },
};

describe("limitPriceFromRatio", () => {
  it("should return the correct limit price", () => {
    expect(testRatio1.getLimitPrice()).toEqual(0.5);
    expect(testRatio2.getLimitPrice()).toEqual(0.5);
    expect(testRatio3.getLimitPrice()).toEqual(0.02);
    expect(testRatio4.getLimitPrice()).toEqual(2);
  });
});

describe("ratioFromLimitPrice", () => {
  it("should return the correct new ratio from a limit price", () => {
    const newRatio1 = testRatio1.updateLimitPrice(1);
    expect(newRatio1.numerator.amount.toString()).toStrictEqual("20000000");
    expect(newRatio1.denominator.amount.toString()).toStrictEqual(
      testRatio1.denominator.amount.toString(),
    );

    const newRatio2 = testRatio2.updateLimitPrice(0.25);
    expect(newRatio2.numerator.amount.toString()).toStrictEqual("5000000");
    expect(newRatio2.denominator.amount.toString()).toStrictEqual(
      testRatio2.denominator.amount.toString(),
    );

    const newRatio3 = testRatio3.updateLimitPrice(1);
    expect(newRatio3.numerator.amount.toString()).toStrictEqual("10000");
    expect(newRatio3.denominator.amount.toString()).toStrictEqual(
      testRatio3.denominator.amount.toString(),
    );

    const newRatio4 = testRatio4.updateLimitPrice(0.75);
    expect(newRatio4.numerator.amount.toString()).toStrictEqual("7500000");
    expect(newRatio4.denominator.amount.toString()).toStrictEqual(
      testRatio4.denominator.amount.toString(),
    );

    const newRatio5 = testRatio1.updateLimitPrice(0.000000000004);
    expect(newRatio5.numerator.amount.toString()).toStrictEqual("0");
    expect(newRatio5.denominator.amount.toString()).toStrictEqual(
      testRatio1.denominator.amount.toString(),
    );
  });

  it("should carry over the pool when updating the limit price", () => {
    const newRatio6 = new AssetRatio(
      new AssetAmount(10n, 6),
      new AssetAmount(10n, 6),
      testPool,
    );
    expect(newRatio6.updateLimitPrice(1).pool).toBe(testPool);
  });

  it("should always enforce a correct numerator/denominator when given a pool", () => {
    const testRatioWithPool1 = new AssetRatio(
      new AssetAmount(20000000n, { decimals: 6, assetId: "assetA" }),
      new AssetAmount(10000000n, { decimals: 6, assetId: "assetB" }),
      testPool,
    );
    expect(testRatioWithPool1.numerator.amount).toStrictEqual(20000000n);
    expect(testRatioWithPool1.denominator.amount).toStrictEqual(10000000n);

    const testRatioWithPool2 = new AssetRatio(
      new AssetAmount(10000000n, { decimals: 6, assetId: "assetB" }),
      new AssetAmount(20000000n, { decimals: 6, assetId: "assetA" }),
      testPool,
    );
    expect(testRatioWithPool2.numerator.amount).toStrictEqual(20000000n);
    expect(testRatioWithPool2.denominator.amount).toStrictEqual(10000000n);
  });
});
