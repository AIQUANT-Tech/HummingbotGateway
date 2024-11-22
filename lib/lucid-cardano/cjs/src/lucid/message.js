"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = void 0;
require("core-js/modules/es.error.cause.js");
var _sign_data = require("../misc/sign_data.js");
var _mod = require("../mod.js");
class Message {
  constructor(lucid, address, payload) {
    Object.defineProperty(this, "lucid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "address", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "payload", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.lucid = lucid;
    this.address = address;
    this.payload = payload;
  }
  /** Sign message with selected wallet. */
  sign() {
    return this.lucid.wallet.signMessage(this.address, this.payload);
  }
  /** Sign message with a separate private key. */
  signWithPrivateKey(privateKey) {
    const {
      paymentCredential,
      stakeCredential,
      address: {
        hex: hexAddress
      }
    } = this.lucid.utils.getAddressDetails(this.address);
    const keyHash = (paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash) || (stakeCredential === null || stakeCredential === void 0 ? void 0 : stakeCredential.hash);
    const keyHashOriginal = _mod.C.PrivateKey.from_bech32(privateKey).to_public().hash().to_hex();
    if (!keyHash || keyHash !== keyHashOriginal) {
      throw new Error("Cannot sign message for address: ".concat(this.address, "."));
    }
    return (0, _sign_data.signData)(hexAddress, this.payload, privateKey);
  }
}
exports.Message = Message;