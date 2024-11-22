import type { ProtocolParameters, WalletApi } from "lucid-cardano";
import { TSupportedNetworks } from "../@types/utilities.js";
export interface WalletAPIResponses {
    balance: string;
    changeAddress: string;
    networkId: number;
    rewardAddresses: string[];
    unusedAddresses: string[];
    usedAddresses: string[];
    collateral: string[];
    utxos: string[];
}
export declare const windowCardano: {
    eternl: {
        name: string;
        enable: () => Promise<WalletApi>;
        icon: string;
        isEnabled: () => Promise<boolean>;
        version: string;
    };
};
export declare const setupGlobalCardano: () => void;
export declare const getBlockfrostProtocolParameters: (env: TSupportedNetworks) => ProtocolParameters;
//# sourceMappingURL=cardano.d.ts.map