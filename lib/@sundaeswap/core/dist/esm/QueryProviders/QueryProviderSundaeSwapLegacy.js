const providerBaseUrls = {
    mainnet: "https://api.stats.sundaeswap.finance/graphql",
    preview: "https://api.stats.preview.sundaeswap.finance/graphql",
};
/**
 * This class provides a simple set of useful tooling, but primarily is used to
 * query data about pools on the SundaeSwap protocol.
 *
 * @example
 * ```ts
 * const query = new QueryProviderSundaeSwapLegacy("preview");
 * const { ident } = await query.findPoolData({
 *   pair: [assetAId, assetBId],
 *   fee: "0.03"
 * });
 *
 * console.log(ident); // "02"
 * ```
 *
 * @group Extensions
 */
export class QueryProviderSundaeSwapLegacy {
    network;
    baseUrl;
    constructor(network) {
        this.network = network;
        this.baseUrl = providerBaseUrls[network];
    }
    async findPoolData({ pair: [coinA, coinB], fee, ident, }) {
        const res = await fetch(this.baseUrl, {
            method: "POST",
            body: JSON.stringify({
                query: `
              query poolsByPair($coinA: String!, $coinB: String!) {
                  poolsByPair(coinA: $coinA, coinB: $coinB) {
                    fee
                    ident
                    assetA {
                      assetId
                      decimals
                    }
                    assetB {
                      assetId
                      decimals
                    }
                    assetLP {
                      assetId
                      decimals
                    }
                    quantityA
                    quantityB
                    quantityLP
                    version
                  }
              }
            `,
                variables: {
                    coinA,
                    coinB,
                },
            }),
        }).then((res) => res.json());
        if (!res?.data) {
            throw new Error(`Something went wrong when trying to fetch pool data. Full response: ${JSON.stringify(res)}`);
        }
        const pool = res.data.poolsByPair.find(({ fee: poolFee, ident: poolIdent }) => {
            if (ident) {
                return ident === poolIdent;
            }
            return fee === poolFee;
        });
        if (!pool) {
            throw new Error(`Pool ident not found with a fee of: ${fee}`);
        }
        return {
            assetA: pool.assetA,
            assetB: pool.assetB,
            assetLP: pool.assetLP,
            ident: pool.ident,
            // The API does not conform to the proper decimals, lol
            currentFee: Number(pool.fee) / 100,
            liquidity: {
                aReserve: BigInt(pool.quantityA ?? 0),
                bReserve: BigInt(pool.quantityB ?? 0),
                lpTotal: BigInt(pool.quantityLP ?? 0),
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
}
//# sourceMappingURL=QueryProviderSundaeSwapLegacy.js.map