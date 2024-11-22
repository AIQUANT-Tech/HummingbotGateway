import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { IDepositConfigArgs } from "../@types/index.js";
import { OrderConfig } from "../Abstracts/OrderConfig.abstract.class.js";
/**
 * The main config class for building valid arguments for a Deposit.
 */
export declare class DepositConfig extends OrderConfig<IDepositConfigArgs> {
    suppliedAssets?: [
        AssetAmount<IAssetAmountMetadata>,
        AssetAmount<IAssetAmountMetadata>
    ];
    constructor(args?: IDepositConfigArgs);
    setSuppliedAssets(assets: [
        AssetAmount<IAssetAmountMetadata>,
        AssetAmount<IAssetAmountMetadata>
    ]): this;
    buildArgs(): IDepositConfigArgs;
    setFromObject({ orderAddresses, pool, suppliedAssets, referralFee, }: IDepositConfigArgs): void;
    validate(): never | void;
}
//# sourceMappingURL=DepositConfig.class.d.ts.map