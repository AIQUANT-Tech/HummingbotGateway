import { UTxO, type Datum, type Lucid, type Tx, type TxComplete } from "lucid-cardano";
import type { ICancelConfigArgs, IComposedTx, IDepositConfigArgs, IMintV3PoolConfigArgs, IOrderRouteSwapArgs, ISundaeProtocolParamsFull, ISundaeProtocolReference, ISundaeProtocolValidatorFull, ISwapConfigArgs, ITxBuilderReferralFee, IWithdrawConfigArgs, IZapConfigArgs, TSupportedNetworks } from "../@types/index.js";
import { TxBuilder } from "../Abstracts/TxBuilder.abstract.class.js";
import { DatumBuilderLucidV3 } from "../DatumBuilders/DatumBuilder.Lucid.V3.class.js";
import { QueryProviderSundaeSwap } from "../QueryProviders/QueryProviderSundaeSwap.js";
/**
 * Interface describing the parameter names for the transaction builder.
 */
export interface ITxBuilderV3Params {
    cancelRedeemer: string;
}
/**
 * `TxBuilderLucidV3` is a class extending `TxBuilder` to support transaction construction
 * for Lucid against the V3 SundaeSwap protocol. It includes capabilities to build and execute various transaction types
 * such as swaps, cancellations, updates, deposits, withdrawals, and zaps.
 *
 * @implements {TxBuilder}
 */
export declare class TxBuilderLucidV3 extends TxBuilder {
    lucid: Lucid;
    datumBuilder: DatumBuilderLucidV3;
    queryProvider: QueryProviderSundaeSwap;
    network: TSupportedNetworks;
    protocolParams: ISundaeProtocolParamsFull | undefined;
    referenceUtxos: UTxO[] | undefined;
    settingsUtxos: UTxO[] | undefined;
    validatorScripts: Record<string, ISundaeProtocolValidatorFull>;
    static MIN_ADA_POOL_MINT_ERROR: string;
    private SETTINGS_NFT_NAME;
    /**
     * @param {Lucid} lucid A configured Lucid instance to use.
     * @param {DatumBuilderLucidV3} datumBuilder A valid V3 DatumBuilder class that will build valid datums.
     */
    constructor(lucid: Lucid, datumBuilder: DatumBuilderLucidV3, queryProvider?: QueryProviderSundaeSwap);
    /**
     * Retrieves the basic protocol parameters from the SundaeSwap API
     * and fills in a place-holder for the compiled code of any validators.
     *
     * This is to keep things lean until we really need to attach a validator,
     * in which case, a subsequent method call to {@link TxBuilderLucidV3#getValidatorScript}
     * will re-populate with real data.
     *
     * @returns {Promise<ISundaeProtocolParamsFull>}
     */
    getProtocolParams(): Promise<ISundaeProtocolParamsFull>;
    /**
     * Gets the reference UTxOs based on the transaction data
     * stored in the reference scripts of the protocol parameters
     * using the Lucid provider.
     *
     * @returns {Promise<UTxO[]>}
     */
    getAllReferenceUtxos(): Promise<UTxO[]>;
    /**
     *
     * @param {string} type The type of reference input to retrieve.
     * @returns {ISundaeProtocolReference}
     */
    getReferenceScript(type: "order.spend" | "pool.spend"): Promise<ISundaeProtocolReference>;
    /**
     * Gets the settings UTxOs based on the transaction data
     * stored in the settings scripts of the protocol parameters
     * using the Lucid provider.
     *
     * @returns {Promise<UTxO[]>}
     */
    getAllSettingsUtxos(): Promise<UTxO[]>;
    /**
     * Utility function to get the max scooper fee amount, which is defined
     * in the settings UTXO datum. If no settings UTXO was found, due to a network
     * error or otherwise, we fallback to 1 ADA.
     *
     * @returns {bigint} The maxScooperFee as defined by the settings UTXO.
     */
    getMaxScooperFeeAmount(): Promise<bigint>;
    /**
     * Gets the full validator script based on the key. If the validator
     * scripts have not been fetched yet, then we get that information
     * before returning a response.
     *
     * @param {string} name The name of the validator script to retrieve.
     * @returns {Promise<ISundaeProtocolValidatorFull>}
     */
    getValidatorScript(name: string): Promise<ISundaeProtocolValidatorFull>;
    /**
     * Returns a new Tx instance from Lucid and pre-applies the referral
     * fee payment if a {@link ITxBuilderReferralFee} config is passed in.
     *
     * @param {ITxBuilderReferralFee | undefined} fee The optional referral fee configuration.
     * @returns {Tx}
     */
    newTxInstance(fee?: ITxBuilderReferralFee): Tx;
    /**
     * Mints a new liquidity pool on the Cardano blockchain. This method
     * constructs and submits a transaction that includes all the necessary generation
     * of pool NFTs, metadata, pool assets, and initial liquidity tokens,
     *
     * @param {IMintV3PoolConfigArgs} mintPoolArgs - Configuration arguments for minting the pool, including assets,
     * fee parameters, owner address, protocol fee, and referral fee.
     *  - assetA: The amount and metadata of assetA. This is a bit misleading because the assets are lexicographically ordered anyway.
     *  - assetB: The amount and metadata of assetB. This is a bit misleading because the assets are lexicographically ordered anyway.
     *  - fee: The desired pool fee, denominated out of 10 thousand.
     *  - marketOpen: The POSIX timestamp for when the pool should allow trades (market open).
     *  - ownerAddress: Who the generated LP tokens should be sent to.
     * @returns {Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A completed transaction object.
     *
     * @throws {Error} Throws an error if the transaction fails to build or submit.
     */
    mintPool(mintPoolArgs: IMintV3PoolConfigArgs): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Executes a swap transaction based on the provided swap configuration.
     * It constructs the necessary arguments for the swap, builds the transaction instance,
     * and completes the transaction by paying to the contract and finalizing the transaction details.
     *
     * @param {ISwapConfigArgs} swapArgs - The configuration arguments for the swap.
     * @returns {Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A promise that resolves to the result of the completed transaction.
     */
    swap(swapArgs: ISwapConfigArgs): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Performs an order route swap with the given arguments.
     *
     * @async
     * @param {IOrderRouteSwapArgs} args - The arguments for the order route swap.
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} The result of the transaction.
     */
    orderRouteSwap(args: IOrderRouteSwapArgs): Promise<IComposedTx<Tx, TxComplete>>;
    /**
     * Executes a cancel transaction based on the provided configuration arguments.
     * Validates the datum and datumHash, retrieves the necessary UTXO data,
     * sets up the transaction, and completes it.
     *
     * @param {ICancelConfigArgs} cancelArgs - The configuration arguments for the cancel transaction.
     * @returns {Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A promise that resolves to the result of the cancel transaction.
     */
    cancel(cancelArgs: ICancelConfigArgs): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Updates a transaction by first executing a cancel transaction, spending that back into the
     * contract, and then attaching a swap datum. It handles referral fees and ensures the correct
     * accumulation of assets for the transaction.
     *
     * @param {{ cancelArgs: ICancelConfigArgs, swapArgs: ISwapConfigArgs }}
     *        The arguments for cancel and swap configurations.
     * @returns {PromisePromise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A promise that resolves to the result of the updated transaction.
     */
    update({ cancelArgs, swapArgs, }: {
        cancelArgs: ICancelConfigArgs;
        swapArgs: ISwapConfigArgs;
    }): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Executes a deposit transaction using the provided deposit configuration arguments.
     * The method builds the deposit transaction, including the necessary accumulation of deposit tokens
     * and the required datum, then completes the transaction to add liquidity to a pool.
     *
     * @param {IDepositConfigArgs} depositArgs - The configuration arguments for the deposit.
     * @returns {Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A promise that resolves to the composed transaction object.
     */
    deposit(depositArgs: IDepositConfigArgs): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Executes a withdrawal transaction using the provided withdrawal configuration arguments.
     * The method builds the withdrawal transaction, including the necessary accumulation of LP tokens
     * and datum, and then completes the transaction to remove liquidity from a pool.
     *
     * @param {IWithdrawConfigArgs} withdrawArgs - The configuration arguments for the withdrawal.
     * @returns {Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A promise that resolves to the composed transaction object.
     */
    withdraw(withdrawArgs: IWithdrawConfigArgs): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Executes a zap transaction which combines a swap and a deposit into a single operation.
     * It determines the swap direction, builds the necessary arguments, sets up the transaction,
     * and then completes it by attaching the required metadata and making payments.
     *
     * @param {Omit<IZapConfigArgs, "zapDirection">} zapArgs - The configuration arguments for the zap, excluding the zap direction.
     * @returns {Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>} A promise that resolves to the composed transaction object resulting from the zap operation.
     */
    zap(zapArgs: Omit<IZapConfigArgs, "zapDirection">): Promise<IComposedTx<Tx, TxComplete, Datum | undefined>>;
    /**
     * Merges the user's staking key to the contract payment address if present.
     *
     * @param {string} type
     * @param ownerAddress
     * @returns {Promise<string>} The generated Bech32 address.
     */
    generateScriptAddress(type: "order.spend" | "pool.mint", ownerAddress?: string): Promise<string>;
    /**
     * Retrieves the list of UTXOs associated with the wallet, sorts them first by transaction hash (`txHash`)
     * in ascending order and then by output index (`outputIndex`) in ascending order, and returns them for Lucid
     * to collect from.
     *
     * @returns {Promise<UTxO[]>} A promise that resolves to an array of UTXOs for the transaction. Sorting is required
     * because the first UTXO in the sorted list is the seed (used for generating a unique pool ident, etc).
     * @throws {Error} Throws an error if the retrieval of UTXOs fails or if no UTXOs are available.
     */
    getUtxosForPoolMint(): Promise<UTxO[]>;
    private completeTx;
}
//# sourceMappingURL=TxBuilder.Lucid.V3.class.d.ts.map