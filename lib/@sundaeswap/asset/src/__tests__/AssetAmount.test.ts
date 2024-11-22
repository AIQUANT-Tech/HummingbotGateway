import { beforeEach, describe, it, expect } from "bun:test";
import { AssetAmount, IAssetAmountMetadata } from "../AssetAmount.js";
import { AssetRatio } from "../AssetRatio.js";

let testAssetAData: IAssetAmountMetadata;

let testAssetBData: IAssetAmountMetadata;

let testAssetA: AssetAmount;
let testAssetB: AssetAmount;

beforeEach(() => {
  testAssetAData = {
    assetId: "test",
    decimals: 6,
  };

  testAssetBData = {
    assetId: "test-2",
    decimals: 0,
  };

  testAssetA = new AssetAmount(10000000n, testAssetAData);
  testAssetB = new AssetAmount(20n, testAssetBData);
});

describe("AssetAmount", () => {
  it("should compute value correctly", async () => {
    const zeroDecimals = { assetId: "zero", decimals: 0 };
    const oneDecimal = { assetId: "one", decimals: 1 };
    const sixDecimals = { assetId: "six", decimals: 6 };
    const tenDecimals = { assetId: "ten", decimals: 10 };

    expect(new AssetAmount(1, zeroDecimals).value.toString()).toBe("1");
    expect(new AssetAmount(1, oneDecimal).value.toString()).toBe("0.1");
    expect(new AssetAmount(1, tenDecimals).value.toString()).toBe(
      `0.${"0".repeat(9)}1`,
    );
    expect(new AssetAmount(1000000, sixDecimals).value.toString()).toBe("1");

    expect(new AssetAmount(1, zeroDecimals.decimals).value.toString()).toBe(
      "1",
    );
    expect(new AssetAmount(1, oneDecimal.decimals).value.toString()).toBe(
      "0.1",
    );
    expect(new AssetAmount(1, tenDecimals.decimals).value.toString()).toBe(
      `0.${"0".repeat(9)}1`,
    );
    expect(
      new AssetAmount(1000000, sixDecimals.decimals).value.toString(),
    ).toBe("1");
  });

  it("should compute fromValue correctly", () => {
    const sixDecimals = { assetId: "test", decimals: 6 };
    const zeroDecimals = { assetId: "test-2", decimals: 0 };

    expect(AssetAmount.fromValue(2.25, sixDecimals).amount).toBe(2250000n);
    expect(AssetAmount.fromValue(2.25, sixDecimals).value.toNumber()).toBe(
      2.25,
    );
    expect(AssetAmount.fromValue(1, sixDecimals).value.toNumber()).toBe(1);
    expect(AssetAmount.fromValue(1, sixDecimals).amount).toBe(1000000n);
    expect(AssetAmount.fromValue(1, zeroDecimals).value.toNumber()).toBe(1);
    expect(AssetAmount.fromValue(1, zeroDecimals).amount).toBe(1n);

    expect(AssetAmount.fromValue(2.25, sixDecimals.decimals).amount).toBe(
      2250000n,
    );
    expect(
      AssetAmount.fromValue(2.25, sixDecimals.decimals).value.toNumber(),
    ).toBe(2.25);
    expect(
      AssetAmount.fromValue(1, sixDecimals.decimals).value.toNumber(),
    ).toBe(1);
    expect(AssetAmount.fromValue(1, sixDecimals.decimals).amount).toBe(
      1000000n,
    );
    expect(
      AssetAmount.fromValue(1, zeroDecimals.decimals).value.toNumber(),
    ).toBe(1);
    expect(AssetAmount.fromValue(1, zeroDecimals.decimals).amount).toBe(1n);
  });

  it("should add values correctly", () => {
    const sixDecimals = { assetId: "six", decimals: 6 };

    expect(
      new AssetAmount(1000000, sixDecimals).add(
        new AssetAmount(5000000, sixDecimals),
      ).amount,
    ).toEqual(6000000n);

    expect(
      new AssetAmount(1000000, 6).add(new AssetAmount(5000000, sixDecimals))
        .amount,
    ).toEqual(6000000n);

    expect(
      new AssetAmount(1000000, sixDecimals).add(new AssetAmount(5000000, 6))
        .amount,
    ).toEqual(6000000n);
  });

  it("should subtract values correctly", () => {
    const sixDecimals = { assetId: "six", decimals: 6 };

    expect(
      new AssetAmount(10000000, sixDecimals).subtract(
        new AssetAmount(5000000, sixDecimals),
      ).amount,
    ).toEqual(5000000n);

    expect(
      new AssetAmount(10000000, 6).subtract(
        new AssetAmount(5000000, sixDecimals),
      ).amount,
    ).toEqual(5000000n);

    expect(
      new AssetAmount(10000000, sixDecimals).subtract(
        new AssetAmount(5000000, 6),
      ).amount,
    ).toEqual(5000000n);
  });
});

describe("AssetAmount with metadata", () => {
  it("should construct correctly", () => {
    expect(testAssetA.amount).toEqual(10000000n);
    expect(testAssetA.decimals).toEqual(6);
    expect(testAssetA.metadata).toMatchObject(testAssetAData);

    expect(testAssetB.amount).toEqual(20n);
    expect(testAssetB.decimals).toEqual(0);
    expect(testAssetB.metadata).toEqual(testAssetBData);
  });

  it("withMetadata()", () => {
    const basic = new AssetAmount(25n, 6);
    const withMetadata = basic.withMetadata(testAssetAData);

    expect(basic.metadata).toBeUndefined();
    expect(withMetadata.amount).toEqual(basic.amount);
    expect(withMetadata.metadata).toMatchObject(testAssetAData);
  });

  it("exchangeMultiply()", () => {
    const ratio = new AssetRatio(testAssetA, testAssetB);
    const result = testAssetB.exchangeMultiply(ratio);
    expect(result.amount).toEqual(10000000n);
    expect(result.metadata).toEqual(testAssetAData);
    expect(result.decimals).toEqual(6);
  });

  it("exchangeDivide()", () => {
    const ratio = new AssetRatio(testAssetA, testAssetB);
    const result = testAssetA.exchangeDivide(ratio);
    expect(result.amount).toEqual(20n);
    expect(result.metadata).toEqual(testAssetBData);
    expect(result.decimals).toEqual(0);
  });

  it("exchangeAt()", () => {
    const ratio = new AssetRatio(testAssetA, testAssetB);
    const result1 = testAssetA.exchangeAt(ratio);
    const result2 = testAssetB.exchangeAt(ratio);
    expect(result1.amount).toEqual(20n);
    expect(result1.metadata).toEqual(testAssetBData);

    expect(result2.amount).toEqual(10000000n);
    expect(result2.metadata).toEqual(testAssetAData);
    expect(result2.decimals).toEqual(6);

    const ratio2 = new AssetRatio(
      new AssetAmount(250000000n, testAssetAData),
      new AssetAmount(200n, testAssetBData),
    );

    const result3 = testAssetA.exchangeAt(ratio2);
    expect(result3.amount).toEqual(8n);
    expect(result3.metadata).toEqual(testAssetBData);
    expect(result3.decimals).toEqual(0);
  });

  it("should throw correct errors", () => {
    const ratio = new AssetRatio(testAssetA, testAssetB);
    const assetAmountWithoutMetadata = new AssetAmount(10n, 6);
    const assetAmountWithoutMetadata2 = new AssetAmount(10n, 0);
    const ratioWithoutMetadata = new AssetRatio(
      assetAmountWithoutMetadata,
      assetAmountWithoutMetadata2,
    );

    // All AssetAmounts without metadata.
    expect(() =>
      assetAmountWithoutMetadata.exchangeAt(ratioWithoutMetadata),
    ).toThrowError(AssetAmount.INVALID_METADATA);

    // Just incorrect ratio AssetAmounts.
    expect(() => testAssetA.exchangeAt(ratioWithoutMetadata)).toThrowError(
      AssetAmount.INVALID_METADATA,
    );

    // Just incorrect AssetAmount
    expect(() => assetAmountWithoutMetadata.exchangeAt(ratio)).toThrowError(
      AssetAmount.INVALID_METADATA,
    );
  });
});
