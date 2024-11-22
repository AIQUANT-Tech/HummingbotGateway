import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { IFeesConfig, IMintV3PoolConfigArgs } from "../@types/index.js";
import { Config } from "../Abstracts/Config.abstract.class.js";
export declare class MintV3PoolConfig extends Config<IMintV3PoolConfigArgs> {
    static MAX_FEE: bigint;
    assetA?: AssetAmount<IAssetAmountMetadata>;
    assetB?: AssetAmount<IAssetAmountMetadata>;
    fees?: IFeesConfig;
    marketTimings?: bigint;
    donateToTreasury?: bigint;
    ownerAddress?: string;
    constructor(args?: IMintV3PoolConfigArgs);
    setFromObject({ assetA, assetB, fees, marketOpen, ownerAddress, referralFee, donateToTreasury, }: IMintV3PoolConfigArgs): void;
    buildArgs(): Omit<IMintV3PoolConfigArgs, "fees"> & {
        fees: IFeesConfig;
    };
    setDonateToTreasury(val?: bigint): this;
    setAssetA(assetA: AssetAmount<IAssetAmountMetadata>): this;
    setAssetB(assetB: AssetAmount<IAssetAmountMetadata>): this;
    setFees(fees: bigint | IFeesConfig): this;
    setMarketOpen(timing: bigint): this;
    setOwnerAddress(address: string): this;
    validate(): void;
}
//# sourceMappingURL=MintV3PoolConfig.class.d.ts.map