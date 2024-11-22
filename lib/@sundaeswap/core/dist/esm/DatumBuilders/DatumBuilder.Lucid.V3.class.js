import { sqrt } from "@sundaeswap/bigint-math";
import { C, Constr, Data } from "lucid-cardano";
import { EDatumType, } from "../@types/index.js";
import { LucidHelper } from "../Utilities/LucidHelper.class.js";
import { SundaeUtils } from "../Utilities/SundaeUtils.class.js";
import { V3_POOL_IDENT_LENGTH } from "../constants.js";
import * as V3Types from "./contracts/contracts.v3.js";
/**
 * The Lucid implementation of a {@link Core.DatumBuilder}. This is useful
 * if you would rather just build valid CBOR strings for just the datum
 * portion of a valid SundaeSwap transaction.
 */
export class DatumBuilderLucidV3 {
    /** The current network id. */
    network;
    /** The error to throw when the pool ident does not match V1 constraints. */
    static INVALID_POOL_IDENT = "You supplied a pool ident of an invalid length! The will prevent the scooper from processing this order.";
    V3_POOL_PARAMS = {};
    constructor(network) {
        this.network = network;
    }
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
    buildSwapDatum({ destinationAddress, ident, order, ownerAddress, scooperFee, }) {
        const datum = {
            poolIdent: this.buildPoolIdent(ident),
            destination: this.buildDestinationAddresses(destinationAddress).schema,
            owner: this.buildOwnerDatum(ownerAddress ?? destinationAddress.address)
                .schema,
            scooperFee: scooperFee,
            order: {
                Swap: {
                    offer: this.buildAssetAmountDatum(order.offered).schema,
                    minReceived: this.buildAssetAmountDatum(order.minReceived).schema,
                },
            },
            extension: Data.void(),
        };
        const inline = Data.to(datum, V3Types.OrderDatum);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
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
    buildDepositDatum({ destinationAddress, ident, order, ownerAddress, scooperFee, }) {
        const datum = {
            destination: this.buildDestinationAddresses(destinationAddress).schema,
            order: {
                Deposit: {
                    assets: [
                        this.buildAssetAmountDatum(order.assetA).schema,
                        this.buildAssetAmountDatum(order.assetB).schema,
                    ],
                },
            },
            owner: this.buildOwnerDatum(ownerAddress ?? destinationAddress.address)
                .schema,
            poolIdent: this.buildPoolIdent(ident),
            scooperFee,
            extension: Data.void(),
        };
        const inline = Data.to(datum, V3Types.OrderDatum);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
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
    buildWithdrawDatum({ destinationAddress, ident, order, ownerAddress, scooperFee, }) {
        const datum = {
            destination: this.buildDestinationAddresses(destinationAddress).schema,
            extension: Data.void(),
            order: {
                Withdrawal: {
                    amount: this.buildAssetAmountDatum(order.lpToken).schema,
                },
            },
            owner: this.buildOwnerDatum(ownerAddress ?? destinationAddress.address)
                .schema,
            poolIdent: this.buildPoolIdent(ident),
            scooperFee: scooperFee,
        };
        const inline = Data.to(datum, V3Types.OrderDatum);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
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
    buildMintPoolDatum({ assetA, assetB, fees, marketOpen, depositFee, seedUtxo, }) {
        const ident = DatumBuilderLucidV3.computePoolId(seedUtxo);
        const liquidity = sqrt(assetA.amount * assetB.amount);
        const assetsPair = this.buildLexicographicalAssetsDatum(assetA, assetB).schema;
        const newPoolDatum = {
            assets: assetsPair,
            circulatingLp: liquidity,
            bidFeePer10Thousand: fees.bid,
            askFeePer10Thousand: fees.ask,
            feeManager: null,
            identifier: ident,
            marketOpen: marketOpen || 0n,
            protocolFee: depositFee,
        };
        const inline = Data.to(newPoolDatum, V3Types.PoolDatum);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: newPoolDatum,
        };
    }
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
    buildPoolMintRedeemerDatum({ assetA, assetB, metadataOutput, poolOutput, }) {
        const poolMintRedeemer = {
            CreatePool: {
                assets: this.buildLexicographicalAssetsDatum(assetA, assetB).schema,
                poolOutput,
                metadataOutput,
            },
        };
        const inline = Data.to(poolMintRedeemer, V3Types.PoolMintRedeemer);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: poolMintRedeemer,
        };
    }
    buildWithdrawAsset(fundedLPAsset) {
        const datum = new Constr(1, [fundedLPAsset.amount]);
        const inline = Data.to(datum);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: datum,
        };
    }
    buildDestinationAddresses({ address, datum, }) {
        LucidHelper.validateAddressAndDatumAreValid({
            address: address,
            datum: datum,
            network: this.network,
        });
        const destination = LucidHelper.getAddressHashes(address);
        let formattedDatum;
        switch (datum.type) {
            case EDatumType.NONE:
                formattedDatum = new Constr(0, []);
                break;
            case EDatumType.HASH:
                formattedDatum = new Constr(1, [datum.value]);
                break;
            case EDatumType.INLINE:
                formattedDatum = new Constr(2, [Data.from(datum.value)]);
                break;
            default:
                throw new Error("Could not find a matching datum type for the destination address. Aborting.");
        }
        const destinationDatum = {
            address: {
                paymentCredential: LucidHelper.isScriptAddress(address)
                    ? {
                        SCredential: {
                            bytes: destination.paymentCredentials,
                        },
                    }
                    : {
                        VKeyCredential: {
                            bytes: destination.paymentCredentials,
                        },
                    },
                stakeCredential: destination?.stakeCredentials
                    ? {
                        keyHash: {
                            VKeyCredential: {
                                bytes: destination.stakeCredentials,
                            },
                        },
                    }
                    : null,
            },
            datum: formattedDatum,
        };
        const inline = Data.to(destinationDatum, V3Types.Destination);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: destinationDatum,
        };
    }
    buildOwnerDatum(main) {
        LucidHelper.validateAddressNetwork(main, this.network);
        const { stakeCredentials, paymentCredentials } = LucidHelper.getAddressHashes(main);
        const ownerDatum = {
            Address: { hex: stakeCredentials || paymentCredentials },
        };
        const inline = Data.to(ownerDatum, V3Types.MultiSigScript);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: ownerDatum,
        };
    }
    buildAssetAmountDatum(asset) {
        const isAdaLovelace = SundaeUtils.isAdaAsset(asset.metadata);
        const value = [
            isAdaLovelace ? "" : asset.metadata.assetId.split(".")[0],
            isAdaLovelace ? "" : asset.metadata.assetId.split(".")[1],
            asset.amount,
        ];
        const inline = Data.to(value, V3Types.SingletonValue);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: value,
        };
    }
    buildLexicographicalAssetsDatum(assetA, assetB) {
        const lexicographicalAssets = SundaeUtils.sortSwapAssetsWithAmounts([
            assetA,
            assetB,
        ]);
        const assets = lexicographicalAssets.reduce((result, { metadata }) => {
            if (SundaeUtils.isAdaAsset(metadata)) {
                result.push(["", ""]);
                return result;
            }
            const [policyId, assetName] = metadata.assetId.split(".");
            if (!policyId || !assetName) {
                throw new Error(`Invalid asset format for minting a pool with ${metadata.assetId}. Expected both a policyID and assetName.`);
            }
            result.push([policyId, assetName]);
            return result;
        }, []);
        const inline = Data.to(assets, V3Types.AssetClassPair);
        return {
            hash: LucidHelper.inlineDatumToHash(inline),
            inline,
            schema: assets,
        };
    }
    buildPoolIdent(ident) {
        if (ident.length !== V3_POOL_IDENT_LENGTH) {
            throw new Error(DatumBuilderLucidV3.INVALID_POOL_IDENT);
        }
        return ident;
    }
    /**
     * Computes the pool NFT name.
     *
     * @param {string} poolId The hex encoded pool ident.
     * @returns {string}
     */
    static computePoolNftName(poolId) {
        const prefix = new Uint8Array([0x00, 0x0d, 0xe1, 0x40]);
        const name = new Uint8Array([...prefix, ...Buffer.from(poolId, "hex")]);
        return Buffer.from(name).toString("hex");
    }
    /**
     * Computes the pool liquidity name.
     *
     * @param {string} poolId The hex encoded pool ident.
     * @returns {string}
     */
    static computePoolLqName(poolId) {
        const prefix = new Uint8Array([0x00, 0x14, 0xdf, 0x10]);
        const name = new Uint8Array([...prefix, ...Buffer.from(poolId, "hex")]);
        return Buffer.from(name).toString("hex");
    }
    /**
     * Computes the pool reference name.
     *
     * @param {string} poolId The hex encoded pool ident.
     * @returns {string}
     */
    static computePoolRefName(poolId) {
        const prefix = new Uint8Array([0x00, 0x06, 0x43, 0xb0]);
        const name = new Uint8Array([...prefix, ...Buffer.from(poolId, "hex")]);
        return Buffer.from(name).toString("hex");
    }
    /**
     * Computes the pool ID based on the provided UTxO being spent.
     *
     * @param {UTxO} seed The UTxO txHash and index.
     * @returns {string}
     */
    static computePoolId(seed) {
        const poolInputTxHash = Buffer.from(seed.txHash, "hex");
        const numberSign = new Uint8Array([0x23]);
        const poolInputTxIx = new Uint8Array([seed.outputIndex]);
        const poolInputRef = new Uint8Array([
            ...poolInputTxHash,
            ...numberSign,
            ...poolInputTxIx,
        ]);
        const hash = Buffer.from(C.hash_blake2b256(poolInputRef)
            // Truncate first four bytes and convert to hex string.
            .slice(4)).toString("hex");
        return hash;
    }
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
    static getDestinationAddressesFromDatum(datum) {
        const { destination: { address }, } = Data.from(datum, V3Types.OrderDatum);
        let stakingKeyHash;
        let paymentKeyHash;
        if (address.stakeCredential && address.stakeCredential.keyHash) {
            const hash = address.stakeCredential.keyHash
                .VKeyCredential.bytes;
            if (hash) {
                stakingKeyHash = hash;
            }
        }
        if (address.paymentCredential) {
            const hash = address.paymentCredential
                .VKeyCredential.bytes;
            if (hash) {
                paymentKeyHash = hash;
            }
        }
        return {
            stakingKeyHash,
            paymentKeyHash,
        };
    }
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
    static getSignerKeyFromDatum(datum) {
        const { owner } = Data.from(datum, V3Types.OrderDatum);
        if (typeof owner?.Address === "object" &&
            typeof owner.Address.hex === "string") {
            return owner.Address.hex;
        }
        if (typeof owner?.Script === "object" &&
            typeof owner.Script.hex === "string") {
            return owner.Script.hex;
        }
        return undefined;
    }
    static addressSchemaToBech32(datum, lucid) {
        let paymentKeyHash;
        let paymentAddressType;
        if (datum.paymentCredential?.VKeyCredential) {
            paymentAddressType = "Key";
            paymentKeyHash = datum.paymentCredential
                .VKeyCredential.bytes;
        }
        else if (datum.paymentCredential?.SCredential) {
            paymentAddressType = "Script";
            paymentKeyHash = datum.paymentCredential
                .SCredential.bytes;
        }
        else {
            throw new Error("Could not determine the address type from supplied payment credential.");
        }
        const result = {
            paymentCredential: {
                hash: paymentKeyHash,
                type: paymentAddressType,
            },
        };
        if (datum.stakeCredential?.keyHash) {
            let stakingKeyHash;
            let stakingAddressType;
            if (datum.stakeCredential.keyHash
                ?.VKeyCredential) {
                stakingAddressType = "Key";
                stakingKeyHash = datum.stakeCredential.keyHash.VKeyCredential.bytes;
            }
            else if (datum.stakeCredential.keyHash?.SCredential) {
                stakingAddressType = "Script";
                stakingKeyHash = datum.stakeCredential.keyHash
                    .SCredential.bytes;
            }
            if (stakingKeyHash && stakingAddressType) {
                result.stakeCredential = {
                    hash: stakingKeyHash,
                    type: stakingAddressType,
                };
            }
        }
        return lucid.utils.credentialToAddress(result.paymentCredential, result.stakeCredential);
    }
}
//# sourceMappingURL=DatumBuilder.Lucid.V3.class.js.map