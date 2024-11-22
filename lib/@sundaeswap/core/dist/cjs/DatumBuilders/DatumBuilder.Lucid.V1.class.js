"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatumBuilderLucidV1 = void 0;
const lucid_cardano_1 = require("lucid-cardano");
const index_js_1 = require("../@types/index.js");
const LucidHelper_class_js_1 = require("../Utilities/LucidHelper.class.js");
const constants_js_1 = require("../constants.js");
/**
 * The Lucid implementation for building valid Datums for
 * V1 contracts on the SundaeSwap protocol.
 */
class DatumBuilderLucidV1 {
    /** The current network id. */
    network;
    /** The error to throw when the pool ident does not match V1 constraints. */
    static INVALID_POOL_IDENT = "You supplied a pool ident of an invalid length! The will prevent the scooper from processing this order.";
    constructor(network) {
        this.network = network;
    }
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
    buildSwapDatum({ ident, orderAddresses, fundedAsset, swap, scooperFee, }) {
        const datum = new lucid_cardano_1.Constr(0, [
            this.buildPoolIdent(ident),
            this.buildOrderAddresses(orderAddresses).schema,
            scooperFee,
            this.buildSwapDirection(swap, fundedAsset).schema,
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
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
    buildDepositDatum({ ident, orderAddresses, deposit, scooperFee, }) {
        const datum = new lucid_cardano_1.Constr(0, [
            this.buildPoolIdent(ident),
            this.buildOrderAddresses(orderAddresses).schema,
            scooperFee,
            this.buildDepositPair(deposit).schema,
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
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
    experimental_buildZapDatum({ ident, orderAddresses, zap, scooperFee, }) {
        const datum = new lucid_cardano_1.Constr(0, [
            this.buildPoolIdent(ident),
            this.buildOrderAddresses(orderAddresses).schema,
            scooperFee,
            this.experimental_buildDepositZap(zap).schema,
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
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
    buildWithdrawDatum({ ident, orderAddresses, suppliedLPAsset, scooperFee, }) {
        const datum = new lucid_cardano_1.Constr(0, [
            this.buildPoolIdent(ident),
            this.buildOrderAddresses(orderAddresses).schema,
            scooperFee,
            this.buildWithdrawAsset(suppliedLPAsset).schema,
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    buildDepositPair(deposit) {
        const datum = new lucid_cardano_1.Constr(2, [
            new lucid_cardano_1.Constr(1, [
                new lucid_cardano_1.Constr(0, [deposit.CoinAAmount.amount, deposit.CoinBAmount.amount]),
            ]),
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    experimental_buildDepositZap(zap) {
        const datum = new lucid_cardano_1.Constr(2, [
            new lucid_cardano_1.Constr(zap.ZapDirection, [zap.CoinAmount.amount]),
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    buildWithdrawAsset(fundedLPAsset) {
        const datum = new lucid_cardano_1.Constr(1, [fundedLPAsset.amount]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    buildSwapDirection(swap, amount) {
        const datum = new lucid_cardano_1.Constr(0, [
            new lucid_cardano_1.Constr(swap.SuppliedCoin, []),
            amount.amount,
            swap.MinimumReceivable
                ? new lucid_cardano_1.Constr(0, [swap.MinimumReceivable.amount])
                : new lucid_cardano_1.Constr(1, []),
        ]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    buildOrderAddresses(addresses) {
        LucidHelper_class_js_1.LucidHelper.validateAddressAndDatumAreValid({
            ...addresses.DestinationAddress,
            network: this.network,
        });
        addresses?.AlternateAddress &&
            LucidHelper_class_js_1.LucidHelper.validateAddressAndDatumAreValid({
                address: addresses.AlternateAddress,
                network: this.network,
                datum: {
                    type: index_js_1.EDatumType.NONE,
                },
            });
        const { DestinationAddress, AlternateAddress } = addresses;
        const destination = LucidHelper_class_js_1.LucidHelper.getAddressHashes(DestinationAddress.address);
        const destinationDatum = new lucid_cardano_1.Constr(0, [
            new lucid_cardano_1.Constr(0, [
                new lucid_cardano_1.Constr(LucidHelper_class_js_1.LucidHelper.isScriptAddress(DestinationAddress.address) ? 1 : 0, [destination.paymentCredentials]),
                destination?.stakeCredentials
                    ? new lucid_cardano_1.Constr(0, [
                        new lucid_cardano_1.Constr(0, [
                            new lucid_cardano_1.Constr(LucidHelper_class_js_1.LucidHelper.isScriptAddress(DestinationAddress.address)
                                ? 1
                                : 0, [destination?.stakeCredentials]),
                        ]),
                    ])
                    : new lucid_cardano_1.Constr(1, []),
            ]),
            DestinationAddress.datum.type !== index_js_1.EDatumType.NONE
                ? new lucid_cardano_1.Constr(0, [DestinationAddress.datum.value])
                : new lucid_cardano_1.Constr(1, []),
        ]);
        const alternate = AlternateAddress && LucidHelper_class_js_1.LucidHelper.getAddressHashes(AlternateAddress);
        const alternateDatum = new lucid_cardano_1.Constr(alternate ? 0 : 1, alternate
            ? [alternate.stakeCredentials ?? alternate.paymentCredentials]
            : []);
        const datum = new lucid_cardano_1.Constr(0, [destinationDatum, alternateDatum]);
        const inline = lucid_cardano_1.Data.to(datum);
        return {
            hash: LucidHelper_class_js_1.LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    buildPoolIdent(ident) {
        if (ident.length > constants_js_1.V1_MAX_POOL_IDENT_LENGTH) {
            throw new Error(DatumBuilderLucidV1.INVALID_POOL_IDENT);
        }
        return ident;
    }
}
exports.DatumBuilderLucidV1 = DatumBuilderLucidV1;
//# sourceMappingURL=DatumBuilder.Lucid.V1.class.js.map