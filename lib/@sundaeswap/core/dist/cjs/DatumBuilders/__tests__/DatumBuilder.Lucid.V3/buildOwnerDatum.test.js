"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const LucidHelper_class_js_1 = require("../../../Utilities/LucidHelper.class.js");
const testing_js_1 = require("../../../exports/testing.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilder.Lucid.V3.class.js");
let builderInstance;
beforeEach(() => {
    builderInstance = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
});
afterEach(() => {
    globals_1.jest.restoreAllMocks();
});
describe("buildOwnerDatum()", () => {
    it("should build the owner datum properly", () => {
        const spiedLucidHelperThrow = globals_1.jest.spyOn(LucidHelper_class_js_1.LucidHelper, "throwInvalidOrderAddressesError");
        const spiedLucidHelperAddressHashes = globals_1.jest.spyOn(LucidHelper_class_js_1.LucidHelper, "getAddressHashes");
        const result = builderInstance.buildOwnerDatum(testing_js_1.PREVIEW_DATA.addresses.current);
        expect(spiedLucidHelperAddressHashes).toHaveBeenCalledWith(testing_js_1.PREVIEW_DATA.addresses.current);
        expect(spiedLucidHelperThrow).not.toHaveBeenCalled();
        expect(result.inline).toEqual("d8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff");
        expect(result.hash).toEqual("eacbeb744f70afc638bd8e610fc8c91d5761da59ace673aeb3cb23a3f9fb5eab");
        expect(result.schema).toMatchObject({
            Address: {
                hex: "121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0",
            },
        });
    });
});
//# sourceMappingURL=buildOwnerDatum.test.js.map