import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { Data } from "lucid-cardano";
import { IDepositArguments, ISwapArguments, IWithdrawArguments, IZapArguments, TDatumResult, TDepositMixed, TDepositSingle, TOrderAddresses, TSupportedNetworks, TSwap } from "../@types/index.js";
import { DatumBuilder } from "../Abstracts/DatumBuilder.abstract.class.js";
/**
 * The Lucid implementation for building valid Datums for
 * V1 contracts on the SundaeSwap protocol.
 */
export declare class DatumBuilderLucidV1 implements DatumBuilder {
    /** The current network id. */
    network: TSupportedNetworks;
    /** The error to throw when the pool ident does not match V1 constraints. */
    static INVALID_POOL_IDENT: string;
    constructor(network: TSupportedNetworks);
    /**
     * Constructs a swap datum object based on the provided swap arguments.
     * The function initializes a new datum with specific properties such as the pool ident,
     * order addresses, scooper fee, and swap direction schema. It then converts this datum
     * into an inline format and computes its hash using {@link Lucid.LucidHelper}. The function returns an
     * object containing the hash of the inline datum, the inline datum itself, and the original
     * datum schema.
     *
     * @param {ISwapArguments} params - The swap arguments required to build the swap datum.
     * @returns {TDatumResult<Data>} An object containing the hash of the inline datum, the inline datum itself,
     *                               and the schema of the original datum.
     */
    buildSwapDatum({ ident, orderAddresses, fundedAsset, swap, scooperFee, }: ISwapArguments): TDatumResult<Data>;
    /**
     * Creates a deposit datum object from the given deposit arguments. The function initializes
     * a new datum with specific properties such as the pool ident, order addresses, scooper fee,
     * and deposit pair schema. It then converts this datum into an inline format and calculates
     * its hash using {@link Lucid.LucidHelper}. The function returns an object containing the hash of the inline
     * datum, the inline datum itself, and the original datum schema.
     *
     * @param {IDepositArguments} params - The deposit arguments required to construct the deposit datum.
     * @returns {TDatumResult<Data>} An object containing the hash of the inline datum, the inline datum itself,
     *                               and the schema of the original datum.
     */
    buildDepositDatum({ ident, orderAddresses, deposit, scooperFee, }: IDepositArguments): TDatumResult<Data>;
    /**
     * Constructs a zap datum object from provided zap arguments. This function creates a new datum with
     * specific attributes such as the pool ident, order addresses, scooper fee, and deposit zap schema.
     * The datum is then converted to an inline format, and its hash is computed using {@link Lucid.LucidHelper}. The function
     * returns an object that includes the hash of the inline datum, the inline datum itself, and the original
     * datum schema, facilitating the integration of the zap operation within a larger transaction framework.
     *
     * @param {IZapArguments} params - The arguments necessary for constructing the zap datum.
     * @returns {TDatumResult<Data>} An object containing the hash of the inline datum, the inline datum itself,
     *                               and the schema of the original datum, which are essential for the zap transaction's execution.
     */
    experimental_buildZapDatum({ ident, orderAddresses, zap, scooperFee, }: IZapArguments): TDatumResult<Data>;
    /**
     * Generates a withdraw datum object from the specified withdraw arguments. This function constructs
     * a new datum with defined attributes such as the pool ident, order addresses, scooper fee, and
     * the schema for the supplied LP (Liquidity Provider) asset for withdrawal. After constructing the datum,
     * it is converted into an inline format, and its hash is calculated using {@link Lucid.LucidHelper}. The function returns
     * an object containing the hash of the inline datum, the inline datum itself, and the schema of the original
     * datum, which are crucial for executing the withdrawal operation within a transactional framework.
     *
     * @param {IWithdrawArguments} params - The arguments necessary to construct the withdraw datum.
     * @returns {TDatumResult<Data>} An object comprising the hash of the inline datum, the inline datum itself,
     *                               and the schema of the original datum, facilitating the withdrawal operation's integration into the transactional process.
     */
    buildWithdrawDatum({ ident, orderAddresses, suppliedLPAsset, scooperFee, }: IWithdrawArguments): TDatumResult<Data>;
    buildDepositPair(deposit: TDepositMixed): TDatumResult<Data>;
    experimental_buildDepositZap(zap: TDepositSingle): TDatumResult<Data>;
    buildWithdrawAsset(fundedLPAsset: AssetAmount<IAssetAmountMetadata>): TDatumResult<Data>;
    buildSwapDirection(swap: TSwap, amount: AssetAmount<IAssetAmountMetadata>): TDatumResult<Data>;
    buildOrderAddresses(addresses: TOrderAddresses): TDatumResult<Data>;
    buildPoolIdent(ident: string): string;
}
//# sourceMappingURL=DatumBuilder.Lucid.V1.class.d.ts.map