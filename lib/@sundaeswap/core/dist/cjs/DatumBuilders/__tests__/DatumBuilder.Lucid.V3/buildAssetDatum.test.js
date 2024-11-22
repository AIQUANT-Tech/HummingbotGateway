"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const asset_1 = require("@sundaeswap/asset");
const constants_js_1 = require("../../../constants.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilder.Lucid.V3.class.js");
let builderInstance;
beforeEach(() => {
    builderInstance = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
});
afterEach(() => {
    globals_1.jest.restoreAllMocks();
});
describe("buildAssetDatum", () => {
    it("should correctly build the datum for ADA", () => {
        const result = builderInstance.buildAssetAmountDatum(new asset_1.AssetAmount(100n, constants_js_1.ADA_METADATA));
        expect(result.inline).toEqual("9f40401864ff");
    });
    it("should correctly build the datum for alt-coin", () => {
        const result = builderInstance.buildAssetAmountDatum(new asset_1.AssetAmount(100000000n, {
            ...constants_js_1.ADA_METADATA,
            assetId: "d441227553a0f1a965fee7d60a0f724b368dd1bddbc208730fccebcf.44554d4d59",
        }));
        expect(result.inline).toEqual("9f581cd441227553a0f1a965fee7d60a0f724b368dd1bddbc208730fccebcf4544554d4d591a05f5e100ff");
    });
});
//# sourceMappingURL=buildAssetDatum.test.js.map