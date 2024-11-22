import { jest } from "@jest/globals";
import { EContractVersion, ETxBuilderType, } from "../@types/index.js";
import { QueryProviderSundaeSwap } from "../QueryProviders/QueryProviderSundaeSwap.js";
import { SundaeSDK } from "../SundaeSDK.class.js";
import { TxBuilderLucidV1 } from "../TxBuilders/TxBuilder.Lucid.V1.class.js";
import { TxBuilderLucidV3 } from "../TxBuilders/TxBuilder.Lucid.V3.class.js";
import { setupLucid, windowCardano } from "../exports/testing.js";
let lucidInstance;
let defaultWallet;
setupLucid((lucid) => {
    lucidInstance = lucid;
    defaultWallet = {
        name: "eternl",
        builder: {
            type: ETxBuilderType.LUCID,
            lucid,
        },
        network: "preview",
    };
});
beforeAll(() => {
    global.window = {
        // @ts-ignore
        cardano: windowCardano,
    };
});
afterAll(() => {
    jest.resetModules();
});
describe("SundaeSDK", () => {
    it("should build settings with correct defaults", () => {
        const sdk = new SundaeSDK({
            wallet: defaultWallet,
        });
        expect(sdk.getOptions()).toMatchObject({
            debug: false,
            minLockAda: 5000000n,
            wallet: defaultWallet,
        });
    });
    it("should build settings with correct overrides", () => {
        const sdk = new SundaeSDK({
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
        const sdk = new SundaeSDK({
            wallet: defaultWallet,
        });
        expect(sdk.builder()).toBeInstanceOf(TxBuilderLucidV1);
        expect(sdk.builder(EContractVersion.V3)).toBeInstanceOf(TxBuilderLucidV3);
    });
    it("should populate correct QueryProvider", () => {
        const sdk = new SundaeSDK({
            wallet: defaultWallet,
        });
        expect(sdk.query()).toBeInstanceOf(QueryProviderSundaeSwap);
    });
    it("should throw an error if given an invalid provider type", () => {
        expect(() => new SundaeSDK({
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