import { UTxO } from "lucid-cardano";
import { ISundaeProtocolParamsFull } from "../../../@types/index.js";
export declare const params: ISundaeProtocolParamsFull;
export declare const settingsUtxos: UTxO[];
export declare const referenceUtxos: UTxO[];
export declare const mockMintPoolInputs: UTxO[];
export declare const mockBlockfrostEvaluateResponse: {
    type: string;
    version: string;
    servicename: string;
    methodname: string;
    result: {
        EvaluationResult: {
            "mint:0": {
                memory: number;
                steps: number;
            };
        };
    };
    reflection: {
        id: string;
    };
};
export declare const mockOrderToCancel: UTxO[];
//# sourceMappingURL=mockData.d.ts.map