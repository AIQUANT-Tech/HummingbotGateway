import { Data } from "lucid-cardano";
export declare const SignatureSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}>;
export type TSignatureSchema = Data.Static<typeof SignatureSchema>;
export declare const Signature: {
    Address: {
        hex: string;
    };
};
export declare const AllOfSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    AllOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
}>;
export type TAllOfSchema = Data.Static<typeof AllOfSchema>;
export declare const AllOf: {
    AllOf: {
        scripts: Data;
    };
};
export declare const AnyOfSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    AnyOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
}>;
export type TAnyOfSchema = Data.Static<typeof AnyOfSchema>;
export declare const AnyOf: {
    AnyOf: {
        scripts: Data;
    };
};
export declare const AtLeastSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    AtLeast: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        required: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
}>;
export type TAtLeastSchema = Data.Static<typeof AtLeastSchema>;
export declare const AtLeast: {
    AtLeast: {
        scripts: Data;
        required: bigint;
    };
};
export declare const BeforeSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Before: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    }>;
}>;
export type TBeforeSchema = Data.Static<typeof BeforeSchema>;
export declare const Before: {
    Before: {
        posix: bigint;
    };
};
export declare const AfterSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    After: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    }>;
}>;
export type TAfterSchema = Data.Static<typeof AfterSchema>;
export declare const After: {
    After: {
        posix: bigint;
    };
};
export declare const ScriptSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Script: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}>;
export type TScriptSchema = Data.Static<typeof ScriptSchema>;
export declare const Script: {
    Script: {
        hex: string;
    };
};
export declare const MultiSigScriptSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    AllOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    AnyOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    AtLeast: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        required: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Before: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    After: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Script: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}>)[]>;
export type TMultiSigScript = Data.Static<typeof MultiSigScriptSchema>;
export declare const MultiSigScript: {
    Address: {
        hex: string;
    };
} | {
    AllOf: {
        scripts: Data;
    };
} | {
    AnyOf: {
        scripts: Data;
    };
} | {
    AtLeast: {
        scripts: Data;
        required: bigint;
    };
} | {
    Before: {
        posix: bigint;
    };
} | {
    After: {
        posix: bigint;
    };
} | {
    Script: {
        hex: string;
    };
};
export declare const SingletonValueSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
export type TSingletonValue = Data.Static<typeof SingletonValueSchema>;
export declare const SingletonValue: [string, string, bigint];
export declare const SwapSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    offer: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
    minReceived: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
}>;
export type TSwap = Data.Static<typeof SwapSchema>;
export declare const Swap: {
    offer: [string, string, bigint];
    minReceived: [string, string, bigint];
};
export declare const DepositSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>]>;
}>;
export declare const WithdrawalSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    amount: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
}>;
export declare const DonationSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>]>;
}>;
export declare const OrderSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Strategies: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<"TODO" | null>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Swap: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        offer: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
        minReceived: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Deposit: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>]>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Withdrawal: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        amount: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Donation: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>]>;
    }>;
}>)[]>;
export type TOrder = Data.Static<typeof OrderSchema>;
export declare const Order: {
    Strategies: "TODO" | null;
} | {
    Swap: {
        offer: [string, string, bigint];
        minReceived: [string, string, bigint];
    };
} | {
    Deposit: {
        assets: [[string, string, bigint], [string, string, bigint]];
    };
} | {
    Withdrawal: {
        amount: [string, string, bigint];
    };
} | {
    Donation: {
        assets: [[string, string, bigint], [string, string, bigint]];
    };
};
export declare const VKeyCredentialSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}>;
export type TVKeyCredential = Data.Static<typeof VKeyCredentialSchema>;
export declare const VKeyCredential: {
    VKeyCredential: {
        bytes: string;
    };
};
export declare const SCredentialSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}>;
export type TSCredential = Data.Static<typeof SCredentialSchema>;
export declare const SCredential: {
    SCredential: {
        bytes: string;
    };
};
export declare const CredentialSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}>)[]>;
export type TCredential = Data.Static<typeof CredentialSchema>;
export declare const Credential: {
    VKeyCredential: {
        bytes: string;
    };
} | {
    SCredential: {
        bytes: string;
    };
};
export declare const AddressSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    paymentCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }>)[]>;
    stakeCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<{
        keyHash: {
            VKeyCredential: {
                bytes: string;
            };
        } | {
            SCredential: {
                bytes: string;
            };
        };
    } | null>;
}>;
export type TAddressSchema = Data.Static<typeof AddressSchema>;
export declare const Address: {
    paymentCredential: {
        VKeyCredential: {
            bytes: string;
        };
    } | {
        SCredential: {
            bytes: string;
        };
    };
    stakeCredential: {
        keyHash: {
            VKeyCredential: {
                bytes: string;
            };
        } | {
            SCredential: {
                bytes: string;
            };
        };
    } | null;
};
export declare const DestinationSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        paymentCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
            }>;
        }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
            }>;
        }>)[]>;
        stakeCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<{
            keyHash: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
        } | null>;
    }>;
    datum: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
}>;
export type TDestination = Data.Static<typeof DestinationSchema>;
export declare const Destination: {
    address: {
        paymentCredential: {
            VKeyCredential: {
                bytes: string;
            };
        } | {
            SCredential: {
                bytes: string;
            };
        };
        stakeCredential: {
            keyHash: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
        } | null;
    };
    datum: Data;
};
export declare const IdentSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
export declare const OrderDatumSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    poolIdent: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string | null>;
    owner: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AllOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AnyOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AtLeast: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            required: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Before: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        After: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Script: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }>)[]>;
    scooperFee: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    destination: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            paymentCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                    bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
                }>;
            }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                    bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
                }>;
            }>)[]>;
            stakeCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<{
                keyHash: {
                    VKeyCredential: {
                        bytes: string;
                    };
                } | {
                    SCredential: {
                        bytes: string;
                    };
                };
            } | null>;
        }>;
        datum: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
    }>;
    order: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Strategies: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<"TODO" | null>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Swap: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            offer: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
            minReceived: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Deposit: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>]>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Withdrawal: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            amount: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Donation: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>]>]>;
        }>;
    }>)[]>;
    extension: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
}>;
export type TOrderDatum = Data.Static<typeof OrderDatumSchema>;
export declare const OrderDatum: {
    scooperFee: bigint;
    poolIdent: string | null;
    owner: {
        Address: {
            hex: string;
        };
    } | {
        AllOf: {
            scripts: Data;
        };
    } | {
        AnyOf: {
            scripts: Data;
        };
    } | {
        AtLeast: {
            scripts: Data;
            required: bigint;
        };
    } | {
        Before: {
            posix: bigint;
        };
    } | {
        After: {
            posix: bigint;
        };
    } | {
        Script: {
            hex: string;
        };
    };
    destination: {
        address: {
            paymentCredential: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
            stakeCredential: {
                keyHash: {
                    VKeyCredential: {
                        bytes: string;
                    };
                } | {
                    SCredential: {
                        bytes: string;
                    };
                };
            } | null;
        };
        datum: Data;
    };
    order: {
        Strategies: "TODO" | null;
    } | {
        Swap: {
            offer: [string, string, bigint];
            minReceived: [string, string, bigint];
        };
    } | {
        Deposit: {
            assets: [[string, string, bigint], [string, string, bigint]];
        };
    } | {
        Withdrawal: {
            amount: [string, string, bigint];
        };
    } | {
        Donation: {
            assets: [[string, string, bigint], [string, string, bigint]];
        };
    };
    extension: Data;
};
export declare const AssetClassSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>;
export type TAssetClass = Data.Static<typeof AssetClassSchema>;
export declare const AssetClass: [string, string];
export declare const AssetClassPairSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>]>;
export type TAssetClassPair = Data.Static<typeof AssetClassPairSchema>;
export declare const AssetClassPair: [[string, string], [string, string]];
export declare const PoolDatumSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    identifier: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>]>;
    circulatingLp: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    bidFeePer10Thousand: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    askFeePer10Thousand: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    feeManager: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<{
        Address: {
            hex: string;
        };
    } | {
        AllOf: {
            scripts: Data;
        };
    } | {
        AnyOf: {
            scripts: Data;
        };
    } | {
        AtLeast: {
            scripts: Data;
            required: bigint;
        };
    } | {
        Before: {
            posix: bigint;
        };
    } | {
        After: {
            posix: bigint;
        };
    } | {
        Script: {
            hex: string;
        };
    } | null>;
    marketOpen: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    protocolFee: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
}>;
export type TPoolDatum = Data.Static<typeof PoolDatumSchema>;
export declare const PoolDatum: {
    marketOpen: bigint;
    assets: [[string, string], [string, string]];
    identifier: string;
    circulatingLp: bigint;
    bidFeePer10Thousand: bigint;
    askFeePer10Thousand: bigint;
    feeManager: {
        Address: {
            hex: string;
        };
    } | {
        AllOf: {
            scripts: Data;
        };
    } | {
        AnyOf: {
            scripts: Data;
        };
    } | {
        AtLeast: {
            scripts: Data;
            required: bigint;
        };
    } | {
        Before: {
            posix: bigint;
        };
    } | {
        After: {
            posix: bigint;
        };
    } | {
        Script: {
            hex: string;
        };
    } | null;
    protocolFee: bigint;
};
export declare const PoolRedeemerSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    DUMMY: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TLiteral<"DUMMY">;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    Spend: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        contents: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            signatoryIndex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
            scooperIndex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
            inputOrder: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TArray<import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>>;
        }>;
    }>;
}>)[]>;
export type TPoolRedeemer = Data.Static<typeof PoolRedeemerSchema>;
export declare const PoolRedeemer: {
    DUMMY: "DUMMY";
} | {
    Spend: {
        contents: {
            signatoryIndex: bigint;
            scooperIndex: bigint;
            inputOrder: bigint[];
        };
    };
};
export declare const OrderRedeemerSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TLiteral<"Scoop"> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TLiteral<"Cancel">)[]>;
export type TOrderRedeemer = Data.Static<typeof OrderRedeemerSchema>;
export declare const OrderRedeemer: "Scoop" | "Cancel";
export declare const PoolMintRedeemerSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    MintLP: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        identifier: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
    }>;
}> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    CreatePool: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        assets: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TTuple<[import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>, import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>]>]>;
        poolOutput: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        metadataOutput: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    }>;
}>)[]>;
export type TPoolMintRedeemer = Data.Static<typeof PoolMintRedeemerSchema>;
export declare const PoolMintRedeemer: {
    MintLP: {
        identifier: string;
    };
} | {
    CreatePool: {
        assets: [[string, string], [string, string]];
        poolOutput: bigint;
        metadataOutput: bigint;
    };
};
export declare const SettingsDatumSchema: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
    settingsAdmin: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AllOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AnyOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AtLeast: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            required: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Before: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        After: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Script: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }>)[]>;
    metadataAdmin: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        paymentCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
            }>;
        }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
            }>;
        }>)[]>;
        stakeCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<{
            keyHash: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
        } | null>;
    }>;
    treasuryAdmin: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Address: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AllOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AnyOf: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        AtLeast: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            required: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
            scripts: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Before: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        After: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            posix: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        Script: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            hex: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }>)[]>;
    treasuryAddress: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        paymentCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
            }>;
        }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
                bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
            }>;
        }>)[]>;
        stakeCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<{
            keyHash: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
        } | null>;
    }>;
    treasuryAllowance: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TArray<import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>>;
    authorizedScoopers: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string[] | null>;
    authorizedStakingKeys: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TArray<import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnion<(import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        VKeyCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }> | import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
        SCredential: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TObject<{
            bytes: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<string>;
        }>;
    }>)[]>>;
    baseFee: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    simpleFee: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    strategyFee: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    poolCreationFee: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<bigint>;
    extensions: import("lucid-cardano/types/deps/deno.land/x/typebox@0.25.13/src/typebox").TUnsafe<Data>;
}>;
export type TSettingsDatum = Data.Static<typeof SettingsDatumSchema>;
export declare const SettingsDatum: {
    settingsAdmin: {
        Address: {
            hex: string;
        };
    } | {
        AllOf: {
            scripts: Data;
        };
    } | {
        AnyOf: {
            scripts: Data;
        };
    } | {
        AtLeast: {
            scripts: Data;
            required: bigint;
        };
    } | {
        Before: {
            posix: bigint;
        };
    } | {
        After: {
            posix: bigint;
        };
    } | {
        Script: {
            hex: string;
        };
    };
    metadataAdmin: {
        paymentCredential: {
            VKeyCredential: {
                bytes: string;
            };
        } | {
            SCredential: {
                bytes: string;
            };
        };
        stakeCredential: {
            keyHash: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
        } | null;
    };
    treasuryAdmin: {
        Address: {
            hex: string;
        };
    } | {
        AllOf: {
            scripts: Data;
        };
    } | {
        AnyOf: {
            scripts: Data;
        };
    } | {
        AtLeast: {
            scripts: Data;
            required: bigint;
        };
    } | {
        Before: {
            posix: bigint;
        };
    } | {
        After: {
            posix: bigint;
        };
    } | {
        Script: {
            hex: string;
        };
    };
    treasuryAddress: {
        paymentCredential: {
            VKeyCredential: {
                bytes: string;
            };
        } | {
            SCredential: {
                bytes: string;
            };
        };
        stakeCredential: {
            keyHash: {
                VKeyCredential: {
                    bytes: string;
                };
            } | {
                SCredential: {
                    bytes: string;
                };
            };
        } | null;
    };
    treasuryAllowance: bigint[];
    authorizedScoopers: string[] | null;
    authorizedStakingKeys: ({
        VKeyCredential: {
            bytes: string;
        };
    } | {
        SCredential: {
            bytes: string;
        };
    })[];
    baseFee: bigint;
    simpleFee: bigint;
    strategyFee: bigint;
    poolCreationFee: bigint;
    extensions: Data;
};
//# sourceMappingURL=contracts.v3.d.ts.map