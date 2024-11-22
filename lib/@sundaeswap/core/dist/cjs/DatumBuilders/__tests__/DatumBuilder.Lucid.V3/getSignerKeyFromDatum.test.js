"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilder.Lucid.V3.class.js");
let builderInstance;
beforeEach(() => {
    builderInstance = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
});
afterEach(() => {
    globals_1.jest.restoreAllMocks();
});
describe("static getSignerKeyFromDatum()", () => {
    it("should properly extract the owner's key hash from the datum", () => {
        const exampleDatum = "d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a000f4240d8799fd8799fd8799f581cc279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87980ffd87a9f9f40401a017d7840ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e44591a00465cbbffff43d87980ff";
        expect(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3.getSignerKeyFromDatum(exampleDatum)).toEqual("121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0");
    });
});
//# sourceMappingURL=getSignerKeyFromDatum.test.js.map