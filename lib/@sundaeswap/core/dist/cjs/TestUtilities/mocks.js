"use strict";
/**
 * ## Mocks
 * Some example descriptions for using exported mocks in your application.
 *
 * @module Mocks
 * @packageDescription
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAll = void 0;
const globals_1 = require("@jest/globals");
const MockAll = () => {
    const mockSwap = globals_1.jest.fn(async () => ({
        submit: globals_1.jest.fn(() => "hex"),
        cbor: "cbor",
    }));
    const mockBuild = globals_1.jest.fn();
    const mockQuery = globals_1.jest.fn(() => new MockedProviderSundaeSwap());
    const MockedSundaeSDK = globals_1.jest.fn().mockImplementation(() => ({
        build: mockBuild,
        swap: mockSwap,
        query: mockQuery,
    }));
    const MockedProviderSundaeSwap = globals_1.jest.fn().mockImplementation(() => {
        return {
            findPoolData: globals_1.jest.fn(() => "findPoolData"),
            findPoolIdent: globals_1.jest.fn(() => "findPoolIdent"),
        };
    });
    const MockedTxBuilderLucid = globals_1.jest.fn().mockImplementation(() => {
        return {};
    });
    const MockedDatumBuilderLucid = globals_1.jest.fn().mockImplementation(() => {
        return {};
    });
    beforeEach(() => {
        MockedDatumBuilderLucid.mockClear();
        MockedProviderSundaeSwap.mockClear();
        MockedTxBuilderLucid.mockClear();
        MockedSundaeSDK.mockClear();
        mockSwap.mockClear();
        mockBuild.mockClear();
        mockQuery.mockClear();
    });
    globals_1.jest.mock("@sundaeswap/core", () => ({
        ...globals_1.jest.requireActual("@sundaeswap/core"),
        SundaeSDK: MockedSundaeSDK,
        ProviderSundaeSwap: MockedProviderSundaeSwap,
    }));
    globals_1.jest.mock("@sundaeswap/core/lucid", () => ({
        TxBuilderLucid: MockedTxBuilderLucid,
        DatumBuilderLucid: MockedDatumBuilderLucid,
    }));
};
exports.MockAll = MockAll;
//# sourceMappingURL=mocks.js.map