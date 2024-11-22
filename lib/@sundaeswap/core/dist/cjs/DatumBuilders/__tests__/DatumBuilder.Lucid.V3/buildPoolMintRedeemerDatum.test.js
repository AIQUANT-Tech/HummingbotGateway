"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const testing_js_1 = require("../../../exports/testing.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilder.Lucid.V3.class.js");
let builderInstance;
const defaultArgs = {
    assetA: testing_js_1.PREVIEW_DATA.assets.tada,
    assetB: testing_js_1.PREVIEW_DATA.assets.tindy,
    metadataOutput: 2n,
    poolOutput: 0n,
};
beforeEach(() => {
    builderInstance = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
});
afterEach(() => {
    globals_1.jest.restoreAllMocks();
});
describe("buildPoolMintRedeemerDatum()", () => {
    it("should build the pool mint redeemer datum properly", () => {
        const spiedOnBuildLexicographicalAssetsDatum = globals_1.jest.spyOn(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3.prototype, "buildLexicographicalAssetsDatum");
        const { inline } = builderInstance.buildPoolMintRedeemerDatum(defaultArgs);
        expect(spiedOnBuildLexicographicalAssetsDatum).toHaveBeenCalledTimes(1);
        expect(inline).toEqual("d87a9f9f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff0002ff");
    });
});
//# sourceMappingURL=buildPoolMintRedeemerDatum.test.js.map