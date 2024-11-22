"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const asset_1 = require("@sundaeswap/asset");
const datumbuilder_js_1 = require("../../../@types/datumbuilder.js");
const constants_js_1 = require("../../../constants.js");
const testing_js_1 = require("../../../exports/testing.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilder.Lucid.V3.class.js");
let builderInstance;
beforeEach(() => {
    builderInstance = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
});
afterEach(() => {
    globals_1.jest.restoreAllMocks();
});
describe("buildDepositDatum()", () => {
    it("should correctly build the datum, variation 1", () => {
        const result = builderInstance.buildDepositDatum({
            destinationAddress: {
                address: testing_js_1.PREVIEW_DATA.addresses.current,
                datum: {
                    type: datumbuilder_js_1.EDatumType.NONE,
                },
            },
            ident: testing_js_1.PREVIEW_DATA.pools.v3.ident,
            order: {
                assetA: new asset_1.AssetAmount(100n, testing_js_1.PREVIEW_DATA.assets.tada.metadata),
                assetB: new asset_1.AssetAmount(100n, {
                    ...constants_js_1.ADA_METADATA,
                    assetId: testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId,
                }),
            },
            scooperFee: 1000000n,
        });
        expect(result.inline).toEqual("d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a000f4240d8799fd8799fd8799f581cc279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87980ffd87b9f9f9f40401864ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e44591864ffffff43d87980ff");
        expect(result.hash).toEqual("b37235604dda00aeaad5967868a44e808692389dc2b71d14f71fe688ffb5f046");
    });
});
//# sourceMappingURL=buildDepositDatum.test.js.map