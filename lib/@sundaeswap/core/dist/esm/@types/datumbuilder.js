/**
 * The boolean type of a pool's coin, where 0 = CoinA and 1 = CoinB.
 */
export var EPoolCoin;
(function (EPoolCoin) {
    EPoolCoin[EPoolCoin["A"] = 0] = "A";
    EPoolCoin[EPoolCoin["B"] = 1] = "B";
})(EPoolCoin || (EPoolCoin = {}));
/**
 * The Datum type to be passed along with an address.
 */
export var EDatumType;
(function (EDatumType) {
    EDatumType["HASH"] = "HASH";
    EDatumType["INLINE"] = "INLINE";
    EDatumType["NONE"] = "NONE";
})(EDatumType || (EDatumType = {}));
//# sourceMappingURL=datumbuilder.js.map