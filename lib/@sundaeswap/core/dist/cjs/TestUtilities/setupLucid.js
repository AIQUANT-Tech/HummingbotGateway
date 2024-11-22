"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLucid = void 0;
const globals_1 = require("@jest/globals");
const lucid_cardano_1 = require("lucid-cardano");
const cardano_js_1 = require("./cardano.js");
const mockData_js_1 = require("./mockData.js");
const setupLucid = (useLucid, options) => {
    const getUtxosByOutRefMock = globals_1.jest.fn();
    const getUtxosMock = globals_1.jest
        .fn()
        .mockResolvedValue(mockData_js_1.PREVIEW_DATA.wallet.utxos);
    const mockProvider = globals_1.jest.fn().mockImplementation(() => ({
        url: "https://cardano-preview.blockfrost.io/",
        // All fetch requests get mocked anyway.
        projectId: "test-project-id",
        // Required for collecting UTXOs for some reason.
        getUtxos: getUtxosMock,
        getProtocolParameters: globals_1.jest
            .fn()
            .mockImplementation(() => (0, cardano_js_1.getBlockfrostProtocolParameters)("preview")),
        getUtxosByOutRef: getUtxosByOutRefMock,
        getDatum: globals_1.jest.fn(),
    }));
    beforeAll(async () => {
        options?.beforeAll?.();
        global.window = {
            // @ts-ignore
            cardano: cardano_js_1.windowCardano,
        };
        const provider = new mockProvider();
        const lucid = await lucid_cardano_1.Lucid.new(provider, "Preview");
        lucid.selectWalletFrom({
            address: mockData_js_1.PREVIEW_DATA.addresses.current,
            utxos: options?.customUtxos ?? mockData_js_1.PREVIEW_DATA.wallet.utxos,
        });
        useLucid?.(lucid);
    });
    afterEach(() => {
        getUtxosByOutRefMock.mockReset();
    });
    return {
        getUtxosByOutRefMock,
        getUtxosMock,
        mockProvider,
        ownerAddress: mockData_js_1.PREVIEW_DATA.addresses.current,
    };
};
exports.setupLucid = setupLucid;
//# sourceMappingURL=setupLucid.js.map