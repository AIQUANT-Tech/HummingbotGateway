"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("@sundaeswap/asset");
const index_js_1 = require("../../@types/index.js");
const testing_js_1 = require("../../exports/testing.js");
const WithdrawConfig_class_js_1 = require("../WithdrawConfig.class.js");
let config;
beforeEach(() => {
    config = new WithdrawConfig_class_js_1.WithdrawConfig();
});
describe("WithdrawConfig class", () => {
    it("should construct with no parameters", () => {
        expect(config).toBeInstanceOf(WithdrawConfig_class_js_1.WithdrawConfig);
    });
    it("should construct with a config", () => {
        const myConfig = new WithdrawConfig_class_js_1.WithdrawConfig({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedLPAsset: testing_js_1.PREVIEW_DATA.assets.tindy,
        });
        expect(myConfig.buildArgs()).toStrictEqual({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedLPAsset: testing_js_1.PREVIEW_DATA.assets.tindy,
            referralFee: undefined,
        });
    });
    it("it should set the pool correctly", () => {
        config.setPool(testing_js_1.PREVIEW_DATA.pools.v1);
        expect(config.pool).toMatchObject(testing_js_1.PREVIEW_DATA.pools.v1);
    });
    it("should set the suppliedAsset correctly", () => {
        const asset = new asset_1.AssetAmount(20n, { assetId: "", decimals: 6 });
        config.setSuppliedLPAsset(asset);
        expect(config.suppliedLPAsset).toMatchObject(asset);
    });
    it("should set the orderAddresses correctly", () => {
        config.setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        });
        expect(config.orderAddresses).toStrictEqual({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        });
    });
    it("should throw an error if a pool isn't set", () => {
        config.setSuppliedLPAsset(new asset_1.AssetAmount(20n, { assetId: "tINDY", decimals: 6 }));
        try {
            config.buildArgs();
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toStrictEqual("You haven't set a pool in your Config. Set a pool with .setPool()");
        }
    });
    it("should throw when providing invalid assetIDs to setSuppliedLPAsset()", () => {
        config
            .setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        })
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setSuppliedLPAsset(new asset_1.AssetAmount(20n, { assetId: "tINDY", decimals: 6 }));
        try {
            config.buildArgs();
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toStrictEqual("You haven't defined the OrderAddresses in your Config. Set with .setOrderAddresses()");
        }
        config
            .setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        })
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setSuppliedLPAsset(new asset_1.AssetAmount(20n, {
            assetId: "fa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a35153518374494e4459",
            decimals: 6,
        }));
        try {
            config.buildArgs();
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toStrictEqual("Invalid assetId: fa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a35153518374494e4459. You likely forgot to concatenate with a period, like so: fa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a351535183.74494e4459");
        }
    });
    it("should throw when not providing a receiving address", () => {
        config
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setSuppliedLPAsset(testing_js_1.PREVIEW_DATA.assets.tindy);
        try {
            config.buildArgs();
        }
        catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toStrictEqual("You haven't defined the OrderAddresses in your Config. Set with .setOrderAddresses()");
        }
    });
    it("should run buildArgs() without errors", () => {
        const validFunding = new asset_1.AssetAmount(2n, { assetId: "", decimals: 6 });
        config
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        })
            .setSuppliedLPAsset(validFunding);
        expect(config.buildArgs()).toStrictEqual({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedLPAsset: validFunding,
            referralFee: undefined,
        });
    });
    it("should throw an error when validating with no suppliedLPAsset defined", () => {
        config.setPool(testing_js_1.PREVIEW_DATA.pools.v1).setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        });
        try {
            config.validate();
        }
        catch (e) {
            expect(e.message).toStrictEqual("There was no LP asset set! Set the LP token with .setSuppliedLPAsset()");
        }
    });
});
//# sourceMappingURL=WithdrawConfig.class.test.js.map