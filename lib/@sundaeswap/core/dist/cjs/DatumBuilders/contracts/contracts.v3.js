"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolMintRedeemer = exports.PoolMintRedeemerSchema = exports.OrderRedeemer = exports.OrderRedeemerSchema = exports.PoolRedeemer = exports.PoolRedeemerSchema = exports.PoolDatum = exports.PoolDatumSchema = exports.AssetClassPair = exports.AssetClassPairSchema = exports.AssetClass = exports.AssetClassSchema = exports.OrderDatum = exports.OrderDatumSchema = exports.IdentSchema = exports.Destination = exports.DestinationSchema = exports.Address = exports.AddressSchema = exports.Credential = exports.CredentialSchema = exports.SCredential = exports.SCredentialSchema = exports.VKeyCredential = exports.VKeyCredentialSchema = exports.Order = exports.OrderSchema = exports.DonationSchema = exports.WithdrawalSchema = exports.DepositSchema = exports.Swap = exports.SwapSchema = exports.SingletonValue = exports.SingletonValueSchema = exports.MultiSigScript = exports.MultiSigScriptSchema = exports.Script = exports.ScriptSchema = exports.After = exports.AfterSchema = exports.Before = exports.BeforeSchema = exports.AtLeast = exports.AtLeastSchema = exports.AnyOf = exports.AnyOfSchema = exports.AllOf = exports.AllOfSchema = exports.Signature = exports.SignatureSchema = void 0;
exports.SettingsDatum = exports.SettingsDatumSchema = void 0;
const lucid_cardano_1 = require("lucid-cardano");
exports.SignatureSchema = lucid_cardano_1.Data.Object({
    Address: lucid_cardano_1.Data.Object({
        hex: lucid_cardano_1.Data.Bytes(),
    }),
});
exports.Signature = exports.SignatureSchema;
exports.AllOfSchema = lucid_cardano_1.Data.Object({
    AllOf: lucid_cardano_1.Data.Object({
        scripts: lucid_cardano_1.Data.Any(),
    }),
});
exports.AllOf = exports.AllOfSchema;
exports.AnyOfSchema = lucid_cardano_1.Data.Object({
    AnyOf: lucid_cardano_1.Data.Object({
        scripts: lucid_cardano_1.Data.Any(),
    }),
});
exports.AnyOf = exports.AnyOfSchema;
exports.AtLeastSchema = lucid_cardano_1.Data.Object({
    AtLeast: lucid_cardano_1.Data.Object({
        required: lucid_cardano_1.Data.Integer(),
        scripts: lucid_cardano_1.Data.Any(),
    }),
});
exports.AtLeast = exports.AtLeastSchema;
exports.BeforeSchema = lucid_cardano_1.Data.Object({
    Before: lucid_cardano_1.Data.Object({
        posix: lucid_cardano_1.Data.Integer(),
    }),
});
exports.Before = exports.BeforeSchema;
exports.AfterSchema = lucid_cardano_1.Data.Object({
    After: lucid_cardano_1.Data.Object({
        posix: lucid_cardano_1.Data.Integer(),
    }),
});
exports.After = exports.AfterSchema;
exports.ScriptSchema = lucid_cardano_1.Data.Object({
    Script: lucid_cardano_1.Data.Object({
        hex: lucid_cardano_1.Data.Bytes(),
    }),
});
exports.Script = exports.ScriptSchema;
// Needs to be updated later to allow full variant
exports.MultiSigScriptSchema = lucid_cardano_1.Data.Enum([
    exports.SignatureSchema,
    exports.AllOfSchema,
    exports.AnyOfSchema,
    exports.AtLeastSchema,
    exports.BeforeSchema,
    exports.AfterSchema,
    exports.ScriptSchema,
]);
exports.MultiSigScript = exports.MultiSigScriptSchema;
exports.SingletonValueSchema = lucid_cardano_1.Data.Tuple([
    lucid_cardano_1.Data.Bytes(),
    lucid_cardano_1.Data.Bytes(),
    lucid_cardano_1.Data.Integer(),
]);
exports.SingletonValue = exports.SingletonValueSchema;
exports.SwapSchema = lucid_cardano_1.Data.Object({
    offer: exports.SingletonValueSchema,
    minReceived: exports.SingletonValueSchema,
});
exports.Swap = exports.SwapSchema;
exports.DepositSchema = lucid_cardano_1.Data.Object({
    assets: lucid_cardano_1.Data.Tuple([exports.SingletonValueSchema, exports.SingletonValueSchema]),
});
exports.WithdrawalSchema = lucid_cardano_1.Data.Object({
    amount: exports.SingletonValueSchema,
});
exports.DonationSchema = lucid_cardano_1.Data.Object({
    assets: lucid_cardano_1.Data.Tuple([exports.SingletonValueSchema, exports.SingletonValueSchema]),
});
exports.OrderSchema = lucid_cardano_1.Data.Enum([
    lucid_cardano_1.Data.Object({ Strategies: lucid_cardano_1.Data.Nullable(lucid_cardano_1.Data.Literal("TODO")) }),
    lucid_cardano_1.Data.Object({ Swap: exports.SwapSchema }),
    lucid_cardano_1.Data.Object({ Deposit: exports.DepositSchema }),
    lucid_cardano_1.Data.Object({ Withdrawal: exports.WithdrawalSchema }),
    lucid_cardano_1.Data.Object({ Donation: exports.DonationSchema }),
]);
exports.Order = exports.OrderSchema;
exports.VKeyCredentialSchema = lucid_cardano_1.Data.Object({
    VKeyCredential: lucid_cardano_1.Data.Object({ bytes: lucid_cardano_1.Data.Bytes() }),
});
exports.VKeyCredential = exports.VKeyCredentialSchema;
exports.SCredentialSchema = lucid_cardano_1.Data.Object({
    SCredential: lucid_cardano_1.Data.Object({ bytes: lucid_cardano_1.Data.Bytes() }),
});
exports.SCredential = exports.SCredentialSchema;
exports.CredentialSchema = lucid_cardano_1.Data.Enum([
    exports.VKeyCredentialSchema,
    exports.SCredentialSchema,
]);
exports.Credential = exports.CredentialSchema;
exports.AddressSchema = lucid_cardano_1.Data.Object({
    paymentCredential: exports.CredentialSchema,
    stakeCredential: lucid_cardano_1.Data.Nullable(lucid_cardano_1.Data.Object({
        keyHash: exports.CredentialSchema,
    })),
});
exports.Address = exports.AddressSchema;
exports.DestinationSchema = lucid_cardano_1.Data.Object({
    address: exports.AddressSchema,
    datum: lucid_cardano_1.Data.Any(),
});
exports.Destination = exports.DestinationSchema;
exports.IdentSchema = lucid_cardano_1.Data.Bytes();
exports.OrderDatumSchema = lucid_cardano_1.Data.Object({
    poolIdent: lucid_cardano_1.Data.Nullable(exports.IdentSchema),
    owner: exports.MultiSigScriptSchema,
    scooperFee: lucid_cardano_1.Data.Integer(),
    destination: exports.DestinationSchema,
    order: exports.OrderSchema,
    extension: lucid_cardano_1.Data.Any(),
});
exports.OrderDatum = exports.OrderDatumSchema;
exports.AssetClassSchema = lucid_cardano_1.Data.Tuple([lucid_cardano_1.Data.Bytes(), lucid_cardano_1.Data.Bytes()]);
exports.AssetClass = exports.AssetClassSchema;
exports.AssetClassPairSchema = lucid_cardano_1.Data.Tuple([
    exports.AssetClassSchema,
    exports.AssetClassSchema,
]);
exports.AssetClassPair = exports.AssetClassPairSchema;
exports.PoolDatumSchema = lucid_cardano_1.Data.Object({
    identifier: exports.IdentSchema,
    assets: exports.AssetClassPairSchema,
    circulatingLp: lucid_cardano_1.Data.Integer(),
    bidFeePer10Thousand: lucid_cardano_1.Data.Integer(),
    askFeePer10Thousand: lucid_cardano_1.Data.Integer(),
    feeManager: lucid_cardano_1.Data.Nullable(exports.MultiSigScriptSchema),
    marketOpen: lucid_cardano_1.Data.Integer(),
    protocolFee: lucid_cardano_1.Data.Integer(),
});
exports.PoolDatum = exports.PoolDatumSchema;
exports.PoolRedeemerSchema = lucid_cardano_1.Data.Enum([
    // This first variant is never used, just a hack to make aiken's dual
    // spend/mint script work since the script checks for a constr 122 wrapper to
    // see if it should run the spend code
    lucid_cardano_1.Data.Object({ DUMMY: lucid_cardano_1.Data.Literal("DUMMY") }),
    lucid_cardano_1.Data.Object({
        Spend: lucid_cardano_1.Data.Object({
            contents: lucid_cardano_1.Data.Object({
                signatoryIndex: lucid_cardano_1.Data.Integer(),
                scooperIndex: lucid_cardano_1.Data.Integer(),
                inputOrder: lucid_cardano_1.Data.Array(lucid_cardano_1.Data.Integer()),
            }),
        }),
    }),
]);
exports.PoolRedeemer = exports.PoolRedeemerSchema;
exports.OrderRedeemerSchema = lucid_cardano_1.Data.Enum([
    lucid_cardano_1.Data.Literal("Scoop"),
    lucid_cardano_1.Data.Literal("Cancel"),
]);
exports.OrderRedeemer = exports.OrderRedeemerSchema;
exports.PoolMintRedeemerSchema = lucid_cardano_1.Data.Enum([
    lucid_cardano_1.Data.Object({ MintLP: lucid_cardano_1.Data.Object({ identifier: lucid_cardano_1.Data.Bytes() }) }),
    lucid_cardano_1.Data.Object({
        CreatePool: lucid_cardano_1.Data.Object({
            assets: lucid_cardano_1.Data.Tuple([exports.AssetClassSchema, exports.AssetClassSchema]),
            poolOutput: lucid_cardano_1.Data.Integer(),
            metadataOutput: lucid_cardano_1.Data.Integer(),
        }),
    }),
]);
exports.PoolMintRedeemer = exports.PoolMintRedeemerSchema;
exports.SettingsDatumSchema = lucid_cardano_1.Data.Object({
    settingsAdmin: exports.MultiSigScriptSchema,
    metadataAdmin: exports.AddressSchema,
    treasuryAdmin: exports.MultiSigScriptSchema,
    treasuryAddress: exports.AddressSchema,
    treasuryAllowance: lucid_cardano_1.Data.Array(lucid_cardano_1.Data.Integer()),
    authorizedScoopers: lucid_cardano_1.Data.Nullable(lucid_cardano_1.Data.Array(lucid_cardano_1.Data.Bytes())),
    authorizedStakingKeys: lucid_cardano_1.Data.Array(exports.CredentialSchema),
    baseFee: lucid_cardano_1.Data.Integer(),
    simpleFee: lucid_cardano_1.Data.Integer(),
    strategyFee: lucid_cardano_1.Data.Integer(),
    poolCreationFee: lucid_cardano_1.Data.Integer(),
    extensions: lucid_cardano_1.Data.Any(),
});
exports.SettingsDatum = exports.SettingsDatumSchema;
//# sourceMappingURL=contracts.v3.js.map