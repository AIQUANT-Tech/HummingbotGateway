"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../@types/index.js");
const testing_js_1 = require("../../exports/testing.js");
const DepositConfig_class_1 = require("../DepositConfig.class");
let config;
beforeEach(() => {
    config = new DepositConfig_class_1.DepositConfig();
});
describe("WithdrawConfig class", () => {
    it("should construct with no parameters", () => {
        expect(config).toBeInstanceOf(DepositConfig_class_1.DepositConfig);
    });
    it("should construct with a config", () => {
        const myConfig = new DepositConfig_class_1.DepositConfig({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAssets: [testing_js_1.PREVIEW_DATA.assets.tada, testing_js_1.PREVIEW_DATA.assets.tindy],
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
            suppliedAssets: [testing_js_1.PREVIEW_DATA.assets.tada, testing_js_1.PREVIEW_DATA.assets.tindy],
            referralFee: undefined,
        });
    });
    it("it should set the pool correctly", () => {
        config.setPool(testing_js_1.PREVIEW_DATA.pools.v1);
        expect(config.pool).toMatchObject(testing_js_1.PREVIEW_DATA.pools.v1);
    });
    it("should set the suppliedAsset correctly", () => {
        config.setSuppliedAssets([
            testing_js_1.PREVIEW_DATA.assets.tada,
            testing_js_1.PREVIEW_DATA.assets.tindy,
        ]);
        expect(config.suppliedAssets).toMatchObject([
            testing_js_1.PREVIEW_DATA.assets.tada,
            testing_js_1.PREVIEW_DATA.assets.tindy,
        ]);
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
            expect(e.message).toStrictEqual("You did not provided funding for this deposit! Make sure you supply both sides of the pool with .setSuppliedAssets()");
        }
    });
});
//# sourceMappingURL=DepositConfig.class.test.js.map