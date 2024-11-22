"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("@sundaeswap/asset");
const index_js_1 = require("../../@types/index.js");
const testing_js_1 = require("../../exports/testing.js");
const SwapConfig_class_js_1 = require("../SwapConfig.class.js");
let config;
beforeEach(() => {
    config = new SwapConfig_class_js_1.SwapConfig();
});
describe("SwapConfig class", () => {
    it("should construct with no parameters", () => {
        expect(config).toBeInstanceOf(SwapConfig_class_js_1.SwapConfig);
    });
    it("should construct with a config", () => {
        const myConfig = new SwapConfig_class_js_1.SwapConfig({
            swapType: {
                type: index_js_1.ESwapType.MARKET,
                slippage: 0.1,
            },
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tada,
        });
        expect(myConfig.buildArgs()).toMatchObject({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAsset: expect.objectContaining({
                amount: testing_js_1.PREVIEW_DATA.assets.tada.amount,
                metadata: {
                    decimals: testing_js_1.PREVIEW_DATA.assets.tada.decimals,
                    assetId: testing_js_1.PREVIEW_DATA.assets.tada.metadata.assetId,
                },
            }),
            // 10% minus the pool fee
            minReceivable: expect.objectContaining({
                amount: 8570604n,
                decimals: 0,
            }),
        });
    });
    it("it should set the pool correctly", () => {
        config.setPool(testing_js_1.PREVIEW_DATA.pools.v1);
        expect(config.pool).toMatchObject(testing_js_1.PREVIEW_DATA.pools.v1);
    });
    it("should set the suppliedAsset correctly", () => {
        const asset = new asset_1.AssetAmount(20n, { assetId: "", decimals: 6 });
        config.setSuppliedAsset(asset);
        expect(config.suppliedAsset).toMatchObject({
            amount: 20n,
            metadata: expect.objectContaining({
                decimals: 6,
                assetId: "",
            }),
        });
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
        expect(config.orderAddresses).toMatchObject({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        });
    });
    it("it should calculate minReceivable correctly", () => {
        const myConfig = new SwapConfig_class_js_1.SwapConfig({
            swapType: {
                type: index_js_1.ESwapType.MARKET,
                slippage: 0.1,
            },
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tada,
        });
        expect(myConfig.buildArgs()).toMatchObject({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAsset: expect.objectContaining({
                amount: testing_js_1.PREVIEW_DATA.assets.tada.amount,
                metadata: {
                    decimals: testing_js_1.PREVIEW_DATA.assets.tada.decimals,
                    assetId: testing_js_1.PREVIEW_DATA.assets.tada.metadata.assetId,
                },
            }),
            // 10% minus the pool fee
            minReceivable: expect.objectContaining({
                amount: 8570604n,
                decimals: 0,
            }),
        });
        myConfig.setMinReceivable(new asset_1.AssetAmount(10n));
        expect(myConfig.buildArgs()).toMatchObject(expect.objectContaining({
            minReceivable: expect.objectContaining({
                amount: 10n,
                decimals: 0,
            }),
        }));
        const myConfigWithMinReceivable = new SwapConfig_class_js_1.SwapConfig({
            swapType: {
                type: index_js_1.ESwapType.LIMIT,
                minReceivable: new asset_1.AssetAmount(10n),
            },
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tada,
        });
        expect(myConfigWithMinReceivable.buildArgs()).toMatchObject({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            suppliedAsset: expect.objectContaining({
                amount: testing_js_1.PREVIEW_DATA.assets.tada.amount,
                metadata: {
                    decimals: testing_js_1.PREVIEW_DATA.assets.tada.decimals,
                    assetId: testing_js_1.PREVIEW_DATA.assets.tada.metadata.assetId,
                },
            }),
            // 10% minus the pool fee
            minReceivable: expect.objectContaining({
                amount: 10n,
                decimals: 0,
            }),
        });
    });
    it("should throw when providing invalid assetIDs to setSuppliedAsset()", () => {
        config
            .setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        })
            .setMinReceivable(new asset_1.AssetAmount(20n))
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setSuppliedAsset(new asset_1.AssetAmount(20n, { assetId: "tINDY", decimals: 0 }));
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
            .setMinReceivable(new asset_1.AssetAmount(20n))
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setSuppliedAsset(new asset_1.AssetAmount(20n, {
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
    it("should run buildArgs() without errors", () => {
        const validFunding = new asset_1.AssetAmount(2n, { assetId: "", decimals: 6 });
        config
            .setPool(testing_js_1.PREVIEW_DATA.pools.v1)
            .setMinReceivable(new asset_1.AssetAmount(20n))
            .setOrderAddresses({
            DestinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            },
        })
            .setSuppliedAsset(validFunding);
        expect(config.buildArgs()).toMatchObject({
            pool: testing_js_1.PREVIEW_DATA.pools.v1,
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            minReceivable: expect.objectContaining({
                amount: 20n,
                decimals: 0,
            }),
            suppliedAsset: {
                metadata: {
                    assetId: validFunding.metadata.assetId,
                },
                amount: validFunding.amount,
                decimals: validFunding.decimals,
            },
        });
    });
    it("should validate correctly when no suppliedAsset is set", () => {
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
            expect(e.message).toStrictEqual("You haven't funded this swap on your SwapConfig! Fund the swap with .setSuppliedAsset()");
        }
    });
    it("should validate correctly when no minReceivable is set", () => {
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
            .setSuppliedAsset(testing_js_1.PREVIEW_DATA.assets.tindy);
        try {
            config.validate();
        }
        catch (e) {
            expect(e.message).toStrictEqual("A minimum receivable amount was not found. This is usually because an invalid swapType was not supplied in the config.");
        }
        try {
            new SwapConfig_class_js_1.SwapConfig({
                orderAddresses: {
                    DestinationAddress: {
                        address: testing_js_1.PREVIEW_DATA.addresses.current,
                        datum: {
                            type: index_js_1.EDatumType.NONE,
                        },
                    },
                },
                pool: testing_js_1.PREVIEW_DATA.pools.v1,
                suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tindy,
                swapType: {
                    type: index_js_1.ESwapType.LIMIT,
                    minReceivable: testing_js_1.PREVIEW_DATA.assets.tada.withAmount(-100n),
                },
            }).validate();
        }
        catch (e) {
            expect(e.message).toStrictEqual("Cannot use a negative minimum receivable amount. Please try again.");
        }
    });
});
//# sourceMappingURL=SwapConfig.class.test.js.map