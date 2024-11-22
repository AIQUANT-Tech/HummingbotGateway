"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDatumType = exports.EPoolCoin = void 0;
/**
 * The boolean type of a pool's coin, where 0 = CoinA and 1 = CoinB.
 */
var EPoolCoin;
(function (EPoolCoin) {
    EPoolCoin[EPoolCoin["A"] = 0] = "A";
    EPoolCoin[EPoolCoin["B"] = 1] = "B";
})(EPoolCoin = exports.EPoolCoin || (exports.EPoolCoin = {}));
/**
 * The Datum type to be passed along with an address.
 */
var EDatumType;
(function (EDatumType) {
    EDatumType["HASH"] = "HASH";
    EDatumType["INLINE"] = "INLINE";
    EDatumType["NONE"] = "NONE";
})(EDatumType = exports.EDatumType || (exports.EDatumType = {}));
//# sourceMappingURL=datumbuilder.js.map