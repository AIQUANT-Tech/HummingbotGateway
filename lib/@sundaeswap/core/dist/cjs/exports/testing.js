"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLucid = exports.MockAll = exports.PREVIEW_DATA = void 0;
/**
 * ## Testing
 * Writing unit tests for large packages, especially those that use WASM like Lucid, can be a daunting
 * task. To help make this easier, we've developed some useful tests and mocks for your downstream project.
 *
 * The Mocks can be used for mocking the imports in order to help reduce your API surface that must be tested.
 * For example, rather than loading the entire SundaeSDK library, you can mock it and just confirm that a method
 * from the SDK was actually called within your app.
 *
 * In addition, for those who build custom {@link Core.TxBuilder} and {@link Core.DatumBuilder} classes, we've added
 * base tests that you can run on these classes to ensure that your Order builds output the expected
 * hex-encoded CBOR when writing your own unit tests on them.
 *
 * @module Testing
 * @packageDescription
 */
__exportStar(require("../TestUtilities/cardano.js"), exports);
var mockData_js_1 = require("../TestUtilities/mockData.js");
Object.defineProperty(exports, "PREVIEW_DATA", { enumerable: true, get: function () { return mockData_js_1.PREVIEW_DATA; } });
var mocks_js_1 = require("../TestUtilities/mocks.js");
Object.defineProperty(exports, "MockAll", { enumerable: true, get: function () { return mocks_js_1.MockAll; } });
var setupLucid_js_1 = require("../TestUtilities/setupLucid.js");
Object.defineProperty(exports, "setupLucid", { enumerable: true, get: function () { return setupLucid_js_1.setupLucid; } });
//# sourceMappingURL=testing.js.map