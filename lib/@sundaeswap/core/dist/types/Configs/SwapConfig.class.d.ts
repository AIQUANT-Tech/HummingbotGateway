import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { IPoolData, ISwapConfigArgs, TOrderAddresses } from "../@types/index.js";
import { OrderConfig } from "../Abstracts/OrderConfig.abstract.class.js";
/**
 * The `SwapConfig` class helps to properly format your swap arguments for use within {@link Core.TxBuilder}.
 *
 * @example
 *
 * ```ts
 * const config = new SwapConfig()
 *   .setPool( /** ...pool data... *\/)
 *   .setSuppliedAsset({
 *     assetId: "fa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a351535183.74494e4459",
 *     amount: new AssetAmount(20n, 6),
 *   })
 *   .setOrderAddresses({
 *      DestinationAddress: {
 *        address: "addr_test1qzrf9g3ea6hzgpnlkm4dr48kx6hy073t2j2gssnpm4mgcnqdxw2hcpavmh0vexyzg476ytc9urgcnalujkcewtnd2yzsfd9r32"
 *      }
 *   });
 *
 * const { submit, cbor } = await SDK.swap(config);
 * ```
 */
export declare class SwapConfig extends OrderConfig<Omit<ISwapConfigArgs, "swapType"> & {
    minReceivable: AssetAmount<IAssetAmountMetadata>;
}> {
    suppliedAsset?: AssetAmount<IAssetAmountMetadata>;
    minReceivable?: AssetAmount<IAssetAmountMetadata>;
    constructor(args?: ISwapConfigArgs);
    /**
     * Set the supplied asset for the swap.
     *
     * @param asset The provided asset and amount from a connected wallet.
     * @returns
     */
    setSuppliedAsset(asset: AssetAmount<IAssetAmountMetadata>): this;
    /**
     * Set a minimum receivable asset amount for the swap. This is akin to setting a limit order.
     *
     * @param amount
     * @returns
     */
    setMinReceivable(amount: AssetAmount): this;
    /**
     * Used for building a swap where you already know the pool data.
     * Useful for when building Transactions directly from the builder instance.
     *
     * @see {@link Core.TxBuilder}
     *
     * @returns
     */
    buildArgs(): {
        pool: IPoolData;
        suppliedAsset: AssetAmount<IAssetAmountMetadata>;
        orderAddresses: TOrderAddresses;
        minReceivable: AssetAmount<IAssetAmountMetadata>;
        referralFee: import("../@types/txbuilders.js").ITxBuilderReferralFee | undefined;
    };
    /**
     * Helper function to build valid swap arguments from a JSON object.
     */
    setFromObject({ pool, orderAddresses, suppliedAsset, referralFee, swapType, }: ISwapConfigArgs): void;
    validate(): void;
}
//# sourceMappingURL=SwapConfig.class.d.ts.map