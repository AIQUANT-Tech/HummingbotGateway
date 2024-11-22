"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const asset_1 = require("@sundaeswap/asset");
const jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
const lucid_cardano_1 = require("lucid-cardano");
const index_js_1 = require("../../@types/index.js");
const DatumBuilder_Lucid_V3_class_js_1 = require("../../DatumBuilders/DatumBuilder.Lucid.V3.class.js");
const contracts_v3_js_1 = require("../../DatumBuilders/contracts/contracts.v3.js");
const QueryProviderSundaeSwap_js_1 = require("../../QueryProviders/QueryProviderSundaeSwap.js");
const constants_js_1 = require("../../constants.js");
const testing_js_1 = require("../../exports/testing.js");
const TxBuilder_Lucid_V1_class_js_1 = require("../TxBuilder.Lucid.V1.class.js");
const TxBuilder_Lucid_V3_class_js_1 = require("../TxBuilder.Lucid.V3.class.js");
const mockData_js_1 = require("./data/mockData.js");
globals_1.jest
    .spyOn(QueryProviderSundaeSwap_js_1.QueryProviderSundaeSwap.prototype, "getProtocolParamsWithScriptHashes")
    .mockResolvedValue(mockData_js_1.params);
globals_1.jest
    .spyOn(QueryProviderSundaeSwap_js_1.QueryProviderSundaeSwap.prototype, "getProtocolParamsWithScripts")
    .mockResolvedValue(mockData_js_1.params);
globals_1.jest
    .spyOn(TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3.prototype, "getAllSettingsUtxos")
    .mockResolvedValue(mockData_js_1.settingsUtxos);
globals_1.jest
    .spyOn(TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3.prototype, "getAllReferenceUtxos")
    .mockResolvedValue(mockData_js_1.referenceUtxos);
let builder;
let datumBuilder;
const TEST_REFERRAL_DEST = testing_js_1.PREVIEW_DATA.addresses.alternatives[0];
/**
 * Utility method to get the payment address. V3 contracts append the DestinationAddress
 * staking key to the order contract, so the user can still earn rewards.
 * @param output
 * @returns
 */
const getPaymentAddressFromOutput = (output) => {
    const scriptCredential = output.address().as_base()?.payment_cred();
    const paymentAddress = lucid_cardano_1.C.EnterpriseAddress.new(0, scriptCredential)
        .to_address()
        .to_bech32("addr_test");
    return paymentAddress;
};
const { getUtxosByOutRefMock } = (0, testing_js_1.setupLucid)((lucid) => {
    datumBuilder = new DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3("preview");
    builder = new TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3(lucid, datumBuilder);
});
afterAll(() => {
    globals_1.jest.restoreAllMocks();
});
describe("TxBuilderLucidV3", () => {
    it("should have the correct settings", () => {
        expect(builder.network).toEqual("preview");
        expect(builder.lucid).toBeInstanceOf(lucid_cardano_1.Lucid);
    });
    it("should get the correct maxScooperFee", async () => {
        const result = await builder.getMaxScooperFeeAmount();
        expect(result.toString()).toEqual("500000");
        const oldSettingsDatum = lucid_cardano_1.Data.from(mockData_js_1.settingsUtxos[0].datum, contracts_v3_js_1.SettingsDatum);
        const newSettingsDatum = {
            ...oldSettingsDatum,
            simpleFee: 0n,
        };
        globals_1.jest
            .spyOn(TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3.prototype, "getAllSettingsUtxos")
            .mockResolvedValue([
            {
                ...mockData_js_1.settingsUtxos[0],
                datum: lucid_cardano_1.Data.to(newSettingsDatum, contracts_v3_js_1.SettingsDatum),
            },
            ...mockData_js_1.settingsUtxos.slice(1),
        ]);
        const result2 = await builder.getMaxScooperFeeAmount();
        expect(result2.toString()).toEqual("332000");
        // Reset scooper fee
        globals_1.jest
            .spyOn(TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3.prototype, "getAllSettingsUtxos")
            .mockResolvedValue(mockData_js_1.settingsUtxos);
    });
    it("should create a new transaction instance correctly", async () => {
        expect(builder.newTxInstance()).toBeInstanceOf(lucid_cardano_1.Tx);
        const txWithReferralAndLabel = builder.newTxInstance({
            destination: TEST_REFERRAL_DEST,
            payment: new asset_1.AssetAmount(1500000n, constants_js_1.ADA_METADATA),
            feeLabel: "Test Label",
        });
        const { txComplete } = await txWithReferralAndLabel.complete();
        const metadata = txComplete.auxiliary_data()?.metadata();
        expect(metadata).not.toBeUndefined();
        expect(metadata?.get(lucid_cardano_1.C.BigNum.from_str("674"))?.as_text()).toEqual("Test Label: 1.5 ADA");
        let referralAddressOutput;
        [...Array(txComplete.body().outputs().len()).keys()].forEach((index) => {
            const output = txComplete.body().outputs().get(index);
            if (output.address().to_bech32("addr_test") === TEST_REFERRAL_DEST &&
                output.amount().coin().to_str() === "1500000") {
                referralAddressOutput = output;
            }
        });
        expect(referralAddressOutput).not.toBeUndefined();
        expect(referralAddressOutput?.address().to_bech32("addr_test")).toEqual(TEST_REFERRAL_DEST);
        const txWithReferral = builder.newTxInstance({
            destination: TEST_REFERRAL_DEST,
            payment: new asset_1.AssetAmount(1300000n, constants_js_1.ADA_METADATA),
        });
        const { txComplete: txComplete2 } = await txWithReferral.complete();
        expect(txComplete2.auxiliary_data()?.metadata()).toBeUndefined();
        let referralAddressOutput2;
        [...Array(txComplete2.body().outputs().len()).keys()].forEach((index) => {
            const output = txComplete2.body().outputs().get(index);
            if (output.address().to_bech32("addr_test") === TEST_REFERRAL_DEST &&
                output.amount().coin().to_str() === "1300000") {
                referralAddressOutput2 = output;
            }
        });
        expect(referralAddressOutput2).not.toBeUndefined();
        expect(referralAddressOutput2?.address().to_bech32("addr_test")).toEqual(TEST_REFERRAL_DEST);
        const txWithoutReferral = builder.newTxInstance();
        const { txComplete: txComplete3 } = await txWithoutReferral.complete();
        expect(txComplete3.auxiliary_data()?.metadata()).toBeUndefined();
        let referralAddressOutput3;
        [...Array(txComplete3.body().outputs().len()).keys()].forEach((index) => {
            const output = txComplete3.body().outputs().get(index);
            if (output.address().to_bech32("addr_test") === TEST_REFERRAL_DEST) {
                referralAddressOutput3 = output;
            }
        });
        expect(referralAddressOutput3).toBeUndefined();
    });
    it("should allow you to cancel an order", async () => {
        getUtxosByOutRefMock.mockResolvedValue([
            ...mockData_js_1.mockOrderToCancel,
            ...mockData_js_1.referenceUtxos,
        ]);
        const spiedGetSignerKeyFromDatum = globals_1.jest.spyOn(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3, "getSignerKeyFromDatum");
        const { build, datum, fees } = await builder.cancel({
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            utxo: {
                hash: "b18feb718648b33ef4900519b76f72f46723577ebad46191e2f8e1076c2b632c",
                index: 0,
            },
        });
        expect(spiedGetSignerKeyFromDatum).toHaveBeenCalledTimes(1);
        expect(spiedGetSignerKeyFromDatum).toHaveReturnedWith("121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0");
        expect(fees.deposit.amount).toEqual(0n);
        expect(fees.scooperFee.amount).toEqual(0n);
        expect(fees.referral).toBeUndefined();
        expect(fees.cardanoTxFee).toBeUndefined();
        const { cbor } = await build();
        expect(cbor).toEqual("84a90089825820b18feb718648b33ef4900519b76f72f46723577ebad46191e2f8e1076c2b632c00825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f24394700825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f24394701825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f24394702825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f243947038258209756599b732c2507d9170ccb919c31e38fd392f4c53cfc11004a9254f2c2b828008258209756599b732c2507d9170ccb919c31e38fd392f4c53cfc11004a9254f2c2b828018258209756599b732c2507d9170ccb919c31e38fd392f4c53cfc11004a9254f2c2b82802825820fda5c685eaff5fbb2a7ecb250389fd24a7216128929a9da0ad95b72b586fab7001018282583900c279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775a121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0821a0012050ca1581c99b071ce8580d6a3a11b4902145adb8bfd0d2a03935af8cf66403e15a1465242455252591b000221b262dd800082583900c279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775a121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d01b000000ec96799e71021a000377790b5820410d50a9bae4e34ef5d946757ab33869427e57096fa4839d8fb562d302370c2d0d81825820fda5c685eaff5fbb2a7ecb250389fd24a7216128929a9da0ad95b72b586fab70010e81581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d01082583900c279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775a121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d01b00000003beb1bdfb111a000533361288825820b18feb718648b33ef4900519b76f72f46723577ebad46191e2f8e1076c2b632c00825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f24394700825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f24394701825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f24394702825820710112522d4e0b35640ca00213745982991b4a69b6f0a5de5a7af6547f243947038258209756599b732c2507d9170ccb919c31e38fd392f4c53cfc11004a9254f2c2b828008258209756599b732c2507d9170ccb919c31e38fd392f4c53cfc11004a9254f2c2b828018258209756599b732c2507d9170ccb919c31e38fd392f4c53cfc11004a9254f2c2b82802a10581840007d87a80821a0001bb671a025f4882f5f6");
        expect(fees.cardanoTxFee?.amount).toEqual(227193n);
    });
    test("cancel() v1 order", async () => {
        const spiedOnV1Cancel = globals_1.jest.spyOn(TxBuilder_Lucid_V1_class_js_1.TxBuilderLucidV1.prototype, "cancel");
        getUtxosByOutRefMock.mockResolvedValue([
            testing_js_1.PREVIEW_DATA.wallet.submittedOrderUtxos.swapV1,
        ]);
        // Don't care to mock v3 so it will throw.
        try {
            await builder.cancel({
                ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
                utxo: {
                    hash: testing_js_1.PREVIEW_DATA.wallet.submittedOrderUtxos.swapV1.txHash,
                    index: testing_js_1.PREVIEW_DATA.wallet.submittedOrderUtxos.swapV1.outputIndex,
                },
            });
        }
        catch (e) {
            expect(spiedOnV1Cancel).toHaveBeenCalledTimes(1);
        }
    });
    test("swap()", async () => {
        const spiedNewTx = globals_1.jest.spyOn(builder, "newTxInstance");
        const spiedBuildSwapDatum = globals_1.jest.spyOn(datumBuilder, "buildSwapDatum");
        // Ensure that our tests are running at a consistent date due to decaying fees.
        const spiedDate = globals_1.jest.spyOn(Date, "now");
        spiedDate.mockImplementation(() => new Date("2023-12-10").getTime());
        const { build, fees, datum } = await builder.swap({
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            swapType: {
                type: index_js_1.ESwapType.MARKET,
                slippage: 0.03,
            },
            pool: testing_js_1.PREVIEW_DATA.pools.v3,
            suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tada,
        });
        expect(spiedNewTx).toHaveBeenNthCalledWith(1, undefined);
        expect(spiedBuildSwapDatum).toHaveBeenNthCalledWith(1, expect.objectContaining({
            ident: testing_js_1.PREVIEW_DATA.pools.v3.ident,
            order: expect.objectContaining({
                offered: expect.objectContaining({
                    amount: testing_js_1.PREVIEW_DATA.assets.tada.amount,
                }),
            }),
        }));
        expect(datum).toEqual("d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a0007a120d8799fd8799fd8799f581cc279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87980ffd87a9f9f40401a01312d00ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e44591a010cd3b9ffff43d87980ff");
        expect(fees).toMatchObject({
            deposit: expect.objectContaining({
                amount: constants_js_1.ORDER_DEPOSIT_DEFAULT,
                metadata: constants_js_1.ADA_METADATA,
            }),
            scooperFee: expect.objectContaining({
                amount: 500000n,
                metadata: constants_js_1.ADA_METADATA,
            }),
        });
        const { builtTx } = await build();
        expect(fees.cardanoTxFee).not.toBeUndefined();
        let depositOutput;
        [...Array(builtTx.txComplete.body().outputs().len()).keys()].forEach((index) => {
            const output = builtTx.txComplete.body().outputs().get(index);
            if (getPaymentAddressFromOutput(output) ===
                "addr_test1wpyyj6wexm6gf3zlzs7ez8upvdh7jfgy3cs9qj8wrljp92su9hpfe" &&
                // Supplied asset (20) + deposit (2) + scooper fee (.5) = 22.5
                output.amount().coin().to_str() === "22500000") {
                depositOutput = output;
            }
        });
        expect(depositOutput).not.toBeUndefined();
        expect(depositOutput?.datum()?.as_data_hash()?.to_hex()).toBeUndefined();
        expect(builtTx.txComplete.witness_set().plutus_data()?.get(0).to_bytes()).toBeUndefined();
        const inlineDatum = depositOutput?.datum()?.as_data()?.get().to_bytes();
        expect(inlineDatum).not.toBeUndefined();
        expect(Buffer.from(inlineDatum).toString("hex")).toEqual(datum);
    });
    test("swap() with incorrect idents should throw", async () => {
        try {
            await builder.swap({
                orderAddresses: {
                    DestinationAddress: {
                        address: testing_js_1.PREVIEW_DATA.addresses.current,
                        datum: {
                            type: index_js_1.EDatumType.NONE,
                        },
                    },
                },
                swapType: {
                    type: index_js_1.ESwapType.MARKET,
                    slippage: 0.03,
                },
                pool: {
                    ...testing_js_1.PREVIEW_DATA.pools.v3,
                    ident: "00",
                },
                suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tada,
            });
        }
        catch (e) {
            expect(e.message).toEqual(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3.INVALID_POOL_IDENT);
        }
    });
    test("orderRouteSwap() - v3 to v3", async () => {
        const { build, fees, datum } = await builder.orderRouteSwap({
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            swapA: {
                swapType: {
                    type: index_js_1.ESwapType.MARKET,
                    slippage: 0.03,
                },
                pool: testing_js_1.PREVIEW_DATA.pools.v3,
                suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tindy,
            },
            swapB: {
                swapType: {
                    type: index_js_1.ESwapType.MARKET,
                    slippage: 0.03,
                },
                pool: {
                    ...testing_js_1.PREVIEW_DATA.pools.v3,
                    assetB: {
                        ...testing_js_1.PREVIEW_DATA.pools.v3.assetB,
                        assetId: 
                        // iBTC
                        "2fe3c3364b443194b10954771c95819b8d6ed464033c21f03f8facb5.69425443",
                    },
                    assetLP: {
                        ...testing_js_1.PREVIEW_DATA.pools.v3.assetLP,
                        assetId: "4086577ed57c514f8e29b78f42ef4f379363355a3b65b9a032ee30c9.6c702004",
                    },
                },
            },
        });
        // Deposit carried over = 3 ADA
        expect(fees.deposit.amount.toString()).toEqual("3000000");
        // Two swaps = .5 + .5
        expect(fees.scooperFee.amount.toString()).toEqual("1000000");
        const { builtTx } = await build();
        let swapOutput;
        [...Array(builtTx.txComplete.body().outputs().len()).keys()].forEach((index) => {
            const output = builtTx.txComplete.body().outputs().get(index);
            const outputHex = Buffer.from(output.address().as_base()?.to_address().to_bytes()).toString("hex");
            if (outputHex ===
                "10484969d936f484c45f143d911f81636fe925048e205048ee1fe412aa121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0" &&
                output.amount().multiasset()?.to_js_value()[testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[1]] ===
                    "20000000" &&
                // deposit (3) + v3 scooper fee (.5) + v3 scooper fee (.5)
                output.amount().coin().to_str() === "4000000") {
                swapOutput = output;
            }
        });
        expect(swapOutput).not.toBeUndefined();
        expect(swapOutput).not.toBeUndefined();
        const inlineDatum = swapOutput?.datum()?.as_data()?.get().to_bytes();
        expect(inlineDatum).not.toBeUndefined();
        expect(Buffer.from(inlineDatum).toString("hex")).toEqual("d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a0007a120d8799fd8799fd87a9f581c484969d936f484c45f143d911f81636fe925048e205048ee1fe412aaffd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87b9fd8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a0007a120d8799fd8799fd8799f581cc279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87980ffd87a9f9f40401a011b5ec7ff9f581c2fe3c3364b443194b10954771c95819b8d6ed464033c21f03f8facb544694254431a00f9f216ffff43d87980ffffffd87a9f9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e44591a01312d00ff9f40401a011b5ec7ffff43d87980ff");
    });
    test("orderRouteSwap() - v3 to v1", async () => {
        const { build, fees, datum } = await builder.orderRouteSwap({
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            swapA: {
                swapType: {
                    type: index_js_1.ESwapType.MARKET,
                    slippage: 0.03,
                },
                suppliedAsset: testing_js_1.PREVIEW_DATA.assets.tindy,
                pool: testing_js_1.PREVIEW_DATA.pools.v3,
            },
            swapB: {
                swapType: {
                    type: index_js_1.ESwapType.MARKET,
                    slippage: 0.03,
                },
                pool: {
                    ...testing_js_1.PREVIEW_DATA.pools.v1,
                    ident: "04",
                    assetB: {
                        ...testing_js_1.PREVIEW_DATA.pools.v3.assetB,
                        assetId: 
                        // iBTC
                        "2fe3c3364b443194b10954771c95819b8d6ed464033c21f03f8facb5.69425443",
                    },
                    assetLP: {
                        ...testing_js_1.PREVIEW_DATA.pools.v3.assetLP,
                        assetId: "4086577ed57c514f8e29b78f42ef4f379363355a3b65b9a032ee30c9.6c702004",
                    },
                },
            },
        });
        // Deposit carried over = 3 ADA
        expect(fees.deposit.amount.toString()).toEqual("3000000");
        // Two swaps = .5 + 2.5
        expect(fees.scooperFee.amount.toString()).toEqual("3000000");
        const { builtTx } = await build();
        let swapOutput;
        [...Array(builtTx.txComplete.body().outputs().len()).keys()].forEach((index) => {
            const output = builtTx.txComplete.body().outputs().get(index);
            const outputHex = Buffer.from(output.address().as_base()?.to_address().to_bytes()).toString("hex");
            if (outputHex ===
                "10484969d936f484c45f143d911f81636fe925048e205048ee1fe412aa121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0" &&
                output.amount().multiasset()?.to_js_value()[testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[1]] ===
                    "20000000" &&
                // deposit (3) + v3 scooper fee (.5) + v1 scooper fee (2.5) = 5
                output.amount().coin().to_str() === "6000000") {
                swapOutput = output;
            }
        });
        expect(swapOutput).not.toBeUndefined();
        expect(swapOutput).not.toBeUndefined();
        const inlineDatum = swapOutput?.datum()?.as_data()?.get().to_bytes();
        expect(inlineDatum).not.toBeUndefined();
        expect(Buffer.from(inlineDatum).toString("hex")).toEqual("d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a0007a120d8799fd8799fd87a9f581c730e7d146ad7427a23a885d2141b245d3f8ccd416b5322a31719977effd87a80ffd87a9f58208d35dd309d5025e51844f3c8b6d6f4e93ec55bf4a85b5c3610860500efc1e9fbffffd87a9f9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e44591a01312d00ff9f40401a011b5ec7ffff43d87980ff");
        const transactionMetadata = builtTx.txComplete
            .auxiliary_data()
            ?.metadata()
            ?.get(lucid_cardano_1.C.BigNum.from_str("103251"))
            ?.as_map();
        expect(transactionMetadata).not.toBeUndefined();
        expect(Buffer.from(transactionMetadata?.to_bytes()).toString("hex")).toEqual("a158208d35dd309d5025e51844f3c8b6d6f4e93ec55bf4a85b5c3610860500efc1e9fb85581fd8799f4104d8799fd8799fd8799fd8799f581cc279a3fb3b4e62bbc78e2887581f83b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd2581f2e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87a581f80ffd87a80ff1a002625a0d8799fd879801a011b5ec7d8799f1a00833c12ff42ffff");
    });
    test("deposit()", async () => {
        const spiedNewTx = globals_1.jest.spyOn(builder, "newTxInstance");
        const spiedBuildDepositDatum = globals_1.jest.spyOn(datumBuilder, "buildDepositDatum");
        const { build, fees, datum } = await builder.deposit({
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            pool: testing_js_1.PREVIEW_DATA.pools.v3,
            suppliedAssets: [testing_js_1.PREVIEW_DATA.assets.tada, testing_js_1.PREVIEW_DATA.assets.tindy],
        });
        expect(spiedNewTx).toHaveBeenNthCalledWith(1, undefined);
        expect(spiedBuildDepositDatum).toHaveBeenNthCalledWith(1, expect.objectContaining({
            ident: testing_js_1.PREVIEW_DATA.pools.v3.ident,
            order: expect.objectContaining({
                assetA: expect.objectContaining({
                    amount: testing_js_1.PREVIEW_DATA.assets.tada.amount,
                }),
                assetB: expect.objectContaining({
                    amount: testing_js_1.PREVIEW_DATA.assets.tindy.amount,
                }),
            }),
        }));
        expect(datum).toEqual("d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a0007a120d8799fd8799fd8799f581cc279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87980ffd87b9f9f9f40401a01312d00ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e44591a01312d00ffffff43d87980ff");
        expect(fees).toMatchObject({
            deposit: expect.objectContaining({
                amount: constants_js_1.ORDER_DEPOSIT_DEFAULT,
                metadata: constants_js_1.ADA_METADATA,
            }),
            scooperFee: expect.objectContaining({
                amount: 500000n,
                metadata: constants_js_1.ADA_METADATA,
            }),
        });
        const { builtTx } = await build();
        expect(fees.cardanoTxFee).not.toBeUndefined();
        let depositOutput;
        [...Array(builtTx.txComplete.body().outputs().len()).keys()].forEach((index) => {
            const output = builtTx.txComplete.body().outputs().get(index);
            if (getPaymentAddressFromOutput(output) ===
                "addr_test1wpyyj6wexm6gf3zlzs7ez8upvdh7jfgy3cs9qj8wrljp92su9hpfe" &&
                // Supplied asset (20) + deposit (2) + scooper fee (.5) = 22.5
                output.amount().coin().to_str() === "22500000" &&
                output.amount().multiasset() &&
                output.amount().multiasset()?.to_js_value()["fa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a351535183"]["74494e4459"] === "20000000") {
                depositOutput = output;
            }
        });
        expect(depositOutput).not.toBeUndefined();
        expect(depositOutput?.datum()?.as_data_hash()?.to_hex()).toBeUndefined();
        expect(builtTx.txComplete.witness_set().plutus_data()?.get(0).to_bytes()).toBeUndefined();
        const inlineDatum = depositOutput?.datum()?.as_data()?.get().to_bytes();
        expect(inlineDatum).not.toBeUndefined();
        expect(Buffer.from(inlineDatum).toString("hex")).toEqual(datum);
    });
    test("deposit() incorrect idents throw", async () => {
        try {
            await builder.deposit({
                orderAddresses: {
                    DestinationAddress: {
                        address: testing_js_1.PREVIEW_DATA.addresses.current,
                        datum: {
                            type: index_js_1.EDatumType.NONE,
                        },
                    },
                },
                pool: {
                    ...testing_js_1.PREVIEW_DATA.pools.v3,
                    ident: "00",
                },
                suppliedAssets: [testing_js_1.PREVIEW_DATA.assets.tada, testing_js_1.PREVIEW_DATA.assets.tindy],
            });
        }
        catch (e) {
            expect(e.message).toEqual(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3.INVALID_POOL_IDENT);
        }
    });
    test("withdraw()", async () => {
        const spiedNewTx = globals_1.jest.spyOn(builder, "newTxInstance");
        const spiedBuildWithdrawDatum = globals_1.jest.spyOn(datumBuilder, "buildWithdrawDatum");
        const { build, fees, datum } = await builder.withdraw({
            orderAddresses: {
                DestinationAddress: {
                    address: testing_js_1.PREVIEW_DATA.addresses.current,
                    datum: {
                        type: index_js_1.EDatumType.NONE,
                    },
                },
            },
            pool: testing_js_1.PREVIEW_DATA.pools.v3,
            suppliedLPAsset: testing_js_1.PREVIEW_DATA.assets.v3LpToken,
        });
        expect(spiedNewTx).toHaveBeenNthCalledWith(1, undefined);
        expect(spiedBuildWithdrawDatum).toHaveBeenNthCalledWith(1, expect.objectContaining({
            ident: testing_js_1.PREVIEW_DATA.pools.v3.ident,
            order: expect.objectContaining({
                lpToken: expect.objectContaining({
                    amount: 100000000n,
                }),
            }),
        }));
        expect(datum).toEqual("d8799fd8799f581c8bf66e915c450ad94866abb02802821b599e32f43536a42470b21ea2ffd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ff1a0007a120d8799fd8799fd8799f581cc279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775affd8799fd8799fd8799f581c121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0ffffffffd87980ffd87c9f9f581c633a136877ed6ad0ab33e69a22611319673474c8bd0a79a4c76d928958200014df10a933477ea168013e2b5af4a9e029e36d26738eb6dfe382e1f3eab3e21a05f5e100ffff43d87980ff");
        expect(fees).toMatchObject({
            deposit: expect.objectContaining({
                amount: constants_js_1.ORDER_DEPOSIT_DEFAULT,
                metadata: constants_js_1.ADA_METADATA,
            }),
            scooperFee: expect.objectContaining({
                amount: 500000n,
                metadata: constants_js_1.ADA_METADATA,
            }),
        });
        const { builtTx } = await build();
        expect(fees.cardanoTxFee).not.toBeUndefined();
        let withdrawOutput;
        [...Array(builtTx.txComplete.body().outputs().len()).keys()].forEach((index) => {
            const output = builtTx.txComplete.body().outputs().get(index);
            if (getPaymentAddressFromOutput(output) ===
                "addr_test1wpyyj6wexm6gf3zlzs7ez8upvdh7jfgy3cs9qj8wrljp92su9hpfe" &&
                // deposit (2) + scooper fee (.5) = 2.5
                output.amount().coin().to_str() === "2500000" &&
                output.amount().multiasset() &&
                output.amount().multiasset()?.to_js_value()[testing_js_1.PREVIEW_DATA.assets.v3LpToken.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.v3LpToken.metadata.assetId.split(".")[1]] ===
                    testing_js_1.PREVIEW_DATA.assets.v3LpToken.amount.toString()) {
                withdrawOutput = output;
            }
        });
        expect(withdrawOutput).not.toBeUndefined();
        expect(withdrawOutput?.datum()?.as_data_hash()?.to_hex()).toBeUndefined();
        expect(builtTx.txComplete.witness_set().plutus_data()?.get(0).to_bytes()).toBeUndefined();
        const inlineDatum = withdrawOutput?.datum()?.as_data()?.get().to_bytes();
        expect(inlineDatum).not.toBeUndefined();
        expect(Buffer.from(inlineDatum).toString("hex")).toEqual(datum);
    });
    test("withdraw() incorrect idents throw", async () => {
        try {
            await builder.withdraw({
                orderAddresses: {
                    DestinationAddress: {
                        address: testing_js_1.PREVIEW_DATA.addresses.current,
                        datum: {
                            type: index_js_1.EDatumType.NONE,
                        },
                    },
                },
                pool: {
                    ...testing_js_1.PREVIEW_DATA.pools.v3,
                    ident: "00",
                },
                suppliedLPAsset: testing_js_1.PREVIEW_DATA.assets.v3LpToken,
            });
        }
        catch (e) {
            expect(e.message).toEqual(DatumBuilder_Lucid_V3_class_js_1.DatumBuilderLucidV3.INVALID_POOL_IDENT);
        }
    });
    test("mintPool() should build a transaction correctly when including ADA", async () => {
        jest_fetch_mock_1.default.enableMocks();
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(mockData_js_1.mockBlockfrostEvaluateResponse));
        const { fees, build } = await builder.mintPool({
            assetA: testing_js_1.PREVIEW_DATA.assets.tada,
            assetB: testing_js_1.PREVIEW_DATA.assets.tindy,
            fees: 5n,
            marketOpen: 5n,
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
        });
        // Since we are depositing ADA, we only need ADA for the metadata and settings utxos.
        expect(fees.deposit.amount.toString()).toEqual((constants_js_1.ORDER_DEPOSIT_DEFAULT * 2n).toString());
        const { builtTx } = await build();
        const poolBalanceDatum = builtTx.txComplete
            .witness_set()
            .redeemers()
            ?.get(0);
        expect(poolBalanceDatum).not.toBeUndefined();
        expect(Buffer.from(poolBalanceDatum?.to_bytes()).toString("hex")).toEqual("840100d87a9f9f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff0001ff821a000b4af51a121ba48c");
        /**
         * The pool output should be the first in the outputs.
         */
        const poolOutput = builtTx.txComplete.body().outputs().get(0);
        expect(Buffer.from(poolOutput.address().to_bytes()).toString("hex")).toEqual("308140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca7467ae52afc8e9f5603c9265e7ce24853863a34f6b12d12a098f8808");
        const poolDepositAssets = poolOutput.amount().multiasset()?.to_js_value();
        const poolDepositedAssetA = poolOutput.amount().coin().to_str();
        const poolDepositedAssetB = poolDepositAssets[testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[1]];
        const poolDepositedNFT = poolDepositAssets["8140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca"]["000de1409e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [poolDepositedAssetA, poolDepositedAssetB, poolDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        // Should deposit assets without additional ADA.
        expect(poolDepositedAssetA).toEqual((testing_js_1.PREVIEW_DATA.assets.tada.amount + constants_js_1.POOL_MIN_ADA).toString());
        expect(poolDepositedAssetB).toEqual("20000000");
        expect(poolDepositedNFT).toEqual("1");
        // Should have datum attached.
        expect(Buffer.from(poolOutput.datum()?.as_data()?.to_bytes()).toString("hex")).toEqual("d818585ed8799f581c9e67cc006063ea055629552650664979d7c92d47e342e5340ef775509f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff1a01312d000505d87a80051a002dc6c0ff");
        /**
         * The metadata output should be the second in the outputs.
         */
        const metadataOutput = builtTx.txComplete.body().outputs().get(1);
        expect(Buffer.from(metadataOutput.address().to_bytes()).toString("hex")).toEqual("60035dee66d57cc271697711d63c8c35ffa0b6c4468a6a98024feac73b");
        const metadataDepositAssets = metadataOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const metadataDepositedAssetA = metadataOutput.amount().coin().to_str();
        const metadataDepositedNFT = metadataDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["000643b09e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [metadataDepositedAssetA, metadataDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        expect(metadataDepositedAssetA).toEqual("2000000");
        expect(metadataDepositedNFT).toEqual("1");
        /**
         * The lp tokens output should be the third in the outputs.
         */
        const lpTokensOutput = builtTx.txComplete.body().outputs().get(2);
        expect(Buffer.from(lpTokensOutput.address().to_bytes()).toString("hex")).toEqual("00c279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775a121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0");
        const lpTokensDepositAssets = lpTokensOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const lpTokensReturnedADA = lpTokensOutput.amount().coin().to_str();
        const lpTokensReturned = lpTokensDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["0014df109e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [lpTokensReturnedADA, lpTokensReturned].forEach((val) => expect(val).not.toBeUndefined());
        expect(lpTokensReturnedADA).toEqual("2000000");
        expect(lpTokensReturned).toEqual("20000000");
        jest_fetch_mock_1.default.disableMocks();
    });
    test("mintPool() should build a transaction correctly when including ADA and donating Treasury", async () => {
        jest_fetch_mock_1.default.enableMocks();
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(mockData_js_1.mockBlockfrostEvaluateResponse));
        const { fees, build } = await builder.mintPool({
            assetA: testing_js_1.PREVIEW_DATA.assets.tada,
            assetB: testing_js_1.PREVIEW_DATA.assets.tindy,
            fees: 5n,
            marketOpen: 5n,
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            donateToTreasury: 100n,
        });
        // Since we are depositing ADA, we only need ADA for the metadata and settings utxos.
        expect(fees.deposit.amount.toString()).toEqual((constants_js_1.ORDER_DEPOSIT_DEFAULT * 2n).toString());
        const { builtTx } = await build();
        const poolBalanceDatum = builtTx.txComplete
            .witness_set()
            .redeemers()
            ?.get(0);
        expect(poolBalanceDatum).not.toBeUndefined();
        expect(Buffer.from(poolBalanceDatum?.to_bytes()).toString("hex")).toEqual("840100d87a9f9f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff0001ff821a000b4af51a121ba48c");
        /**
         * The pool output should be the first in the outputs.
         */
        const poolOutput = builtTx.txComplete.body().outputs().get(0);
        expect(Buffer.from(poolOutput.address().to_bytes()).toString("hex")).toEqual("308140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca7467ae52afc8e9f5603c9265e7ce24853863a34f6b12d12a098f8808");
        const poolDepositAssets = poolOutput.amount().multiasset()?.to_js_value();
        const poolDepositedAssetA = poolOutput.amount().coin().to_str();
        const poolDepositedAssetB = poolDepositAssets[testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[1]];
        const poolDepositedNFT = poolDepositAssets["8140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca"]["000de1409e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [poolDepositedAssetA, poolDepositedAssetB, poolDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        // Should deposit assets without additional ADA.
        expect(poolDepositedAssetA).toEqual((testing_js_1.PREVIEW_DATA.assets.tada.amount + constants_js_1.POOL_MIN_ADA).toString());
        expect(poolDepositedAssetB).toEqual("20000000");
        expect(poolDepositedNFT).toEqual("1");
        // Should have datum attached.
        expect(Buffer.from(poolOutput.datum()?.as_data()?.to_bytes()).toString("hex")).toEqual("d818585ed8799f581c9e67cc006063ea055629552650664979d7c92d47e342e5340ef775509f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff1a01312d000505d87a80051a002dc6c0ff");
        /**
         * The metadata output should be the second in the outputs.
         */
        const metadataOutput = builtTx.txComplete.body().outputs().get(1);
        expect(Buffer.from(metadataOutput.address().to_bytes()).toString("hex")).toEqual("60035dee66d57cc271697711d63c8c35ffa0b6c4468a6a98024feac73b");
        const metadataDepositAssets = metadataOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const metadataDepositedAssetA = metadataOutput.amount().coin().to_str();
        const metadataDepositedNFT = metadataDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["000643b09e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [metadataDepositedAssetA, metadataDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        expect(metadataDepositedAssetA).toEqual("2000000");
        expect(metadataDepositedNFT).toEqual("1");
        /**
         * The lp tokens output should be the third in the outputs.
         */
        const lpTokensOutput = builtTx.txComplete.body().outputs().get(2);
        expect(Buffer.from(lpTokensOutput.address().to_bytes()).toString("hex")).toEqual("60035dee66d57cc271697711d63c8c35ffa0b6c4468a6a98024feac73b");
        expect(Buffer.from(lpTokensOutput.datum()?.as_data_hash()?.to_bytes()).toString("hex")).toEqual(builder.lucid.utils.datumToHash(lucid_cardano_1.Data.void()));
        const lpTokensDepositAssets = lpTokensOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const lpTokensReturnedADA = lpTokensOutput.amount().coin().to_str();
        const lpTokensReturned = lpTokensDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["0014df109e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [lpTokensReturnedADA, lpTokensReturned].forEach((val) => expect(val).not.toBeUndefined());
        expect(lpTokensReturnedADA).toEqual("2000000");
        expect(lpTokensReturned).toEqual("20000000");
        jest_fetch_mock_1.default.disableMocks();
    });
    test("mintPool() should build a transaction correctly when including ADA and donating a percentage to the Treasury", async () => {
        jest_fetch_mock_1.default.enableMocks();
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(mockData_js_1.mockBlockfrostEvaluateResponse));
        const { fees, build } = await builder.mintPool({
            assetA: testing_js_1.PREVIEW_DATA.assets.tada,
            assetB: testing_js_1.PREVIEW_DATA.assets.tindy,
            fees: 5n,
            marketOpen: 5n,
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            donateToTreasury: 43n,
        });
        // Since we are depositing ADA, we only need ADA for the metadata and settings utxos.
        expect(fees.deposit.amount.toString()).toEqual((constants_js_1.ORDER_DEPOSIT_DEFAULT * 2n).toString());
        const { builtTx } = await build();
        const poolBalanceDatum = builtTx.txComplete
            .witness_set()
            .redeemers()
            ?.get(0);
        expect(poolBalanceDatum).not.toBeUndefined();
        expect(Buffer.from(poolBalanceDatum?.to_bytes()).toString("hex")).toEqual("840100d87a9f9f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff0001ff821a000b4af51a121ba48c");
        /**
         * The pool output should be the first in the outputs.
         */
        const poolOutput = builtTx.txComplete.body().outputs().get(0);
        expect(Buffer.from(poolOutput.address().to_bytes()).toString("hex")).toEqual("308140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca7467ae52afc8e9f5603c9265e7ce24853863a34f6b12d12a098f8808");
        const poolDepositAssets = poolOutput.amount().multiasset()?.to_js_value();
        const poolDepositedAssetA = poolOutput.amount().coin().to_str();
        const poolDepositedAssetB = poolDepositAssets[testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[1]];
        const poolDepositedNFT = poolDepositAssets["8140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca"]["000de1409e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [poolDepositedAssetA, poolDepositedAssetB, poolDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        // Should deposit assets without additional ADA.
        expect(poolDepositedAssetA).toEqual((testing_js_1.PREVIEW_DATA.assets.tada.amount + constants_js_1.POOL_MIN_ADA).toString());
        expect(poolDepositedAssetB).toEqual("20000000");
        expect(poolDepositedNFT).toEqual("1");
        // Should have datum attached.
        expect(Buffer.from(poolOutput.datum()?.as_data()?.to_bytes()).toString("hex")).toEqual("d818585ed8799f581c9e67cc006063ea055629552650664979d7c92d47e342e5340ef775509f9f4040ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff1a01312d000505d87a80051a002dc6c0ff");
        /**
         * The metadata output should be the second in the outputs.
         */
        const metadataOutput = builtTx.txComplete.body().outputs().get(1);
        expect(Buffer.from(metadataOutput.address().to_bytes()).toString("hex")).toEqual("60035dee66d57cc271697711d63c8c35ffa0b6c4468a6a98024feac73b");
        const metadataDepositAssets = metadataOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const metadataDepositedAssetA = metadataOutput.amount().coin().to_str();
        const metadataDepositedNFT = metadataDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["000643b09e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [metadataDepositedAssetA, metadataDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        expect(metadataDepositedAssetA).toEqual("2000000");
        expect(metadataDepositedNFT).toEqual("1");
        /**
         * The lp tokens donation output should be the third in the outputs.
         */
        const lpTokensDonation = builtTx.txComplete.body().outputs().get(2);
        expect(Buffer.from(lpTokensDonation.address().to_bytes()).toString("hex")).toEqual("60035dee66d57cc271697711d63c8c35ffa0b6c4468a6a98024feac73b");
        expect(Buffer.from(lpTokensDonation.datum()?.as_data_hash()?.to_bytes()).toString("hex")).toEqual(builder.lucid.utils.datumToHash(lucid_cardano_1.Data.void()));
        const lpTokensDonationAssets = lpTokensDonation
            .amount()
            .multiasset()
            ?.to_js_value();
        const lpTokensDonatedADA = lpTokensDonation.amount().coin().to_str();
        const lpTokensDonated = lpTokensDonationAssets[mockData_js_1.params.blueprint.validators[1].hash]["0014df109e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [lpTokensDonatedADA, lpTokensDonated].forEach((val) => expect(val).not.toBeUndefined());
        expect(lpTokensDonatedADA).toEqual("2000000");
        expect(lpTokensDonated).toEqual("8600000");
        /**
         * The lp tokens returned output should be the fourth in the outputs.
         */
        const lpTokensOutput = builtTx.txComplete.body().outputs().get(3);
        expect(Buffer.from(lpTokensOutput.address().to_bytes()).toString("hex")).toEqual("00c279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775a121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0");
        const lpTokensDepositAssets = lpTokensOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const lpTokensReturnedADA = lpTokensOutput.amount().coin().to_str();
        const lpTokensReturned = lpTokensDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["0014df109e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [lpTokensReturnedADA, lpTokensReturned].forEach((val) => expect(val).not.toBeUndefined());
        expect(lpTokensReturnedADA).toEqual("2000000");
        expect(lpTokensReturned).toEqual("11400000");
        jest_fetch_mock_1.default.disableMocks();
    });
    test("mintPool() should build a transaction correctly when using exotic pairs", async () => {
        jest_fetch_mock_1.default.enableMocks();
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(mockData_js_1.mockBlockfrostEvaluateResponse));
        const { fees, build } = await builder.mintPool({
            assetA: testing_js_1.PREVIEW_DATA.assets.tindy,
            assetB: testing_js_1.PREVIEW_DATA.assets.usdc,
            fees: 5n,
            marketOpen: 5n,
            ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
        });
        /**
         * Since we're depositing exotic assets, we expect:
         * - 2 minAda required for exotic pair
         * - 2 ADA for metadata ref token
         * - 2 ADA for sending back LP tokens
         */
        expect(fees.deposit.amount.toString()).toEqual("6000000");
        const { builtTx } = await build();
        const poolBalanceDatum = builtTx.txComplete
            .witness_set()
            .redeemers()
            ?.get(0);
        expect(poolBalanceDatum).not.toBeUndefined();
        expect(Buffer.from(poolBalanceDatum?.to_bytes()).toString("hex")).toEqual("840100d87a9f9f9f581c99b071ce8580d6a3a11b4902145adb8bfd0d2a03935af8cf66403e154455534443ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff0001ff821a000b4af51a121ba48c");
        /**
         * The pool output should be the first in the outputs.
         */
        const poolOutput = builtTx.txComplete.body().outputs().get(0);
        expect(Buffer.from(poolOutput.address().to_bytes()).toString("hex")).toEqual("308140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca7467ae52afc8e9f5603c9265e7ce24853863a34f6b12d12a098f8808");
        const poolDepositAssets = poolOutput.amount().multiasset()?.to_js_value();
        // const poolDepositedAssetA = poolOutput.amount().coin().to_str();
        const poolDepositedAssetA = poolDepositAssets[testing_js_1.PREVIEW_DATA.assets.usdc.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.usdc.metadata.assetId.split(".")[1]];
        const poolDepositedAssetB = poolDepositAssets[testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[0]][testing_js_1.PREVIEW_DATA.assets.tindy.metadata.assetId.split(".")[1]];
        const poolDepositedNFT = poolDepositAssets["8140c4b89428fc264e90b10c71c53a4c3f9ce52b676bf1d9b51eb9ca"]["000de1409e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [poolDepositedAssetA, poolDepositedAssetB, poolDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        // Should deposit assets without additional ADA deposit.
        expect(poolDepositedAssetA).toEqual(testing_js_1.PREVIEW_DATA.assets.tada.amount.toString());
        expect(poolDepositedAssetB).toEqual("20000000");
        expect(poolDepositedNFT).toEqual("1");
        // Should have datum attached.
        expect(Buffer.from(poolOutput.datum()?.as_data()?.to_bytes()).toString("hex")).toEqual("d818587fd8799f581c9e67cc006063ea055629552650664979d7c92d47e342e5340ef775509f9f581c99b071ce8580d6a3a11b4902145adb8bfd0d2a03935af8cf66403e154455534443ff9f581cfa3eff2047fdf9293c5feef4dc85ce58097ea1c6da4845a3515351834574494e4459ffff1a01312d000505d87a80051a002dc6c0ff");
        /**
         * The metadata output should be the second in the outputs.
         */
        const metadataOutput = builtTx.txComplete.body().outputs().get(1);
        expect(Buffer.from(metadataOutput.address().to_bytes()).toString("hex")).toEqual("60035dee66d57cc271697711d63c8c35ffa0b6c4468a6a98024feac73b");
        const metadataDepositAssets = metadataOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const metadataDepositedAssetA = metadataOutput.amount().coin().to_str();
        const metadataDepositedNFT = metadataDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["000643b09e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [metadataDepositedAssetA, metadataDepositedNFT].forEach((val) => expect(val).not.toBeUndefined());
        expect(metadataDepositedAssetA).toEqual("2000000");
        expect(metadataDepositedNFT).toEqual("1");
        /**
         * The lp tokens output should be the third in the outputs.
         */
        const lpTokensOutput = builtTx.txComplete.body().outputs().get(2);
        expect(Buffer.from(lpTokensOutput.address().to_bytes()).toString("hex")).toEqual("00c279a3fb3b4e62bbc78e288783b58045d4ae82a18867d8352d02775a121fd22e0b57ac206fefc763f8bfa0771919f5218b40691eea4514d0");
        const lpTokensDepositAssets = lpTokensOutput
            .amount()
            .multiasset()
            ?.to_js_value();
        const lpTokensReturnedADA = lpTokensOutput.amount().coin().to_str();
        const lpTokensReturned = lpTokensDepositAssets[mockData_js_1.params.blueprint.validators[1].hash]["0014df109e67cc006063ea055629552650664979d7c92d47e342e5340ef77550"];
        [lpTokensReturnedADA, lpTokensReturned].forEach((val) => expect(val).not.toBeUndefined());
        expect(lpTokensReturnedADA).toEqual("2000000");
        expect(lpTokensReturned).toEqual("20000000");
        jest_fetch_mock_1.default.disableMocks();
    });
    test("mintPool() should throw an error when the ADA provided is less than the min required", async () => {
        jest_fetch_mock_1.default.enableMocks();
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify(mockData_js_1.mockBlockfrostEvaluateResponse));
        try {
            await builder.mintPool({
                assetA: testing_js_1.PREVIEW_DATA.assets.tada.withAmount(500000n),
                assetB: testing_js_1.PREVIEW_DATA.assets.usdc,
                fees: 5n,
                marketOpen: 5n,
                ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            });
        }
        catch (e) {
            expect(e.message).toEqual(TxBuilder_Lucid_V3_class_js_1.TxBuilderLucidV3.MIN_ADA_POOL_MINT_ERROR);
        }
        jest_fetch_mock_1.default.disableMocks();
    });
    it("should fail when trying to mint a pool with decaying values", async () => {
        try {
            await builder.mintPool({
                assetA: testing_js_1.PREVIEW_DATA.assets.tada,
                assetB: testing_js_1.PREVIEW_DATA.assets.tindy,
                fees: 5n,
                marketOpen: 5n,
                ownerAddress: testing_js_1.PREVIEW_DATA.addresses.current,
            });
        }
        catch (e) {
            expect(e.message).toEqual("Decaying fees are currently not supported in the scoopers. For now, use the same fee for both start and end values.");
        }
    });
});
//# sourceMappingURL=TxBuilder.Lucid.V3.class.test.js.map