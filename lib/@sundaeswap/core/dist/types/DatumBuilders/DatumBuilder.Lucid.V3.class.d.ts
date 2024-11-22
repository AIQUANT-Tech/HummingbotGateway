import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import { Data, Lucid, UTxO } from "lucid-cardano";
import { IFeesConfig, TDatumResult, TDestinationAddress, TSupportedNetworks } from "../@types/index.js";
import { DatumBuilder } from "../Abstracts/DatumBuilder.abstract.class.js";
import * as V3Types from "./contracts/contracts.v3.js";
/**
 * The base arguments for the V3 DatumBuilder.
 */
export interface IDatumBuilderBaseV3Args {
    destinationAddress: TDestinationAddress;
    ident: string;
    ownerAddress?: string;
    scooperFee: bigint;
}
/**
 * The arguments from building a swap transaction against
 * a V3 pool contract.
 */
export interface IDatumBuilderSwapV3Args extends IDatumBuilderBaseV3Args {
    order: {
        minReceived: AssetAmount<IAssetAmountMetadata>;
        offered: AssetAmount<IAssetAmountMetadata>;
    };
}
/**
 * The arguments from building a withdraw transaction against
 * a V3 pool contract.
 */
export interface IDatumBuilderDepositV3Args extends IDatumBuilderBaseV3Args {
    order: {
        assetA: AssetAmount<IAssetAmountMetadata>;
        assetB: AssetAmount<IAssetAmountMetadata>;
    };
}
/**
 * The arguments for building a withdraw transaction against
 * a V3 pool contract.
 */
export interface IDatumBuilderWithdrawV3Args extends IDatumBuilderBaseV3Args {
    order: {
        lpToken: AssetAmount<IAssetAmountMetadata>;
    };
}
/**
 * The arguments for building a minting a new pool transaction against
 * the V3 pool contract.
 */
export interface IDatumBuilderMintPoolV3Args {
    seedUtxo: UTxO;
    assetA: AssetAmount<IAssetAmountMetadata>;
    assetB: AssetAmount<IAssetAmountMetadata>;
    fees: IFeesConfig;
    depositFee: bigint;
    marketOpen?: bigint;
}
/**
 * The arguments for building a minting a new pool transaction against
 * the V3 pool contract, specifically to be associated with the
 * newly minted assets, such as liquidity tokens.
 */
export interface IDatumBuilderPoolMintRedeemerV3Args {
    assetB: AssetAmount<IAssetAmountMetadata>;
    assetA: AssetAmount<IAssetAmountMetadata>;
    poolOutput: bigint;
    metadataOutput: bigint;
}
/**
 * The Lucid implementation of a {@link Core.DatumBuilder}. This is useful
 * if you would rather just build valid CBOR strings for just the datum
 * portion of a valid SundaeSwap transaction.
 */
export declare class DatumBuilderLucidV3 implements DatumBuilder {
    /** The current network id. */
    network: TSupportedNetworks;
    /** The error to throw when the pool ident does not match V1 constraints. */
    static INVALID_POOL_IDENT: string;
    V3_POOL_PARAMS: {};
    constructor(network: TSupportedNetworks);
    /**
     * Constructs a swap datum object tailored for V3 swaps, based on the provided arguments. This function
     * assembles a detailed swap datum structure, which includes the pool ident, destination address, owner information,
     * scooper fee, and the swap order details. The swap order encapsulates the offered asset and the minimum received
     * asset requirements. The constructed datum is then converted to an inline format suitable for transaction embedding,
     * and its hash is computed. The function returns an object containing the hash, the inline datum, and the original
     * datum schema, facilitating the swap operation within a transactional context.
     *
     * @param {IDatumBuilderSwapV3Args} args - The swap arguments for constructing the V3 swap datum.
     * @returns {TDatumResult<V3Types.TOrderDatum>} An object containing the hash of the inline datum, the inline datum itself,
     *                                              and the schema of the original swap datum, essential for the execution of the swap operation.
     */
    buildSwapDatum({ destinationAddress, ident, order, ownerAddress, scooperFee, }: IDatumBuilderSwapV3Args): TDatumResult<V3Types.TOrderDatum>;
    /**
     * Constructs a deposit datum object for V3 deposits, based on the specified arguments. This function
     * creates a comprehensive deposit datum structure, which includes the destination address, the pool ident,
     * owner information, scooper fee, and the deposit order details. The deposit order specifies the assets involved
     * in the deposit. The constructed datum is then converted to an inline format, suitable for embedding within
     * transactions, and its hash is calculated. The function returns an object containing the hash of the inline datum,
     * the inline datum itself, and the schema of the original datum, which are key for facilitating the deposit operation
     * within a transactional framework.
     *
     * @param {IDatumBuilderDepositV3Args} args - The deposit arguments for constructing the V3 deposit datum.
     * @returns {TDatumResult<V3Types.TOrderDatum>} An object comprising the hash of the inline datum, the inline datum itself,
     *                                              and the schema of the original deposit datum, essential for the execution of the deposit operation.
     */
    buildDepositDatum({ destinationAddress, ident, order, ownerAddress, scooperFee, }: IDatumBuilderDepositV3Args): TDatumResult<V3Types.TOrderDatum>;
    /**
     * Creates a withdraw datum object for V3 withdrawals, utilizing the provided arguments. This function
     * assembles a detailed withdraw datum structure, which encompasses the destination address, pool ident,
     * owner information, scooper fee, and the withdrawal order details. The withdrawal order defines the amount
     * of LP (Liquidity Provider) tokens involved in the withdrawal. Once the datum is constructed, it is converted
     * into an inline format, suitable for transaction embedding, and its hash is calculated. The function returns
     * an object containing the hash of the inline datum, the inline datum itself, and the schema of the original
     * datum, facilitating the withdrawal operation within a transactional context.
     *
     * @param {IDatumBuilderWithdrawV3Args} args - The withdrawal arguments for constructing the V3 withdraw datum.
     * @returns {TDatumResult<V3Types.TOrderDatum>} An object containing the hash of the inline datum, the inline datum itself,
     *                                              and the schema of the original withdraw datum, crucial for the execution of the withdrawal operation.
     */
    buildWithdrawDatum({ destinationAddress, ident, order, ownerAddress, scooperFee, }: IDatumBuilderWithdrawV3Args): TDatumResult<V3Types.TOrderDatum>;
    /**
     * Creates a new pool datum for minting a the pool. This is attached to the assets that are sent
     * to the pool minting contract. See {@link Lucid.TxBuilderLucidV3} for more details.
     *
     * @param {IDatumBuilderMintPoolV3Args} params The arguments for building a pool mint datum.
     *  - assetA: The amount and metadata of assetA. This is a bit misleading because the assets are lexicographically ordered anyway.
     *  - assetB: The amount and metadata of assetB. This is a bit misleading because the assets are lexicographically ordered anyway.
     *  - fee: The pool fee represented as per thousand.
     *  - marketOpen: The POSIX timestamp for when pool trades should start executing.
     *  - protocolFee: The fee gathered for the protocol treasury.
     *  - seedUtxo: The UTXO to use as the seed, which generates asset names and the pool ident.
     *
     * @returns {TDatumResult<V3Types.TPoolDatum>} An object containing the hash of the inline datum, the inline datum itself,
     *                                              and the schema of the original pool mint datum, crucial for the execution
     *                                              of the minting pool operation.
     */
    buildMintPoolDatum({ assetA, assetB, fees, marketOpen, depositFee, seedUtxo, }: IDatumBuilderMintPoolV3Args): TDatumResult<V3Types.TPoolDatum>;
    /**
     * Creates a redeemer datum for minting a new pool. This is attached to the new assets that
     * creating a new pool mints on the blockchain. See {@link Lucid.TxBuilderLucidV3} for more
     * details.
     *
     * @param {IDatumBuilderPoolMintRedeemerV3Args} param The assets being supplied to the new pool.
     *  - assetA: The amount and metadata of assetA. This is a bit misleading because the assets are lexicographically ordered anyway.
     *  - assetB: The amount and metadata of assetB. This is a bit misleading because the assets are lexicographically ordered anyway.
     * @returns {TDatumResult<V3Types.TPoolMintRedeemer>} An object containing the hash of the inline datum, the inline datum itself,
     *                                              and the schema of the original pool mint redeemer datum, crucial for the execution
     *                                              of the minting pool operation.
     */
    buildPoolMintRedeemerDatum({ assetA, assetB, metadataOutput, poolOutput, }: IDatumBuilderPoolMintRedeemerV3Args): TDatumResult<V3Types.TPoolMintRedeemer>;
    buildWithdrawAsset(fundedLPAsset: AssetAmount<IAssetAmountMetadata>): TDatumResult<Data>;
    buildDestinationAddresses({ address, datum, }: TDestinationAddress): TDatumResult<V3Types.TDestination>;
    buildOwnerDatum(main: string): TDatumResult<V3Types.TMultiSigScript>;
    buildAssetAmountDatum(asset: AssetAmount<IAssetAmountMetadata>): TDatumResult<V3Types.TSingletonValue>;
    buildLexicographicalAssetsDatum(assetA: AssetAmount<IAssetAmountMetadata>, assetB: AssetAmount<IAssetAmountMetadata>): TDatumResult<[V3Types.TAssetClass, V3Types.TAssetClass]>;
    buildPoolIdent(ident: string): string;
    /**
     * Computes the pool NFT name.
     *
     * @param {string} poolId The hex encoded pool ident.
     * @returns {string}
     */
    static computePoolNftName(poolId: string): string;
    /**
     * Computes the pool liquidity name.
     *
     * @param {string} poolId The hex encoded pool ident.
     * @returns {string}
     */
    static computePoolLqName(poolId: string): string;
    /**
     * Computes the pool reference name.
     *
     * @param {string} poolId The hex encoded pool ident.
     * @returns {string}
     */
    static computePoolRefName(poolId: string): string;
    /**
     * Computes the pool ID based on the provided UTxO being spent.
     *
     * @param {UTxO} seed The UTxO txHash and index.
     * @returns {string}
     */
    static computePoolId(seed: UTxO): string;
    /**
     * Extracts the staking and payment key hashes from a given datum's destination address. This static method
     * parses the provided datum to retrieve the destination address and then extracts the staking key hash and payment
     * key hash, if they exist. The method supports addresses that may include both staking and payment credentials,
     * handling each accordingly. It returns an object containing the staking key hash and payment key hash, which can
     * be used for further processing or validation within the system.
     *
     * @param {string} datum - The serialized datum string from which the destination address and its credentials are to be extracted.
     * @returns {{ stakingKeyHash: string | undefined, paymentKeyHash: string | undefined }} An object containing the staking and
     *          payment key hashes extracted from the destination address within the datum. Each key hash is returned as a string
     *          if present, or `undefined` if the respective credential is not found in the address.
     */
    static getDestinationAddressesFromDatum(datum: string): {
        stakingKeyHash: string | undefined;
        paymentKeyHash: string | undefined;
    };
    /**
     * Retrieves the owner's signing key from a given datum. This static method parses the provided
     * datum to extract the owner's information, specifically focusing on the signing key associated
     * with the owner. This key is crucial for validating ownership and authorizing transactions within
     * the system. The method is designed to work with datums structured according to V3Types.OrderDatum,
     * ensuring compatibility with specific transaction formats.
     *
     * @param {string} datum - The serialized datum string from which the owner's signing key is to be extracted.
     * @returns {string} The signing key associated with the owner, extracted from the datum. This key is used
     *          for transaction validation and authorization purposes.
     */
    static getSignerKeyFromDatum(datum: string): string | undefined;
    static addressSchemaToBech32(datum: V3Types.TAddressSchema, lucid: Lucid): string;
}
//# sourceMappingURL=DatumBuilder.Lucid.V3.class.d.ts.map