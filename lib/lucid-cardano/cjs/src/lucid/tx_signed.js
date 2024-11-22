"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TxSigned = void 0;
require("core-js/modules/es.promise.js");
var _mod = require("../core/mod.js");
var _mod2 = require("../utils/mod.js");
class TxSigned {
  constructor(lucid, tx) {
    Object.defineProperty(this, "txSigned", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lucid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.lucid = lucid;
    this.txSigned = tx;
  }
  async submit() {
    return await (this.lucid.wallet || this.lucid.provider).submitTx((0, _mod2.toHex)(this.txSigned.to_bytes()));
  }
  /** Returns the transaction in Hex encoded Cbor. */
  toString() {
    return (0, _mod2.toHex)(this.txSigned.to_bytes());
  }
  /** Return the transaction hash. */
  toHash() {
    return _mod.C.hash_transaction(this.txSigned.body()).to_hex();
  }
}
exports.TxSigned = TxSigned;