"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryProviderSundaeSwap = void 0;
const SundaeUtils_class_js_1 = require("../Utilities/SundaeUtils.class.js");
const providerBaseUrls = {
    mainnet: "https://api.sundae.fi/graphql",
    preview: "https://api.preview.sundae.fi/graphql",
};
/**
 * This class provides a simple set of useful tooling, but primarily is used to
 * query data about pools on the SundaeSwap protocol.
 *
 * @example
 * ```ts
 * const query = new QueryProviderSundaeSwap("preview");
 * const { ident } = await query.findPoolData({
 *   ident: "02"
 * });
 *
 * console.log(ident); // "02"
 * ```
 *
 * @group Extensions
 */
class QueryProviderSundaeSwap {
    network;
    baseUrl;
    constructor(network) {
        this.network = network;
        this.baseUrl = providerBaseUrls[network];
    }
    async findPoolData({ ident }) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
          query poolByIdent($id: ID!) {
            pools {
              byId(id: $id) {
                feesFinalized {
                  slot
                }
                marketOpen {
                  slot
                }
                openingFee
                finalFee
                id
                assetA {
                  assetId: id
                  decimals
                }
                assetB {
                  assetId: id
                  decimals
                }
                assetLP {
                  assetId: id
                  decimals
                }
                current {
                  quantityA {
                    quantity
                  }
                  quantityB {
                    quantity
                  }
                  quantityLP {
                    quantity
                  }
                }
                version
              }
            }
          }
        `,
                variables: {
                    id: ident,
                },
            }),
        }).then((res) => res.json());
        if (!res?.data) {
            throw new Error(`Something went wrong when trying to fetch pool data. Full response: ${JSON.stringify(res)}`);
        }
        const pool = res.data.pools.byId;
        return {
            assetA: pool.assetA,
            assetB: pool.assetB,
            assetLP: pool.assetLP,
            currentFee: SundaeUtils_class_js_1.SundaeUtils.getCurrentFeeFromDecayingFee({
                endFee: pool.finalFee,
                endSlot: pool.feesFinalized.slot,
                startFee: pool.openingFee,
                startSlot: pool.marketOpen.slot,
                network: this.network,
            }),
            ident: pool.id,
            liquidity: {
                aReserve: BigInt(pool.current.quantityA.quantity ?? 0),
                bReserve: BigInt(pool.current.quantityB.quantity ?? 0),
                lpTotal: BigInt(pool.current.quantityLP.quantity ?? 0),
            },
            version: pool.version,
        };
    }
    async findOpenOrderDatum(utxo) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            body: JSON.stringify({
                query: `
        query UTXO($txHash: String!, $index: Int!) {
          utxo(txHash: $txHash, index: $index) {
            datum
            datumHash
          }
        }
        `,
                variables: {
                    txHash: utxo.hash,
                    index: utxo.index,
                },
            }),
        }).then((res) => res.json());
        if (!res?.data) {
            throw new Error(`Something went wrong when trying to fetch that transaction's datum. Full response: ${JSON.stringify(res)}`);
        }
        return {
            datum: Buffer.from(res.data.utxo.datum, "base64").toString("hex"),
            datumHash: res.data.utxo.datumHash,
        };
    }
    async getProtocolParamsWithScriptHashes(version) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
        query ProtocolValidators {
          protocols {
            blueprint {
              validators {
                hash
                title
              }
            }
            references {
              key
              txIn {
                hash
                index
              }
            }
            version
          }
        }
        `,
            }),
        }).then((res) => res.json());
        if (!res?.data) {
            throw new Error(`Something went wrong when trying to fetch the protocol validators. Full response: ${JSON.stringify(res)}`);
        }
        if (version) {
            return res.data.protocols.find(({ version: protocolVersion }) => version === protocolVersion);
        }
        return res.data.protocols;
    }
    async getProtocolParamsWithScripts(version) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
        query ProtocolValidators {
          protocols {
            blueprint {
              validators {
                hash
                title
                compiledCode
              }
            }
            references {
              key
              txIn {
                hash
                index
              }
            }
            version
          }
        }
        `,
            }),
        }).then((res) => res.json());
        if (!res?.data) {
            throw new Error(`Something went wrong when trying to fetch the protocol validators. Full response: ${JSON.stringify(res)}`);
        }
        if (version) {
            return res.data.protocols.find(({ version: protocolVersion }) => version === protocolVersion);
        }
        return res.data.protocols;
    }
}
exports.QueryProviderSundaeSwap = QueryProviderSundaeSwap;
//# sourceMappingURL=QueryProviderSundaeSwap.js.map