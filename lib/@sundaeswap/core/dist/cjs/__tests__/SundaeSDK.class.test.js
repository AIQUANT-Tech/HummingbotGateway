"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_js_1 = require("../@types/index.js");
const QueryProviderSundaeSwap_js_1 = require("../QueryProviders/QueryProviderSundaeSwap.js");
const SundaeSDK_class_js_1 = require("../SundaeSDK.class.js");
const TxBuilder_Lucid_V1_class_js_1 = require("../TxBuilders/TxBuilder.Lucid.V1.class.js");
const TxBuilder_Lucid_V3_class_js_1 = require("../TxBuilders/TxBuilder.Lucid.V3.class.js");
const testing_js_1 = require("../exports/testing.js");
let lucidInstance;
let defaultWallet;
(0, testing_js_1.setupLucid)((lucid) => {
    lucidInstance = lucid;
    defaultWallet = {
        name: "eternl",
        builder: {
            type: index_js_1.ETxBuilderType.LUCID,
            lucid,
        },
        network: "preview",
    };
});
beforeAll(() => {
    global.window = {
        // @ts-ignore
        cardano: testing_js_1.windowCardano,
    };
});
afterAll(() => {
    globals_1.jest.resetModules();
});
describe("SundaeSDK", () => {
    it("should build settings with correct defaults", () => {
        const sdk = new SundaeSDK_class_js_1.SundaeSDK({
            wallet: defaultWallet,
        });
        expect(sdk.getOptions()).toMatchObject({
            debug: false,
            minLockAda: 5000000n,
            wallet: defaultWallet,
        });
    });
    it("should build settings with correct overrides", () => {
        const sdk = new SundaeSDK_class_js_1.SundaeSDK({
            debug: true,
            minLockAda: 10000000n,
            wallet: defaultWallet,
        });
        expect(sdk.getOptions()).toMatchObject({
            debug: false,
            minLockAda: 5000000n,
            wallet: defaultWallet,
        });
    });
    it("should populate correct TxBuilders", () => {
        const sdk = new SundaeSDK_class_js_1.SundaeSDK({
            wallet: defaultWallet,
        });
        expect(sdk.builder()).toBeInstanceOf(TxBuilder_Lucid_V1_class_js_1.TxBuilderLucidV1);
        expect(sdk.builder(index_js_1.EContractVersion.V3)).toBeInstanceOf(TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3);
    });
    it("should populate correct QueryProvider", () => {
        const sdk = new SundaeSDK_class_js_1.SundaeSDK({
            wallet: defaultWallet,
        });
        expect(sdk.query()).toBeInstanceOf(QueryProviderSundaeSwap_js_1.QueryProviderSundaeSwap);
    });
    it("should throw an error if given an invalid provider type", () => {
        expect(() => new SundaeSDK_class_js_1.SundaeSDK({
            wallet: {
                builder: {
                    // @ts-ignore
                    type: "invalid",
                },
            },
        })).toThrowError("A valid wallet provider type must be defined in your options object.");
    });
});
//# sourceMappingURL=SundaeSDK.class.test.js.map