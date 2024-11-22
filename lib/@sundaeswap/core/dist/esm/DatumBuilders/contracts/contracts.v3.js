import { Data } from "lucid-cardano";
export const SignatureSchema = Data.Object({
    Address: Data.Object({
        hex: Data.Bytes(),
    }),
});
export const Signature = SignatureSchema;
export const AllOfSchema = Data.Object({
    AllOf: Data.Object({
        scripts: Data.Any(),
    }),
});
export const AllOf = AllOfSchema;
export const AnyOfSchema = Data.Object({
    AnyOf: Data.Object({
        scripts: Data.Any(),
    }),
});
export const AnyOf = AnyOfSchema;
export const AtLeastSchema = Data.Object({
    AtLeast: Data.Object({
        required: Data.Integer(),
        scripts: Data.Any(),
    }),
});
export const AtLeast = AtLeastSchema;
export const BeforeSchema = Data.Object({
    Before: Data.Object({
        posix: Data.Integer(),
    }),
});
export const Before = BeforeSchema;
export const AfterSchema = Data.Object({
    After: Data.Object({
        posix: Data.Integer(),
    }),
});
export const After = AfterSchema;
export const ScriptSchema = Data.Object({
    Script: Data.Object({
        hex: Data.Bytes(),
    }),
});
export const Script = ScriptSchema;
// Needs to be updated later to allow full variant
export const MultiSigScriptSchema = Data.Enum([
    SignatureSchema,
    AllOfSchema,
    AnyOfSchema,
    AtLeastSchema,
    BeforeSchema,
    AfterSchema,
    ScriptSchema,
]);
export const MultiSigScript = MultiSigScriptSchema;
export const SingletonValueSchema = Data.Tuple([
    Data.Bytes(),
    Data.Bytes(),
    Data.Integer(),
]);
export const SingletonValue = SingletonValueSchema;
export const SwapSchema = Data.Object({
    offer: SingletonValueSchema,
    minReceived: SingletonValueSchema,
});
export const Swap = SwapSchema;
export const DepositSchema = Data.Object({
    assets: Data.Tuple([SingletonValueSchema, SingletonValueSchema]),
});
export const WithdrawalSchema = Data.Object({
    amount: SingletonValueSchema,
});
export const DonationSchema = Data.Object({
    assets: Data.Tuple([SingletonValueSchema, SingletonValueSchema]),
});
export const OrderSchema = Data.Enum([
    Data.Object({ Strategies: Data.Nullable(Data.Literal("TODO")) }),
    Data.Object({ Swap: SwapSchema }),
    Data.Object({ Deposit: DepositSchema }),
    Data.Object({ Withdrawal: WithdrawalSchema }),
    Data.Object({ Donation: DonationSchema }),
]);
export const Order = OrderSchema;
export const VKeyCredentialSchema = Data.Object({
    VKeyCredential: Data.Object({ bytes: Data.Bytes() }),
});
export const VKeyCredential = VKeyCredentialSchema;
export const SCredentialSchema = Data.Object({
    SCredential: Data.Object({ bytes: Data.Bytes() }),
});
export const SCredential = SCredentialSchema;
export const CredentialSchema = Data.Enum([
    VKeyCredentialSchema,
    SCredentialSchema,
]);
export const Credential = CredentialSchema;
export const AddressSchema = Data.Object({
    paymentCredential: CredentialSchema,
    stakeCredential: Data.Nullable(Data.Object({
        keyHash: CredentialSchema,
    })),
});
export const Address = AddressSchema;
export const DestinationSchema = Data.Object({
    address: AddressSchema,
    datum: Data.Any(),
});
export const Destination = DestinationSchema;
export const IdentSchema = Data.Bytes();
export const OrderDatumSchema = Data.Object({
    poolIdent: Data.Nullable(IdentSchema),
    owner: MultiSigScriptSchema,
    scooperFee: Data.Integer(),
    destination: DestinationSchema,
    order: OrderSchema,
    extension: Data.Any(),
});
export const OrderDatum = OrderDatumSchema;
export const AssetClassSchema = Data.Tuple([Data.Bytes(), Data.Bytes()]);
export const AssetClass = AssetClassSchema;
export const AssetClassPairSchema = Data.Tuple([
    AssetClassSchema,
    AssetClassSchema,
]);
export const AssetClassPair = AssetClassPairSchema;
export const PoolDatumSchema = Data.Object({
    identifier: IdentSchema,
    assets: AssetClassPairSchema,
    circulatingLp: Data.Integer(),
    bidFeePer10Thousand: Data.Integer(),
    askFeePer10Thousand: Data.Integer(),
    feeManager: Data.Nullable(MultiSigScriptSchema),
    marketOpen: Data.Integer(),
    protocolFee: Data.Integer(),
});
export const PoolDatum = PoolDatumSchema;
export const PoolRedeemerSchema = Data.Enum([
    // This first variant is never used, just a hack to make aiken's dual
    // spend/mint script work since the script checks for a constr 122 wrapper to
    // see if it should run the spend code
    Data.Object({ DUMMY: Data.Literal("DUMMY") }),
    Data.Object({
        Spend: Data.Object({
            contents: Data.Object({
                signatoryIndex: Data.Integer(),
                scooperIndex: Data.Integer(),
                inputOrder: Data.Array(Data.Integer()),
            }),
        }),
    }),
]);
export const PoolRedeemer = PoolRedeemerSchema;
export const OrderRedeemerSchema = Data.Enum([
    Data.Literal("Scoop"),
    Data.Literal("Cancel"),
]);
export const OrderRedeemer = OrderRedeemerSchema;
export const PoolMintRedeemerSchema = Data.Enum([
    Data.Object({ MintLP: Data.Object({ identifier: Data.Bytes() }) }),
    Data.Object({
        CreatePool: Data.Object({
            assets: Data.Tuple([AssetClassSchema, AssetClassSchema]),
            poolOutput: Data.Integer(),
            metadataOutput: Data.Integer(),
        }),
    }),
]);
export const PoolMintRedeemer = PoolMintRedeemerSchema;
export const SettingsDatumSchema = Data.Object({
    settingsAdmin: MultiSigScriptSchema,
    metadataAdmin: AddressSchema,
    treasuryAdmin: MultiSigScriptSchema,
    treasuryAddress: AddressSchema,
    treasuryAllowance: Data.Array(Data.Integer()),
    authorizedScoopers: Data.Nullable(Data.Array(Data.Bytes())),
    authorizedStakingKeys: Data.Array(CredentialSchema),
    baseFee: Data.Integer(),
    simpleFee: Data.Integer(),
    strategyFee: Data.Integer(),
    poolCreationFee: Data.Integer(),
    extensions: Data.Any(),
});
export const SettingsDatum = SettingsDatumSchema;
//# sourceMappingURL=contracts.v3.js.map