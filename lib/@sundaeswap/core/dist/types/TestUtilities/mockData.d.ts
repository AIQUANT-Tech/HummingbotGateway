import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { Assets, UTxO } from "lucid-cardano";
import { TOrderAddresses } from "../@types/datumbuilder.js";
import { IPoolData } from "../@types/queryprovider.js";
interface INetworkData {
    pools: {
        v1: IPoolData;
        v3: IPoolData;
    };
    addresses: {
        current: string;
        alternatives: string[];
    };
    assets: {
        tada: AssetAmount<IAssetAmountMetadata>;
        tindy: AssetAmount<IAssetAmountMetadata>;
        usdc: AssetAmount<IAssetAmountMetadata>;
        v1LpToken: AssetAmount<IAssetAmountMetadata>;
        v3LpToken: AssetAmount<IAssetAmountMetadata>;
    };
    orderAddresses: TOrderAddresses;
    wallet: {
        assets: Assets;
        utxos: UTxO[];
        referenceUtxos: {
            previewTasteTest: UTxO;
        };
        submittedOrderUtxos: {
            swapV1: UTxO;
            swapV3: UTxO;
        };
    };
}
declare const PREVIEW_DATA: INetworkData;
export { PREVIEW_DATA };
//# sourceMappingURL=mockData.d.ts.map