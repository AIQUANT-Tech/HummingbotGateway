import { AssetAmount, IAssetAmountMetadata } from "@sundaeswap/asset";
import type { Lucid, Tx, TxComplete } from "lucid-cardano";
import { ICancelConfigArgs, IComposedTx, IDepositConfigArgs, IMigrateLiquidityConfig, IMigrateYieldFarmingLiquidityConfig, IOrderRouteSwapArgs, ISundaeProtocolParamsFull, ISundaeProtocolValidatorFull, ISwapConfigArgs, ITxBuilderReferralFee, IWithdrawConfigArgs, IZapConfigArgs, TSupportedNetworks } from "../@types/index.js";
import { TxBuilder } from "../Abstracts/TxBuilder.abstract.class.js";
import { DatumBuilderLucidV1 } from "../DatumBuilders/DatumBuilder.Lucid.V1.class.js";
import { QueryProviderSundaeSwap } from "../QueryProviders/QueryProviderSundaeSwap.js";
/**
 * Object arguments for completing a transaction.
 */
export interface ITxBuilderLucidCompleteTxArgs {
    tx: Tx;
    referralFee?: AssetAmount<IAssetAmountMetadata>;
    datum?: string;
    deposit?: bigint;
    scooperFee?: bigint;
    coinSelection?: boolean;
}
/**
 * Interface describing the parameter names for the transaction builder.
 */
export interface ITxBuilderV1Params {
    cancelRedeemer: string;
    maxScooperFee: bigint;
}
/**
 * `TxBuilderLucidV1` is a class extending `TxBuilder` to support transaction construction
 * for Lucid against the V1 SundaeSwap protocol. It includes capabilities to build and execute various transaction types
 * such as swaps, cancellations, updates, deposits, withdrawals, zaps, and liquidity migrations to
 * the V3 contracts (it is recommended to utilize V3 contracts if possible: {@link Lucid.TxBuilderLucidV3}).
 *
 * @implements {TxBuilder}
 */
export declare class TxBuilderLucidV1 extends TxBuilder {
    lucid: Lucid;
    datumBuilder: DatumBuilderLucidV1;
    queryProvider: QueryProviderSundaeSwap;
    network: TSupportedNetworks;
    protocolParams: ISundaeProtocolParamsFull | undefined;
    static PARAMS: Record<TSupportedNetworks, ITxBuilderV1Params>;
    /**
     * @param {Lucid} lucid A configured Lucid instance to use.
     * @param {DatumBuilderLucidV1} datumBuilder A valid V1 DatumBuilder class that will build valid datums.
     */
    constructor(lucid: Lucid, datumBuilder: DatumBuilderLucidV1, queryProvider?: QueryProviderSundaeSwap);
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
     * Gets the full validator script based on the key. If the validator
     * scripts have not been fetched yet, then we get that information
     * before returning a response.
     *
     * @param {string} name The name of the validator script to retrieve.
     * @returns {Promise<ISundaeProtocolValidatorFull>}
     */
    getValidatorScript(name: string): Promise<ISundaeProtocolValidatorFull>;
    /**
     * Helper method to get a specific parameter of the transaction builder.
     *
     * @param {K extends keyof ITxBuilderV1Params} param The parameter you want to retrieve.
     * @param {TSupportedNetworks} network The protocol network.
     * @returns {ITxBuilderV1Params[K]}
     */
    static getParam<K extends keyof ITxBuilderV1Params>(param: K, network: TSupportedNetworks): ITxBuilderV1Params[K];
    /**
     * An internal shortcut method to avoid having to pass in the network all the time.
     *
     * @param param The parameter you want to retrieve.
     * @returns {ITxBuilderV1Params}
     */
    __getParam<K extends keyof ITxBuilderV1Params>(param: K): ITxBuilderV1Params[K];
    /**
     * Returns a new Tx instance from Lucid. Throws an error if not ready.
     * @returns
     */
    newTxInstance(fee?: ITxBuilderReferralFee): Tx;
    /**
     * Executes a swap transaction based on the provided swap configuration.
     * It constructs the necessary arguments for the swap, builds the transaction instance,
     * and completes the transaction by paying to the contract and finalizing the transaction details.
     *
     * @param {ISwapConfigArgs} swapArgs - The configuration arguments for the swap.
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} A promise that resolves to the result of the completed transaction.
     *
     * @async
     * @example
     * ```ts
     * const txHash = await sdk.builder().swap({
     *   ...args
     * })
     *   .then(({ sign }) => sign())
     *   .then(({ submit }) => submit())
     * ```
     */
    swap(swapArgs: ISwapConfigArgs): Promise<IComposedTx<Tx, TxComplete>>;
    /**
     * Performs an order route swap with the given arguments.
     *
     * @async
     * @param {IOrderRouteSwapArgs} args - The arguments for the order route swap.
     *
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} The result of the transaction.
     */
    orderRouteSwap(args: IOrderRouteSwapArgs): Promise<IComposedTx<Tx, TxComplete>>;
    /**
     * Executes a cancel transaction based on the provided configuration arguments.
     * Validates the datum and datumHash, retrieves the necessary UTXO data,
     * sets up the transaction, and completes it.
     *
     * @param {ICancelConfigArgs} cancelArgs - The configuration arguments for the cancel transaction.
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} A promise that resolves to the result of the cancel transaction.
     *
     * @async
     * @example
     * ```ts
     * const txHash = await sdk.builder().cancel({
     *   ...args
     * })
     *   .then(({ sign }) => sign())
     *   .then(({ submit }) => submit());
     * ```
     */
    cancel(cancelArgs: ICancelConfigArgs): Promise<IComposedTx<Tx, TxComplete, string | undefined, Record<string, AssetAmount<IAssetAmountMetadata>>>>;
    /**
     * Updates a transaction by first executing a cancel transaction, spending that back into the
     * contract, and then attaching a swap datum. It handles referral fees and ensures the correct
     * accumulation of assets for the transaction.
     *
     * @param {{ cancelArgs: ICancelConfigArgs, swapArgs: ISwapConfigArgs }}
     *        The arguments for cancel and swap configurations.
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} A promise that resolves to the result of the updated transaction.
     *
     * @throws
     * @async
     * @example
     * ```ts
     * const txHash = await sdk.builder().update({
     *   cancelArgs: {
     *     ...args
     *   },
     *   swapArgs: {
     *     ...args
     *   }
     * })
     *   .then(({ sign }) => sign())
     *   .then(({ submit }) => submit());
     * ```
     */
    update({ cancelArgs, swapArgs, }: {
        cancelArgs: ICancelConfigArgs;
        swapArgs: ISwapConfigArgs;
    }): Promise<IComposedTx<Tx, TxComplete, string | undefined, Record<string, AssetAmount<IAssetAmountMetadata>>>>;
    deposit(depositArgs: IDepositConfigArgs): Promise<IComposedTx<Tx, TxComplete, string | undefined, Record<string, AssetAmount<IAssetAmountMetadata>>>>;
    /**
     * Executes a withdrawal transaction using the provided withdrawal configuration arguments.
     * The method builds the withdrawal transaction, including the necessary accumulation of LP tokens
     * and datum, and then completes the transaction to remove liquidity from a pool.
     *
     * @param {IWithdrawConfigArgs} withdrawArgs - The configuration arguments for the withdrawal.
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} A promise that resolves to the composed transaction object.
     *
     * @async
     * @example
     * ```ts
     * const txHash = await sdk.builder().withdraw({
     *   ..args
     * })
     *   .then(({ sign }) => sign())
     *   .then(({ submit }) => submit());
     * ```
     */
    withdraw(withdrawArgs: IWithdrawConfigArgs): Promise<IComposedTx<Tx, TxComplete>>;
    /**
     * Executes a zap transaction which combines a swap and a deposit into a single operation.
     * It determines the swap direction, builds the necessary arguments, sets up the transaction,
     * and then completes it by attaching the required metadata and making payments.
     *
     * @param {Omit<IZapConfigArgs, "zapDirection">} zapArgs - The configuration arguments for the zap, excluding the zap direction.
     * @returns {Promise<IComposedTx<Tx, TxComplete>>} A promise that resolves to the composed transaction object resulting from the zap operation.
     *
     * @async
     * @example
     * ```ts
     * const txHash = await sdk.builder().zap({
     *   ...args
     * })
     *   .then(({ sign }) => sign())
     *   .then(({ submit }) => submit());
     * ```
     */
    zap(zapArgs: Omit<IZapConfigArgs, "zapDirection">): Promise<IComposedTx<Tx, TxComplete>>;
    /**
     * Temporary function that migrates liquidity from V1 to version V3 pools in a batch process. This asynchronous function
     * iterates through an array of migration configurations, each specifying the withdrawal configuration
     * from a V1 pool and the deposit details into a V3 pool. For each migration, it constructs a withdrawal
     * datum for the V1 pool and a deposit datum for the V3 pool, calculates required fees, and constructs
     * the transaction metadata. It accumulates the total scooper fees, deposit amounts, and referral fees
     * across all migrations. The function concludes by composing a final transaction that encompasses all
     * individual migrations and returns the completed transaction along with the total fees and deposits.
     *
     * @param {IMigrateLiquidityConfig[]} migrations - An array of objects, each containing the withdrawal configuration for a V1 pool and the deposit pool data for a V3 pool.
     * @param {IMigrateYieldFarmingLiquidityConfig} yieldFarming - Migration configuration for any locked Yield Farming positions for a V1 pool.
     * @returns {Promise<TTransactionResult>} A promise that resolves to the transaction result, including the final transaction, total deposit, scooper fees, and referral fees.
     *
     * @example
     * ```typescript
     * const migrationResult = await sdk.builder().migrateLiquidityToV3([
     *   {
     *     withdrawConfig: {
     *       pool: { ident: 'pool1', liquidity: { ... } },
     *       suppliedLPAsset: { ... },
     *       referralFee: { ... },
     *     },
     *     depositPool: {
     *       ident: 'poolV3_1',
     *       assetA: { ... },
     *       assetB: { ... },
     *     },
     *   },
     *   {
     *     withdrawConfig: {
     *       pool: { ident: 'pool2', liquidity: { ... } },
     *       suppliedLPAsset: { ... },
     *       referralFee: { ... },
     *     },
     *     depositPool: {
     *       ident: 'poolV3_2',
     *       assetA: { ... },
     *       assetB: { ... },
     *     },
     *   },
     * ]);
     * ```
     */
    migrateLiquidityToV3(migrations: IMigrateLiquidityConfig[], yieldFarming?: IMigrateYieldFarmingLiquidityConfig): Promise<IComposedTx<Tx, TxComplete, string | undefined, Record<string, AssetAmount<IAssetAmountMetadata>>>>;
    private completeTx;
}
//# sourceMappingURL=TxBuilder.Lucid.V1.class.d.ts.map