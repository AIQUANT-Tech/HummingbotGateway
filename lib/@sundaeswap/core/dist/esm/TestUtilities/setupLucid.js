import { jest } from "@jest/globals";
import { Lucid } from "lucid-cardano";
import { getBlockfrostProtocolParameters, windowCardano } from "./cardano.js";
import { PREVIEW_DATA } from "./mockData.js";
export const setupLucid = (useLucid, options) => {
    const getUtxosByOutRefMock = jest.fn();
    const getUtxosMock = jest
        .fn()
        .mockResolvedValue(PREVIEW_DATA.wallet.utxos);
    const mockProvider = jest.fn().mockImplementation(() => ({
        url: "https://cardano-preview.blockfrost.io/",
        // All fetch requests get mocked anyway.
        projectId: "test-project-id",
        // Required for collecting UTXOs for some reason.
        getUtxos: getUtxosMock,
        getProtocolParameters: jest
            .fn()
            .mockImplementation(() => getBlockfrostProtocolParameters("preview")),
        getUtxosByOutRef: getUtxosByOutRefMock,
        getDatum: jest.fn(),
    }));
    beforeAll(async () => {
        options?.beforeAll?.();
        global.window = {
            // @ts-ignore
            cardano: windowCardano,
        };
        const provider = new mockProvider();
        const lucid = await Lucid.new(provider, "Preview");
        lucid.selectWalletFrom({
            address: PREVIEW_DATA.addresses.current,
            utxos: options?.customUtxos ?? PREVIEW_DATA.wallet.utxos,
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
        ownerAddress: PREVIEW_DATA.addresses.current,
    };
};
//# sourceMappingURL=setupLucid.js.map