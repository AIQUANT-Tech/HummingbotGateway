console.log('entry point reached--------4')
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { PaginationOptions } from '@blockfrost/blockfrost-js/lib/types';
import Big from 'big.js';
import { Constr, Data, Address, Script, OutRef, Credential, UTxO, Lucid, TxComplete } from 'lucid-cardano';

declare const ADA: Asset;
declare type Asset = {
    policyId: string;
    tokenName: string;
};
declare namespace Asset {
    function fromString(s: string): Asset;
    function toString(asset: Asset): string;
    function toPlutusData(asset: Asset): Constr<Data>;
    function fromPlutusData(data: Constr<Data>): Asset;
}

declare enum NetworkId {
    TESTNET = 0,
    MAINNET = 1
}

declare namespace DexV1Constant {
    const ORDER_BASE_ADDRESS: Record<number, Address>;
    const POOL_SCRIPT_HASH = "script1uychk9f04tqngfhx4qlqdlug5ntzen3uzc62kzj7cyesjk0d9me";
    const FACTORY_POLICY_ID = "13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f";
    const FACTORY_ASSET_NAME = "4d494e53574150";
    const LP_POLICY_ID = "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86";
    const POOL_NFT_POLICY_ID = "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1";
    const ORDER_SCRIPT: Script;
}
declare namespace StableswapConstant {
    type Config = {
        orderAddress: Address;
        poolAddress: Address;
        nftAsset: string;
        lpAsset: string;
        assets: string[];
        multiples: bigint[];
        fee: bigint;
        adminFee: bigint;
        feeDenominator: bigint;
    };
    type DeployedScripts = {
        order: OutRef;
        pool: OutRef;
        lp: OutRef;
        poolBatching: OutRef;
    };
    const CONFIG: Record<NetworkId, Config[]>;
    const DEPLOYED_SCRIPTS: Record<NetworkId, Record<string, DeployedScripts>>;
}
declare namespace DexV2Constant {
    type Config = {
        factoryAsset: string;
        poolAuthenAsset: string;
        globalSettingAsset: string;
        lpPolicyId: string;
        globalSettingScriptHash: string;
        orderScriptHash: string;
        poolScriptHash: string;
        poolScriptHashBech32: string;
        poolCreationAddress: Address;
        factoryScriptHash: string;
        expiredOrderCancelAddress: string;
        poolBatchingAddress: string;
    };
    type DeployedScripts = {
        order: OutRef;
        pool: OutRef;
        factory: OutRef;
        authen: OutRef;
        poolBatching: OutRef;
        expiredOrderCancellation: OutRef;
    };
    const CONFIG: Record<NetworkId, Config>;
    const DEPLOYED_SCRIPTS: Record<NetworkId, DeployedScripts>;
}
declare const BATCHER_FEE_REDUCTION_SUPPORTED_ASSET: Record<number, [
    string,
    string
]>;
declare enum MetadataMessage {
    DEPOSIT_ORDER = "SDK Minswap: Deposit Order",
    CANCEL_ORDER = "SDK Minswap: Cancel Order",
    ZAP_IN_ORDER = "SDK Minswap: Zap Order",
    SWAP_EXACT_IN_ORDER = "SDK Minswap: Swap Exact In Order",
    SWAP_EXACT_IN_LIMIT_ORDER = "SDK Minswap: Swap Exact In Limit Order",
    SWAP_EXACT_OUT_ORDER = "SDK Minswap: Swap Exact Out Order",
    WITHDRAW_ORDER = "SDK Minswap: Withdraw Order"
}
declare const FIXED_DEPOSIT_ADA = 2000000n;

declare type Value = {
    unit: string;
    quantity: string;
}[];
declare type TxIn = {
    txHash: string;
    index: number;
};
declare type TxHistory = {
    txHash: string;
    /** Transaction index within the block */
    txIndex: number;
    blockHeight: number;
    time: Date;
};

declare type PoolFeeSharing = {
    feeTo: Address;
    feeToDatumHash?: string;
};
declare namespace PoolFeeSharing {
    function toPlutusData(feeSharing: PoolFeeSharing): Constr<Data>;
    function fromPlutusData(networkId: NetworkId, data: Constr<Data>): PoolFeeSharing;
}

declare const DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR = 10000n;
declare namespace PoolV1 {
    /**
     * Represents state of a pool UTxO. The state could be latest state or a historical state.
     */
    class State {
        /** The transaction hash and output index of the pool UTxO */
        readonly address: string;
        readonly txIn: TxIn;
        readonly value: Value;
        readonly datumHash: string;
        readonly assetA: string;
        readonly assetB: string;
        constructor(address: string, txIn: TxIn, value: Value, datumHash: string);
        get nft(): string;
        get id(): string;
        get assetLP(): string;
        get reserveA(): bigint;
        get reserveB(): bigint;
    }
    type Datum = {
        assetA: Asset;
        assetB: Asset;
        totalLiquidity: bigint;
        rootKLast: bigint;
        feeSharing?: PoolFeeSharing;
    };
    namespace Datum {
        function toPlutusData(datum: Datum): Constr<Data>;
        function fromPlutusData(networkId: NetworkId, data: Constr<Data>): Datum;
    }
}
declare namespace StablePool {
    class State {
        readonly address: string;
        readonly txIn: TxIn;
        readonly value: Value;
        readonly datumCbor: string;
        readonly datum: Datum;
        readonly config: StableswapConstant.Config;
        constructor(networkId: NetworkId, address: string, txIn: TxIn, value: Value, datum: string);
        get assets(): string[];
        get nft(): string;
        get lpAsset(): string;
        get reserves(): bigint[];
        get totalLiquidity(): bigint;
        get orderHash(): string;
        get amp(): bigint;
        get id(): string;
    }
    type Datum = {
        balances: bigint[];
        totalLiquidity: bigint;
        amplificationCoefficient: bigint;
        orderHash: string;
    };
    namespace Datum {
        function toPlutusData(datum: Datum): Constr<Data>;
        function fromPlutusData(data: Constr<Data>): Datum;
    }
}
declare namespace PoolV2 {
    function computeLPAssetName(assetA: Asset, assetB: Asset): string;
    class State {
        readonly address: string;
        readonly txIn: TxIn;
        readonly value: Value;
        readonly datumRaw: string;
        readonly datum: Datum;
        readonly config: DexV2Constant.Config;
        readonly lpAsset: Asset;
        readonly authenAsset: Asset;
        constructor(networkId: NetworkId, address: string, txIn: TxIn, value: Value, datum: string);
        get assetA(): string;
        get assetB(): string;
        get totalLiquidity(): bigint;
        get reserveA(): bigint;
        get reserveB(): bigint;
        get feeA(): [bigint, bigint];
        get feeB(): [bigint, bigint];
        get feeShare(): [bigint, bigint] | undefined;
    }
    type Datum = {
        poolBatchingStakeCredential: Credential;
        assetA: Asset;
        assetB: Asset;
        totalLiquidity: bigint;
        reserveA: bigint;
        reserveB: bigint;
        baseFee: {
            feeANumerator: bigint;
            feeBNumerator: bigint;
        };
        feeSharingNumerator?: bigint;
        allowDynamicFee: boolean;
    };
    namespace Datum {
        function toPlutusData(datum: Datum): Constr<Data>;
        function fromPlutusData(data: Constr<Data>): Datum;
    }
}

declare type BlockfrostAdapterOptions = {
    networkId: NetworkId;
    blockFrost: BlockFrostAPI;
};
declare type GetPoolsParams = Omit<PaginationOptions, "page"> & {
    page: number;
};
declare type GetPoolByIdParams = {
    id: string;
};
declare type GetPoolPriceParams = {
    pool: PoolV1.State;
    decimalsA?: number;
    decimalsB?: number;
};
declare type GetPoolHistoryParams = PaginationOptions & {
    id: string;
};
declare type GetPoolInTxParams = {
    txHash: string;
};
declare type GetStablePoolInTxParams = {
    networkId: NetworkId;
    txHash: string;
};
declare class BlockfrostAdapter {
    private readonly api;
    private readonly networkId;
    constructor({ networkId, blockFrost }: BlockfrostAdapterOptions);
    /**
     * @returns The latest pools or empty array if current page is after last page
     */
    getV1Pools({ page, count, order, }: GetPoolsParams): Promise<PoolV1.State[]>;
    /**
     * Get a specific pool by its ID.
     * @param {Object} params - The parameters.
     * @param {string} params.pool - The pool ID. This is the asset name of a pool's NFT and LP tokens. It can also be acquired by calling pool.id.
     * @returns {PoolV1.State | null} - Returns the pool or null if not found.
     */
    getV1PoolById({ id, }: GetPoolByIdParams): Promise<PoolV1.State | null>;
    getV1PoolHistory({ id, page, count, order, }: GetPoolHistoryParams): Promise<TxHistory[]>;
    /**
     * Get pool state in a transaction.
     * @param {Object} params - The parameters.
     * @param {string} params.txHash - The transaction hash containing pool output. One of the way to acquire is by calling getPoolHistory.
     * @returns {PoolV1.State} - Returns the pool state or null if the transaction doesn't contain pool.
     */
    getV1PoolInTx({ txHash, }: GetPoolInTxParams): Promise<PoolV1.State | null>;
    getAssetDecimals(asset: string): Promise<number>;
    /**
     * Get pool price.
     * @param {Object} params - The parameters to calculate pool price.
     * @param {string} params.pool - The pool we want to get price.
     * @param {string} [params.decimalsA] - The decimals of assetA in pool, if undefined then query from Blockfrost.
     * @param {string} [params.decimalsB] - The decimals of assetB in pool, if undefined then query from Blockfrost.
     * @returns {[string, string]} - Returns a pair of asset A/B price and B/A price, adjusted to decimals.
     */
    getV1PoolPrice({ pool, decimalsA, decimalsB, }: GetPoolPriceParams): Promise<[Big, Big]>;
    getDatumByDatumHash(datumHash: string): Promise<string>;
    getAllV2Pools(): Promise<{
        pools: PoolV2.State[];
        errors: unknown[];
    }>;
    getV2Pools({ page, count, order, }: GetPoolsParams): Promise<{
        pools: PoolV2.State[];
        errors: unknown[];
    }>;
    getV2PoolByPair(assetA: Asset, assetB: Asset): Promise<PoolV2.State | null>;
    getAllStablePools(): Promise<{
        pools: StablePool.State[];
        errors: unknown[];
    }>;
    getStablePoolByNFT(nft: Asset): Promise<StablePool.State | null>;
}

/**
 * Options to calculate Amount Out & Price Impact while swapping exact in
 * @amountIn The amount that we want to swap from
 * @reserveIn The Reserve of Asset In in Liquidity Pool
 * @reserveOut The Reserve of Asset Out in Liquidity Pool
 */
declare type CalculateSwapExactInOptions = {
    amountIn: bigint;
    reserveIn: bigint;
    reserveOut: bigint;
};
/**
 * Calculate Amount Out & Price Impact while swapping exact in
 * @param options See @CalculateSwapExactInOptions description
 * @returns The amount of the other token that we get from the swap and its price impact
 */
declare function calculateSwapExactIn(options: CalculateSwapExactInOptions): {
    amountOut: bigint;
    priceImpact: Big;
};
/**
 * Options to calculate necessary Amount In & Price Impact to cover the @exactAmountOut while swapping exact out
 * @exactAmountOut The exact amount that we want to receive
 * @reserveIn The Reserve of Asset In in Liquidity Pool
 * @reserveOut The Reserve of Asset Out in Liquidity Pool
 */
declare type CalculateSwapExactOutOptions = {
    exactAmountOut: bigint;
    reserveIn: bigint;
    reserveOut: bigint;
};
/**
 * Calculate necessary Amount In & Price Impact to cover the @exactAmountOut while swapping exact out
 * @param options See @CalculateSwapExactOutOptions description
 * @returns The amount needed of the input token for the swap and its price impact
 */
declare function calculateSwapExactOut(options: CalculateSwapExactOutOptions): {
    amountIn: bigint;
    priceImpact: Big;
};
/**
 * Options to calculate LP Amount while depositing
 * @depositedAmountA Amount of Asset A you want to deposit
 * @depositedAmountB Amount of Asset B you want to deposit
 * @reserveA Reserve of Asset A in Liquidity Pool
 * @reserveB Reserve of Asset B in Liquidity Pool
 * @totalLiquidity Total Circulating of LP Token in Liquidity Pool
 */
declare type CalculateDepositOptions = {
    depositedAmountA: bigint;
    depositedAmountB: bigint;
    reserveA: bigint;
    reserveB: bigint;
    totalLiquidity: bigint;
};
/**
 * Calculate LP Amount while depositing
 * @param options See @CalculateDepositOptions description
 * @returns The amount needed of Asset A and Asset and LP Token Amount you will receive
 */
declare function calculateDeposit(options: CalculateDepositOptions): {
    necessaryAmountA: bigint;
    necessaryAmountB: bigint;
    lpAmount: bigint;
};
/**
 * Options to calculate amount A and amount B after withdrawing @withdrawalLPAmount out of Liquidity Pool
 * @withdrawalLPAmount LP Token amount you want to withdraw
 * @reserveA Reserve of Asset A in Liquidity Pool
 * @reserveB Reserve of Asset B in Liquidity Pool
 * @totalLiquidity Total Circulating of LP Token in Liquidity Pool
 */
declare type CalculateWithdrawOptions = {
    withdrawalLPAmount: bigint;
    reserveA: bigint;
    reserveB: bigint;
    totalLiquidity: bigint;
};
/**
 * Calculate amount A and amount B after withdrawing @withdrawalLPAmount out of Liquidity Pool
 * @param options See @CalculateWithdrawOptions description
 * @returns amount A and amount B you will receive
 */
declare function calculateWithdraw(options: CalculateWithdrawOptions): {
    amountAReceive: bigint;
    amountBReceive: bigint;
};
/**
 * Options to calculate LP Amount while zapping
 * @amountIn Amount you want to zap
 * @reserveIn Reserve of Asset which you want to zap in Liquidity Pool
 * @reserveOut Reserve of other Asset in Liquidity Pool
 * @totalLiquidity Total Circulating of LP Token in Liquidity Pool
 */
declare type CalculateZapInOptions = {
    amountIn: bigint;
    reserveIn: bigint;
    reserveOut: bigint;
    totalLiquidity: bigint;
};
/**
 * Calculate LP Amount while zapping
 * @param options See @CalculateZapInOptions description
 * @returns Amount of LP Token you will receive
 */
declare function calculateZapIn(options: CalculateZapInOptions): bigint;

/**
 * Common options for build Minswap transaction
 * @sender The owner of this order, it will be used for cancelling this order
 * @availableUtxos Available UTxOs can be used in transaction
 */
declare type CommonOptions = {
    sender: Address;
    availableUtxos: UTxO[];
};
/**
 * Options for building cancel Order
 * @orderTxId Transaction ID which order is created
 * @sender The owner of this order. The @sender must be matched with data in Order's Datum
 */
declare type BuildCancelOrderOptions = {
    orderUtxo: UTxO;
    sender: Address;
};
/**
 * Options for building Deposit Order
 * @assetA @assetB Define pair which you want to deposit to
 * @amountA @amountB Define amount which you want to deposit to
 * @minimumLPReceived Minimum Received Amount you can accept after order is executed
 */
declare type BuildDepositTxOptions = CommonOptions & {
    assetA: Asset;
    assetB: Asset;
    amountA: bigint;
    amountB: bigint;
    minimumLPReceived: bigint;
};
/**
 * Options for building Zap In Order
 * @assetIn Asset you want to Zap
 * @assetOut The remaining asset of Pool which you want to Zap.
 *      For eg, in Pool ADA-MIN, if @assetIn is ADA then @assetOut will be MIN and vice versa
 * @minimumLPReceived Minimum Received Amount you can accept after order is executed
 */
declare type BuildZapInTxOptions = CommonOptions & {
    sender: Address;
    assetIn: Asset;
    amountIn: bigint;
    assetOut: Asset;
    minimumLPReceived: bigint;
};
/**
 * Options for building Withdrawal Order
 * @lpAsset LP Asset will be withdrawed
 * @lpAmount LP Asset amount will be withdrawed
 * @minimumAssetAReceived Minimum Received of Asset A in the Pool you can accept after order is executed
 * @minimumAssetBReceived Minimum Received of Asset A in the Pool you can accept after order is executed
 */
declare type BuildWithdrawTxOptions = CommonOptions & {
    sender: Address;
    lpAsset: Asset;
    lpAmount: bigint;
    minimumAssetAReceived: bigint;
    minimumAssetBReceived: bigint;
};
/**
 * Options for building Swap Exact Out Order
 * @assetIn Asset you want to Swap
 * @assetOut Asset you want to receive
 * @maximumAmountIn The maximum Amount of Asset In which will be spent after order is executed
 * @expectedAmountOut The expected Amount of Asset Out you want to receive after order is executed
 */
declare type BuildSwapExactOutTxOptions = CommonOptions & {
    sender: Address;
    assetIn: Asset;
    assetOut: Asset;
    maximumAmountIn: bigint;
    expectedAmountOut: bigint;
};
/**
 * Options for building Swap Exact In Order
 * @assetIn Asset and its amount you want to Swap
 * @amountIn Amount of Asset In you want to Swap
 * @assetOut Asset and you want to receive
 * @minimumAmountOut The minimum Amount of Asset Out you can accept after order is executed
 * @isLimitOrder Define this order is Limit Order or not
 */
declare type BuildSwapExactInTxOptions = CommonOptions & {
    sender: Address;
    assetIn: Asset;
    amountIn: bigint;
    assetOut: Asset;
    minimumAmountOut: bigint;
    isLimitOrder: boolean;
};
declare class Dex {
    private readonly lucid;
    private readonly network;
    private readonly networkId;
    constructor(lucid: Lucid);
    buildSwapExactInTx(options: BuildSwapExactInTxOptions): Promise<TxComplete>;
    buildSwapExactOutTx(options: BuildSwapExactOutTxOptions): Promise<TxComplete>;
    buildWithdrawTx(options: BuildWithdrawTxOptions): Promise<TxComplete>;
    buildZapInTx(options: BuildZapInTxOptions): Promise<TxComplete>;
    buildDepositTx(options: BuildDepositTxOptions): Promise<TxComplete>;
    buildCancelOrder(options: BuildCancelOrderOptions): Promise<TxComplete>;
    private calculateBatcherFee;
}

declare namespace OrderV1 {
    enum StepType {
        SWAP_EXACT_IN = 0,
        SWAP_EXACT_OUT = 1,
        DEPOSIT = 2,
        WITHDRAW = 3,
        ZAP_IN = 4
    }
    type SwapExactIn = {
        type: StepType.SWAP_EXACT_IN;
        desiredAsset: Asset;
        minimumReceived: bigint;
    };
    type SwapExactOut = {
        type: StepType.SWAP_EXACT_OUT;
        desiredAsset: Asset;
        expectedReceived: bigint;
    };
    type Deposit = {
        type: StepType.DEPOSIT;
        minimumLP: bigint;
    };
    type Withdraw = {
        type: StepType.WITHDRAW;
        minimumAssetA: bigint;
        minimumAssetB: bigint;
    };
    type ZapIn = {
        type: StepType.ZAP_IN;
        desiredAsset: Asset;
        minimumLP: bigint;
    };
    type Step = SwapExactIn | SwapExactOut | Deposit | Withdraw | ZapIn;
    type Datum = {
        sender: Address;
        receiver: Address;
        receiverDatumHash?: string;
        step: Step;
        batcherFee: bigint;
        depositADA: bigint;
    };
    namespace Datum {
        function toPlutusData(datum: Datum): Constr<Data>;
        function fromPlutusData(networkId: NetworkId, data: Constr<Data>): Datum;
    }
    enum Redeemer {
        APPLY_ORDER = 0,
        CANCEL_ORDER = 1
    }
}

export { ADA, Asset, BATCHER_FEE_REDUCTION_SUPPORTED_ASSET, BlockfrostAdapter, BlockfrostAdapterOptions, BuildCancelOrderOptions, BuildDepositTxOptions, BuildSwapExactInTxOptions, BuildSwapExactOutTxOptions, BuildWithdrawTxOptions, BuildZapInTxOptions, CalculateDepositOptions, CalculateSwapExactInOptions, CalculateSwapExactOutOptions, CalculateWithdrawOptions, CalculateZapInOptions, DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR, Dex, DexV1Constant, DexV2Constant, FIXED_DEPOSIT_ADA, GetPoolByIdParams, GetPoolHistoryParams, GetPoolInTxParams, GetPoolPriceParams, GetPoolsParams, GetStablePoolInTxParams, MetadataMessage, NetworkId, OrderV1, PoolV1, PoolV2, StablePool, StableswapConstant, calculateDeposit, calculateSwapExactIn, calculateSwapExactOut, calculateWithdraw, calculateZapIn };
