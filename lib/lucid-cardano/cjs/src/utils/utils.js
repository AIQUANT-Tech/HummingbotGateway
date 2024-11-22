"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = void 0;
exports.addAssets = addAssets;
exports.applyDoubleCborEncoding = applyDoubleCborEncoding;
exports.applyParamsToScript = applyParamsToScript;
exports.assetsToValue = assetsToValue;
exports.coreToUtxo = coreToUtxo;
exports.fromHex = fromHex;
exports.fromLabel = fromLabel;
exports.fromScriptRef = fromScriptRef;
exports.fromText = fromText;
exports.fromUnit = fromUnit;
exports.generatePrivateKey = generatePrivateKey;
exports.generateSeedPhrase = generateSeedPhrase;
exports.getAddressDetails = getAddressDetails;
exports.nativeScriptFromJson = nativeScriptFromJson;
exports.networkToId = networkToId;
exports.paymentCredentialOf = paymentCredentialOf;
exports.stakeCredentialOf = stakeCredentialOf;
exports.toHex = toHex;
exports.toLabel = toLabel;
exports.toPublicKey = toPublicKey;
exports.toScriptRef = toScriptRef;
exports.toText = toText;
exports.toUnit = toUnit;
exports.utxoToCore = utxoToCore;
exports.valueToAssets = valueToAssets;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.object.has-own.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.set.difference.v2.js");
require("core-js/modules/es.set.intersection.v2.js");
require("core-js/modules/es.set.is-disjoint-from.v2.js");
require("core-js/modules/es.set.is-subset-of.v2.js");
require("core-js/modules/es.set.is-superset-of.v2.js");
require("core-js/modules/es.set.symmetric-difference.v2.js");
require("core-js/modules/es.set.union.v2.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _hex = require("../../deps/deno.land/std@0.100.0/encoding/hex.js");
var _mod = require("../core/mod.js");
var _bip = require("../misc/bip39.js");
var _crc = require("../misc/crc8.js");
var _time = require("../plutus/time.js");
var _data = require("../plutus/data.js");
class Utils {
  constructor(lucid) {
    Object.defineProperty(this, "lucid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.lucid = lucid;
  }
  validatorToAddress(validator, stakeCredential) {
    const validatorHash = this.validatorToScriptHash(validator);
    if (stakeCredential) {
      return _mod.C.BaseAddress.new(networkToId(this.lucid.network), _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(validatorHash)), stakeCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_hex(stakeCredential.hash)) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(stakeCredential.hash))).to_address().to_bech32(undefined);
    } else {
      return _mod.C.EnterpriseAddress.new(networkToId(this.lucid.network), _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(validatorHash))).to_address().to_bech32(undefined);
    }
  }
  credentialToAddress(paymentCredential, stakeCredential) {
    if (stakeCredential) {
      return _mod.C.BaseAddress.new(networkToId(this.lucid.network), paymentCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_hex(paymentCredential.hash)) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(paymentCredential.hash)), stakeCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_hex(stakeCredential.hash)) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(stakeCredential.hash))).to_address().to_bech32(undefined);
    } else {
      return _mod.C.EnterpriseAddress.new(networkToId(this.lucid.network), paymentCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_hex(paymentCredential.hash)) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(paymentCredential.hash))).to_address().to_bech32(undefined);
    }
  }
  validatorToRewardAddress(validator) {
    const validatorHash = this.validatorToScriptHash(validator);
    return _mod.C.RewardAddress.new(networkToId(this.lucid.network), _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(validatorHash))).to_address().to_bech32(undefined);
  }
  credentialToRewardAddress(stakeCredential) {
    return _mod.C.RewardAddress.new(networkToId(this.lucid.network), stakeCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_hex(stakeCredential.hash)) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(stakeCredential.hash))).to_address().to_bech32(undefined);
  }
  validatorToScriptHash(validator) {
    switch (validator.type) {
      case "Native":
        return _mod.C.NativeScript.from_bytes(fromHex(validator.script)).hash(_mod.C.ScriptHashNamespace.NativeScript).to_hex();
      case "PlutusV1":
        return _mod.C.PlutusScript.from_bytes(fromHex(applyDoubleCborEncoding(validator.script))).hash(_mod.C.ScriptHashNamespace.PlutusV1).to_hex();
      case "PlutusV2":
        return _mod.C.PlutusScript.from_bytes(fromHex(applyDoubleCborEncoding(validator.script))).hash(_mod.C.ScriptHashNamespace.PlutusV2).to_hex();
      default:
        throw new Error("No variant matched");
    }
  }
  mintingPolicyToId(mintingPolicy) {
    return this.validatorToScriptHash(mintingPolicy);
  }
  datumToHash(datum) {
    return _mod.C.hash_plutus_data(_mod.C.PlutusData.from_bytes(fromHex(datum))).to_hex();
  }
  scriptHashToCredential(scriptHash) {
    return {
      type: "Script",
      hash: scriptHash
    };
  }
  keyHashToCredential(keyHash) {
    return {
      type: "Key",
      hash: keyHash
    };
  }
  generatePrivateKey() {
    return generatePrivateKey();
  }
  generateSeedPhrase() {
    return generateSeedPhrase();
  }
  unixTimeToSlot(unixTime) {
    return (0, _time.unixTimeToEnclosingSlot)(unixTime, _time.SLOT_CONFIG_NETWORK[this.lucid.network]);
  }
  slotToUnixTime(slot) {
    return (0, _time.slotToBeginUnixTime)(slot, _time.SLOT_CONFIG_NETWORK[this.lucid.network]);
  }
  /** Address can be in Bech32 or Hex. */
  getAddressDetails(address) {
    return getAddressDetails(address);
  }
  /**
   * Convert a native script from Json to the Hex representation.
   * It follows this Json format: https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/simple-scripts.md
   */
  nativeScriptFromJson(nativeScript) {
    return nativeScriptFromJson(nativeScript);
  }
  paymentCredentialOf(address) {
    return paymentCredentialOf(address);
  }
  stakeCredentialOf(rewardAddress) {
    return stakeCredentialOf(rewardAddress);
  }
}
exports.Utils = Utils;
function addressFromHexOrBech32(address) {
  try {
    return _mod.C.Address.from_bytes(fromHex(address));
  } catch (_e) {
    try {
      return _mod.C.Address.from_bech32(address);
    } catch (_e) {
      throw new Error("Could not deserialize address.");
    }
  }
}
/** Address can be in Bech32 or Hex. */
function getAddressDetails(address) {
  // Base Address
  try {
    const parsedAddress = _mod.C.BaseAddress.from_address(addressFromHexOrBech32(address));
    const paymentCredential = parsedAddress.payment_cred().kind() === 0 ? {
      type: "Key",
      hash: toHex(parsedAddress.payment_cred().to_keyhash().to_bytes())
    } : {
      type: "Script",
      hash: toHex(parsedAddress.payment_cred().to_scripthash().to_bytes())
    };
    const stakeCredential = parsedAddress.stake_cred().kind() === 0 ? {
      type: "Key",
      hash: toHex(parsedAddress.stake_cred().to_keyhash().to_bytes())
    } : {
      type: "Script",
      hash: toHex(parsedAddress.stake_cred().to_scripthash().to_bytes())
    };
    return {
      type: "Base",
      networkId: parsedAddress.to_address().network_id(),
      address: {
        bech32: parsedAddress.to_address().to_bech32(undefined),
        hex: toHex(parsedAddress.to_address().to_bytes())
      },
      paymentCredential,
      stakeCredential
    };
  } catch (_e) {/* pass */}
  // Enterprise Address
  try {
    const parsedAddress = _mod.C.EnterpriseAddress.from_address(addressFromHexOrBech32(address));
    const paymentCredential = parsedAddress.payment_cred().kind() === 0 ? {
      type: "Key",
      hash: toHex(parsedAddress.payment_cred().to_keyhash().to_bytes())
    } : {
      type: "Script",
      hash: toHex(parsedAddress.payment_cred().to_scripthash().to_bytes())
    };
    return {
      type: "Enterprise",
      networkId: parsedAddress.to_address().network_id(),
      address: {
        bech32: parsedAddress.to_address().to_bech32(undefined),
        hex: toHex(parsedAddress.to_address().to_bytes())
      },
      paymentCredential
    };
  } catch (_e) {/* pass */}
  // Pointer Address
  try {
    const parsedAddress = _mod.C.PointerAddress.from_address(addressFromHexOrBech32(address));
    const paymentCredential = parsedAddress.payment_cred().kind() === 0 ? {
      type: "Key",
      hash: toHex(parsedAddress.payment_cred().to_keyhash().to_bytes())
    } : {
      type: "Script",
      hash: toHex(parsedAddress.payment_cred().to_scripthash().to_bytes())
    };
    return {
      type: "Pointer",
      networkId: parsedAddress.to_address().network_id(),
      address: {
        bech32: parsedAddress.to_address().to_bech32(undefined),
        hex: toHex(parsedAddress.to_address().to_bytes())
      },
      paymentCredential
    };
  } catch (_e) {/* pass */}
  // Reward Address
  try {
    const parsedAddress = _mod.C.RewardAddress.from_address(addressFromHexOrBech32(address));
    const stakeCredential = parsedAddress.payment_cred().kind() === 0 ? {
      type: "Key",
      hash: toHex(parsedAddress.payment_cred().to_keyhash().to_bytes())
    } : {
      type: "Script",
      hash: toHex(parsedAddress.payment_cred().to_scripthash().to_bytes())
    };
    return {
      type: "Reward",
      networkId: parsedAddress.to_address().network_id(),
      address: {
        bech32: parsedAddress.to_address().to_bech32(undefined),
        hex: toHex(parsedAddress.to_address().to_bytes())
      },
      stakeCredential
    };
  } catch (_e) {/* pass */}
  // Limited support for Byron addresses
  try {
    const parsedAddress = (address => {
      try {
        return _mod.C.ByronAddress.from_bytes(fromHex(address));
      } catch (_e) {
        try {
          return _mod.C.ByronAddress.from_base58(address);
        } catch (_e) {
          throw new Error("Could not deserialize address.");
        }
      }
    })(address);
    return {
      type: "Byron",
      networkId: parsedAddress.network_id(),
      address: {
        bech32: "",
        hex: toHex(parsedAddress.to_address().to_bytes())
      }
    };
  } catch (_e) {/* pass */}
  throw new Error("No address type matched for: " + address);
}
function paymentCredentialOf(address) {
  const {
    paymentCredential
  } = getAddressDetails(address);
  if (!paymentCredential) {
    throw new Error("The specified address does not contain a payment credential.");
  }
  return paymentCredential;
}
function stakeCredentialOf(rewardAddress) {
  const {
    stakeCredential
  } = getAddressDetails(rewardAddress);
  if (!stakeCredential) {
    throw new Error("The specified address does not contain a stake credential.");
  }
  return stakeCredential;
}
function generatePrivateKey() {
  return _mod.C.PrivateKey.generate_ed25519().to_bech32();
}
function generateSeedPhrase() {
  return (0, _bip.generateMnemonic)(256);
}
function valueToAssets(value) {
  const assets = {};
  assets["lovelace"] = BigInt(value.coin().to_str());
  const ma = value.multiasset();
  if (ma) {
    const multiAssets = ma.keys();
    for (let j = 0; j < multiAssets.len(); j++) {
      const policy = multiAssets.get(j);
      const policyAssets = ma.get(policy);
      const assetNames = policyAssets.keys();
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k);
        const quantity = policyAssets.get(policyAsset);
        const unit = toHex(policy.to_bytes()) + toHex(policyAsset.name());
        assets[unit] = BigInt(quantity.to_str());
      }
    }
  }
  return assets;
}
function assetsToValue(assets) {
  const multiAsset = _mod.C.MultiAsset.new();
  const lovelace = assets["lovelace"];
  const units = Object.keys(assets);
  const policies = Array.from(new Set(units.filter(unit => unit !== "lovelace").map(unit => unit.slice(0, 56))));
  policies.forEach(policy => {
    const policyUnits = units.filter(unit => unit.slice(0, 56) === policy);
    const assetsValue = _mod.C.Assets.new();
    policyUnits.forEach(unit => {
      assetsValue.insert(_mod.C.AssetName.new(fromHex(unit.slice(56))), _mod.C.BigNum.from_str(assets[unit].toString()));
    });
    multiAsset.insert(_mod.C.ScriptHash.from_bytes(fromHex(policy)), assetsValue);
  });
  const value = _mod.C.Value.new(_mod.C.BigNum.from_str(lovelace ? lovelace.toString() : "0"));
  if (units.length > 1 || !lovelace) value.set_multiasset(multiAsset);
  return value;
}
function fromScriptRef(scriptRef) {
  const kind = scriptRef.get().kind();
  switch (kind) {
    case 0:
      return {
        type: "Native",
        script: toHex(scriptRef.get().as_native().to_bytes())
      };
    case 1:
      return {
        type: "PlutusV1",
        script: toHex(scriptRef.get().as_plutus_v1().to_bytes())
      };
    case 2:
      return {
        type: "PlutusV2",
        script: toHex(scriptRef.get().as_plutus_v2().to_bytes())
      };
    default:
      throw new Error("No variant matched.");
  }
}
function toScriptRef(script) {
  switch (script.type) {
    case "Native":
      return _mod.C.ScriptRef.new(_mod.C.Script.new_native(_mod.C.NativeScript.from_bytes(fromHex(script.script))));
    case "PlutusV1":
      return _mod.C.ScriptRef.new(_mod.C.Script.new_plutus_v1(_mod.C.PlutusScript.from_bytes(fromHex(applyDoubleCborEncoding(script.script)))));
    case "PlutusV2":
      return _mod.C.ScriptRef.new(_mod.C.Script.new_plutus_v2(_mod.C.PlutusScript.from_bytes(fromHex(applyDoubleCborEncoding(script.script)))));
    default:
      throw new Error("No variant matched.");
  }
}
function utxoToCore(utxo) {
  const address = (() => {
    try {
      return _mod.C.Address.from_bech32(utxo.address);
    } catch (_e) {
      return _mod.C.ByronAddress.from_base58(utxo.address).to_address();
    }
  })();
  const output = _mod.C.TransactionOutput.new(address, assetsToValue(utxo.assets));
  if (utxo.datumHash) {
    output.set_datum(_mod.C.Datum.new_data_hash(_mod.C.DataHash.from_bytes(fromHex(utxo.datumHash))));
  }
  // inline datum
  if (!utxo.datumHash && utxo.datum) {
    output.set_datum(_mod.C.Datum.new_data(_mod.C.Data.new(_mod.C.PlutusData.from_bytes(fromHex(utxo.datum)))));
  }
  if (utxo.scriptRef) {
    output.set_script_ref(toScriptRef(utxo.scriptRef));
  }
  return _mod.C.TransactionUnspentOutput.new(_mod.C.TransactionInput.new(_mod.C.TransactionHash.from_bytes(fromHex(utxo.txHash)), _mod.C.BigNum.from_str(utxo.outputIndex.toString())), output);
}
function coreToUtxo(coreUtxo) {
  var _coreUtxo$output$addr, _coreUtxo$output, _coreUtxo$output2, _coreUtxo$output3;
  return {
    txHash: toHex(coreUtxo.input().transaction_id().to_bytes()),
    outputIndex: parseInt(coreUtxo.input().index().to_str()),
    assets: valueToAssets(coreUtxo.output().amount()),
    address: coreUtxo.output().address().as_byron() ? (_coreUtxo$output$addr = coreUtxo.output().address().as_byron()) === null || _coreUtxo$output$addr === void 0 ? void 0 : _coreUtxo$output$addr.to_base58() : coreUtxo.output().address().to_bech32(undefined),
    datumHash: (_coreUtxo$output = coreUtxo.output()) === null || _coreUtxo$output === void 0 || (_coreUtxo$output = _coreUtxo$output.datum()) === null || _coreUtxo$output === void 0 || (_coreUtxo$output = _coreUtxo$output.as_data_hash()) === null || _coreUtxo$output === void 0 ? void 0 : _coreUtxo$output.to_hex(),
    datum: ((_coreUtxo$output2 = coreUtxo.output()) === null || _coreUtxo$output2 === void 0 || (_coreUtxo$output2 = _coreUtxo$output2.datum()) === null || _coreUtxo$output2 === void 0 ? void 0 : _coreUtxo$output2.as_data()) && toHex(coreUtxo.output().datum().as_data().get().to_bytes()),
    scriptRef: ((_coreUtxo$output3 = coreUtxo.output()) === null || _coreUtxo$output3 === void 0 ? void 0 : _coreUtxo$output3.script_ref()) && fromScriptRef(coreUtxo.output().script_ref())
  };
}
function networkToId(network) {
  switch (network) {
    case "Preview":
      return 0;
    case "Preprod":
      return 0;
    case "Custom":
      return 0;
    case "Mainnet":
      return 1;
    default:
      throw new Error("Network not found");
  }
}
function fromHex(hex) {
  return (0, _hex.decodeString)(hex);
}
function toHex(bytes) {
  return (0, _hex.encodeToString)(bytes);
}
/** Convert a Hex encoded string to a Utf-8 encoded string. */
function toText(hex) {
  return new TextDecoder().decode((0, _hex.decode)(new TextEncoder().encode(hex)));
}
/** Convert a Utf-8 encoded string to a Hex encoded string. */
function fromText(text) {
  return toHex(new TextEncoder().encode(text));
}
function toPublicKey(privateKey) {
  return _mod.C.PrivateKey.from_bech32(privateKey).to_public().to_bech32();
}
/** Padded number in Hex. */
function checksum(num) {
  return (0, _crc.crc8)(fromHex(num)).toString(16).padStart(2, "0");
}
function toLabel(num) {
  if (num < 0 || num > 65535) {
    throw new Error("Label ".concat(num, " out of range: min label 1 - max label 65535."));
  }
  const numHex = num.toString(16).padStart(4, "0");
  return "0" + numHex + checksum(numHex) + "0";
}
function fromLabel(label) {
  if (label.length !== 8 || !(label[0] === "0" && label[7] === "0")) {
    return null;
  }
  const numHex = label.slice(1, 5);
  const num = parseInt(numHex, 16);
  const check = label.slice(5, 7);
  return check === checksum(numHex) ? num : null;
}
/**
 * @param name Hex encoded
 */
function toUnit(policyId, name, label) {
  const hexLabel = Number.isInteger(label) ? toLabel(label) : "";
  const n = name ? name : "";
  if ((n + hexLabel).length > 64) {
    throw new Error("Asset name size exceeds 32 bytes.");
  }
  if (policyId.length !== 56) {
    throw new Error("Policy id invalid: ".concat(policyId, "."));
  }
  return policyId + hexLabel + n;
}
/**
 * Splits unit into policy id, asset name (entire asset name), name (asset name without label) and label if applicable.
 * name will be returned in Hex.
 */
function fromUnit(unit) {
  const policyId = unit.slice(0, 56);
  const assetName = unit.slice(56) || null;
  const label = fromLabel(unit.slice(56, 64));
  const name = (() => {
    const hexName = Number.isInteger(label) ? unit.slice(64) : unit.slice(56);
    return hexName || null;
  })();
  return {
    policyId,
    assetName,
    name,
    label
  };
}
/**
 * Convert a native script from Json to the Hex representation.
 * It follows this Json format: https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/simple-scripts.md
 */
function nativeScriptFromJson(nativeScript) {
  return {
    type: "Native",
    script: toHex(_mod.C.encode_json_str_to_native_script(JSON.stringify(nativeScript), "", _mod.C.ScriptSchema.Node).to_bytes())
  };
}
function applyParamsToScript(plutusScript, params, type) {
  const p = type ? _data.Data.castTo(params, type) : params;
  return toHex(_mod.C.apply_params_to_plutus_script(_mod.C.PlutusList.from_bytes(fromHex(_data.Data.to(p))), _mod.C.PlutusScript.from_bytes(fromHex(applyDoubleCborEncoding(plutusScript)))).to_bytes());
}
/** Returns double cbor encoded script. If script is already double cbor encoded it's returned as it is. */
function applyDoubleCborEncoding(script) {
  try {
    _mod.C.PlutusScript.from_bytes(_mod.C.PlutusScript.from_bytes(fromHex(script)).bytes());
    return script;
  } catch (_e) {
    return toHex(_mod.C.PlutusScript.new(fromHex(script)).to_bytes());
  }
}
function addAssets() {
  for (var _len = arguments.length, assets = new Array(_len), _key = 0; _key < _len; _key++) {
    assets[_key] = arguments[_key];
  }
  return assets.reduce((a, b) => {
    for (const k in b) {
      if (Object.hasOwn(b, k)) {
        a[k] = (a[k] || 0n) + b[k];
      }
    }
    return a;
  }, {});
}