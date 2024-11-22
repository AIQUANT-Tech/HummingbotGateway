"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signData = signData;
exports.verifyData = verifyData;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.parse-int.js");
var _mod = require("../mod.js");
function signData(addressHex, payload, privateKey) {
  const protectedHeaders = _mod.M.HeaderMap.new();
  protectedHeaders.set_algorithm_id(_mod.M.Label.from_algorithm_id(_mod.M.AlgorithmId.EdDSA));
  protectedHeaders.set_header(_mod.M.Label.new_text("address"), _mod.M.CBORValue.new_bytes((0, _mod.fromHex)(addressHex)));
  const protectedSerialized = _mod.M.ProtectedHeaderMap.new(protectedHeaders);
  const unprotectedHeaders = _mod.M.HeaderMap.new();
  const headers = _mod.M.Headers.new(protectedSerialized, unprotectedHeaders);
  const builder = _mod.M.COSESign1Builder.new(headers, (0, _mod.fromHex)(payload), false);
  const toSign = builder.make_data_to_sign().to_bytes();
  const priv = _mod.C.PrivateKey.from_bech32(privateKey);
  const signedSigStruc = priv.sign(toSign).to_bytes();
  const coseSign1 = builder.build(signedSigStruc);
  const key = _mod.M.COSEKey.new(_mod.M.Label.from_key_type(_mod.M.KeyType.OKP));
  key.set_algorithm_id(_mod.M.Label.from_algorithm_id(_mod.M.AlgorithmId.EdDSA));
  key.set_header(_mod.M.Label.new_int(_mod.M.Int.new_negative(_mod.M.BigNum.from_str("1"))), _mod.M.CBORValue.new_int(_mod.M.Int.new_i32(6))); // crv (-1) set to Ed25519 (6)
  key.set_header(_mod.M.Label.new_int(_mod.M.Int.new_negative(_mod.M.BigNum.from_str("2"))), _mod.M.CBORValue.new_bytes(priv.to_public().as_bytes())); // x (-2) set to public key
  return {
    signature: (0, _mod.toHex)(coseSign1.to_bytes()),
    key: (0, _mod.toHex)(key.to_bytes())
  };
}
function verifyData(addressHex, keyHash, payload, signedMessage) {
  const cose1 = _mod.M.COSESign1.from_bytes((0, _mod.fromHex)(signedMessage.signature));
  const key = _mod.M.COSEKey.from_bytes((0, _mod.fromHex)(signedMessage.key));
  const protectedHeaders = cose1.headers().protected().deserialized_headers();
  const cose1Address = (() => {
    try {
      var _protectedHeaders$hea;
      return (0, _mod.toHex)((_protectedHeaders$hea = protectedHeaders.header(_mod.M.Label.new_text("address"))) === null || _protectedHeaders$hea === void 0 ? void 0 : _protectedHeaders$hea.as_bytes());
    } catch (_e) {
      throw new Error("No address found in signature.");
    }
  })();
  const cose1AlgorithmId = (() => {
    try {
      var _protectedHeaders$alg, _int$as_positive, _int$as_negative;
      const int = (_protectedHeaders$alg = protectedHeaders.algorithm_id()) === null || _protectedHeaders$alg === void 0 ? void 0 : _protectedHeaders$alg.as_int();
      if (int !== null && int !== void 0 && int.is_positive()) return parseInt((_int$as_positive = int.as_positive()) === null || _int$as_positive === void 0 ? void 0 : _int$as_positive.to_str());
      return parseInt(int === null || int === void 0 || (_int$as_negative = int.as_negative()) === null || _int$as_negative === void 0 ? void 0 : _int$as_negative.to_str());
    } catch (_e) {
      throw new Error("Failed to retrieve Algorithm Id.");
    }
  })();
  const keyAlgorithmId = (() => {
    try {
      var _key$algorithm_id, _int$as_positive2, _int$as_negative2;
      const int = (_key$algorithm_id = key.algorithm_id()) === null || _key$algorithm_id === void 0 ? void 0 : _key$algorithm_id.as_int();
      if (int !== null && int !== void 0 && int.is_positive()) return parseInt((_int$as_positive2 = int.as_positive()) === null || _int$as_positive2 === void 0 ? void 0 : _int$as_positive2.to_str());
      return parseInt(int === null || int === void 0 || (_int$as_negative2 = int.as_negative()) === null || _int$as_negative2 === void 0 ? void 0 : _int$as_negative2.to_str());
    } catch (_e) {
      throw new Error("Failed to retrieve Algorithm Id.");
    }
  })();
  const keyCurve = (() => {
    try {
      var _key$header, _int$as_positive3, _int$as_negative3;
      const int = (_key$header = key.header(_mod.M.Label.new_int(_mod.M.Int.new_negative(_mod.M.BigNum.from_str("1"))))) === null || _key$header === void 0 ? void 0 : _key$header.as_int();
      if (int !== null && int !== void 0 && int.is_positive()) return parseInt((_int$as_positive3 = int.as_positive()) === null || _int$as_positive3 === void 0 ? void 0 : _int$as_positive3.to_str());
      return parseInt(int === null || int === void 0 || (_int$as_negative3 = int.as_negative()) === null || _int$as_negative3 === void 0 ? void 0 : _int$as_negative3.to_str());
    } catch (_e) {
      throw new Error("Failed to retrieve Curve.");
    }
  })();
  const keyType = (() => {
    try {
      var _int$as_positive4, _int$as_negative4;
      const int = key.key_type().as_int();
      if (int !== null && int !== void 0 && int.is_positive()) return parseInt((_int$as_positive4 = int.as_positive()) === null || _int$as_positive4 === void 0 ? void 0 : _int$as_positive4.to_str());
      return parseInt(int === null || int === void 0 || (_int$as_negative4 = int.as_negative()) === null || _int$as_negative4 === void 0 ? void 0 : _int$as_negative4.to_str());
    } catch (_e) {
      throw new Error("Failed to retrieve Key Type.");
    }
  })();
  const publicKey = (() => {
    try {
      var _key$header2;
      return _mod.C.PublicKey.from_bytes((_key$header2 = key.header(_mod.M.Label.new_int(_mod.M.Int.new_negative(_mod.M.BigNum.from_str("2"))))) === null || _key$header2 === void 0 ? void 0 : _key$header2.as_bytes());
    } catch (_e) {
      throw new Error("No public key found.");
    }
  })();
  const cose1Payload = (() => {
    try {
      return (0, _mod.toHex)(cose1.payload());
    } catch (_e) {
      throw new Error("No payload found.");
    }
  })();
  const signature = _mod.C.Ed25519Signature.from_bytes(cose1.signature());
  const data = cose1.signed_data(undefined, undefined).to_bytes();
  if (cose1Address !== addressHex) return false;
  if (keyHash !== publicKey.hash().to_hex()) return false;
  if (cose1AlgorithmId !== keyAlgorithmId && cose1AlgorithmId !== _mod.M.AlgorithmId.EdDSA) {
    return false;
  }
  if (keyCurve !== 6) return false;
  if (keyType !== 1) return false;
  if (cose1Payload !== payload) return false;
  return publicKey.verify(data, signature);
}