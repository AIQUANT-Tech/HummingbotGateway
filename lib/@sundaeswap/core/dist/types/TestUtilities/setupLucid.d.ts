import { jest } from "@jest/globals";
import { Lucid, OutRef, UTxO } from "lucid-cardano";
type TGetUtxosByOutRefMock = (outRefs: OutRef[]) => Promise<UTxO[] | undefined>;
type TGetUtxosMock = () => Promise<UTxO[]>;
export declare const setupLucid: (useLucid?: ((lucid: Lucid) => void) | undefined, options?: {
    customUtxos?: UTxO[];
    beforeAll?: () => void;
}) => {
    getUtxosByOutRefMock: jest.Mock<TGetUtxosByOutRefMock>;
    getUtxosMock: jest.Mock<TGetUtxosMock>;
    mockProvider: jest.Mock;
    ownerAddress: string;
};
export {};
//# sourceMappingURL=setupLucid.d.ts.map