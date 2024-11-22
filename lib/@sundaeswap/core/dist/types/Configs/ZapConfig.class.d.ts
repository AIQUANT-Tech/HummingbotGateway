import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { EPoolCoin, IPoolData, IZapConfigArgs, TOrderAddresses } from "../@types/index.js";
import { OrderConfig } from "../Abstracts/OrderConfig.abstract.class.js";
/**
 * The main config class for building valid arguments for a Zap.
 */
export declare class ZapConfig extends OrderConfig<IZapConfigArgs> {
    suppliedAsset?: AssetAmount<IAssetAmountMetadata>;
    zapDirection?: EPoolCoin;
    swapSlippage?: number;
    constructor(args?: IZapConfigArgs);
    setSwapSlippage(amount: number): this;
    setSuppliedAsset(asset: AssetAmount): this;
    setZapDirection(direction: EPoolCoin): this;
    buildArgs(): {
        orderAddresses: TOrderAddresses;
        pool: IPoolData;
        suppliedAsset: AssetAmount<IAssetAmountMetadata>;
        zapDirection: EPoolCoin;
        swapSlippage: number;
        referralFee: import("../@types/txbuilders.js").ITxBuilderReferralFee | undefined;
    };
    setFromObject({ orderAddresses, pool, suppliedAsset, zapDirection, swapSlippage, referralFee, }: IZapConfigArgs): void;
    validate(): never | void;
}
//# sourceMappingURL=ZapConfig.class.d.ts.map