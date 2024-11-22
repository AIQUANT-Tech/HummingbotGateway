"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_js_1 = require("../../exports/testing.js");
const MintV3PoolConfig_class_js_1 = require("../MintV3PoolConfig.class.js");
const defaultArgs = {
    assetA: testing_js_1.PREVIEW_DATA.assets.tada,
    assetB: testing_js_1.PREVIEW_DATA.assets.tindy,
    fees: 20n,
    marketOpen: 0n,
    ownerAddress: "addr_test",
};
let config;
beforeEach(() => {
    config = new MintV3PoolConfig_class_js_1.MintV3PoolConfig();
});
describe("MintV3PoolConfig class", () => {
    it("should construct with no parameters", () => {
        expect(config).toBeInstanceOf(MintV3PoolConfig_class_js_1.MintV3PoolConfig);
    });
    it("should construct with a config", () => {
        const myConfig = new MintV3PoolConfig_class_js_1.MintV3PoolConfig(defaultArgs);
        expect(myConfig.buildArgs()).toMatchObject({
            assetA: expect.objectContaining({
                amount: testing_js_1.PREVIEW_DATA.assets.tada.amount,
            }),
            assetB: expect.objectContaining({
                amount: testing_js_1.PREVIEW_DATA.assets.tindy.amount,
            }),
            fees: {
                bid: 20n,
                ask: 20n,
            },
            marketOpen: 0n,
            ownerAddress: "addr_test",
        });
    });
    it("should fail when any of the fees surpass the max fee", () => {
        expect(() => new MintV3PoolConfig_class_js_1.MintV3PoolConfig({
            ...defaultArgs,
            fees: 11000n,
        }).buildArgs()).toThrowError(`Fees cannot supersede the max fee of ${MintV3PoolConfig_class_js_1.MintV3PoolConfig.MAX_FEE}.`);
        expect(() => new MintV3PoolConfig_class_js_1.MintV3PoolConfig({
            ...defaultArgs,
            fees: 10n,
        }).buildArgs()).not.toThrowError(`Fees cannot supersede the max fee of ${MintV3PoolConfig_class_js_1.MintV3PoolConfig.MAX_FEE}.`);
    });
    it("should fail when an ask fee surpasses the max fee", () => {
        expect(() => new MintV3PoolConfig_class_js_1.MintV3PoolConfig({
            ...defaultArgs,
            fees: {
                bid: 10n,
                ask: 11000n,
            },
        }).buildArgs()).toThrowError(`Ask fee cannot supersede the max fee of ${MintV3PoolConfig_class_js_1.MintV3PoolConfig.MAX_FEE}.`);
    });
    it("should fail when a bid fee surpasses the max fee", () => {
        expect(() => new MintV3PoolConfig_class_js_1.MintV3PoolConfig({
            ...defaultArgs,
            fees: {
                bid: 11000n,
                ask: 10n,
            },
        }).buildArgs()).toThrowError(`Bid fee cannot supersede the max fee of ${MintV3PoolConfig_class_js_1.MintV3PoolConfig.MAX_FEE}.`);
    });
});
//# sourceMappingURL=MintV3PoolConfig.class.test.js.map