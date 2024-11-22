"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mockData_js_1 = require("../../../TestUtilities/mockData.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilder.Lucid.V3.class.js");
let builderInstance;
beforeEach(() => {
    builderInstance = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
});
afterEach(() => {
    globals_1.jest.restoreAllMocks();
});
describe("buildPoolIdent", () => {
    it("should correctly build and validate a pool ident", () => {
        expect(() => builderInstance.buildPoolIdent(mockData_js_1.PREVIEW_DATA.pools.v1.ident)).toThrowError(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3.INVALID_POOL_IDENT);
        const validIdent = builderInstance.buildPoolIdent(mockData_js_1.PREVIEW_DATA.pools.v3.ident);
        expect(validIdent).toEqual(mockData_js_1.PREVIEW_DATA.pools.v3.ident);
    });
});
//# sourceMappingURL=buildPoolIdent.test.js.map