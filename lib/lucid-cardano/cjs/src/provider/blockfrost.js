"use strict";

require("core-js/modules/es.array.push.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockfrost = void 0;
exports.datumJsonToCbor = datumJsonToCbor;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.object.from-entries.js");
require("core-js/modules/es.parse-float.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.set.difference.v2.js");
require("core-js/modules/es.set.intersection.v2.js");
require("core-js/modules/es.set.is-disjoint-from.v2.js");
require("core-js/modules/es.set.is-subset-of.v2.js");
require("core-js/modules/es.set.is-superset-of.v2.js");
require("core-js/modules/es.set.symmetric-difference.v2.js");
require("core-js/modules/es.set.union.v2.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _mod = require("../core/mod.js");
var _mod2 = require("../utils/mod.js");
var _package = _interopRequireDefault(require("../../package.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Blockfrost {
  constructor(url, projectId) {
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "projectId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.url = url;
    this.projectId = projectId || "";
  }
  async getProtocolParameters() {
    const result = await fetch("".concat(this.url, "/epochs/latest/parameters"), {
      headers: {
        project_id: this.projectId,
        lucid
      }
    }).then(res => res.json());
    return {
      minFeeA: parseInt(result.min_fee_a),
      minFeeB: parseInt(result.min_fee_b),
      maxTxSize: parseInt(result.max_tx_size),
      maxValSize: parseInt(result.max_val_size),
      keyDeposit: BigInt(result.key_deposit),
      poolDeposit: BigInt(result.pool_deposit),
      priceMem: parseFloat(result.price_mem),
      priceStep: parseFloat(result.price_step),
      maxTxExMem: BigInt(result.max_tx_ex_mem),
      maxTxExSteps: BigInt(result.max_tx_ex_steps),
      coinsPerUtxoByte: BigInt(result.coins_per_utxo_size),
      collateralPercentage: parseInt(result.collateral_percent),
      maxCollateralInputs: parseInt(result.max_collateral_inputs),
      costModels: result.cost_models,
      minfeeRefscriptCostPerByte: parseInt(result.min_fee_ref_script_cost_per_byte)
    };
  }
  async getUtxos(addressOrCredential) {
    const queryPredicate = (() => {
      if (typeof addressOrCredential === "string") return addressOrCredential;
      const credentialBech32 = addressOrCredential.type === "Key" ? _mod.C.Ed25519KeyHash.from_hex(addressOrCredential.hash).to_bech32("addr_vkh") : _mod.C.ScriptHash.from_hex(addressOrCredential.hash).to_bech32("addr_vkh"); // should be 'script' (CIP-0005)
      return credentialBech32;
    })();
    let result = [];
    let page = 1;
    while (true) {
      const pageResult = await fetch("".concat(this.url, "/addresses/").concat(queryPredicate, "/utxos?page=").concat(page), {
        headers: {
          project_id: this.projectId,
          lucid
        }
      }).then(res => res.json());
      if (pageResult.error) {
        if (pageResult.status_code === 404) {
          return [];
        } else {
          throw new Error("Could not fetch UTxOs from Blockfrost. Try again.");
        }
      }
      result = result.concat(pageResult);
      if (pageResult.length <= 0) break;
      page++;
    }
    return this.blockfrostUtxosToUtxos(result);
  }
  async getUtxosWithUnit(addressOrCredential, unit) {
    const queryPredicate = (() => {
      if (typeof addressOrCredential === "string") return addressOrCredential;
      const credentialBech32 = addressOrCredential.type === "Key" ? _mod.C.Ed25519KeyHash.from_hex(addressOrCredential.hash).to_bech32("addr_vkh") : _mod.C.ScriptHash.from_hex(addressOrCredential.hash).to_bech32("addr_vkh"); // should be 'script' (CIP-0005)
      return credentialBech32;
    })();
    let result = [];
    let page = 1;
    while (true) {
      const pageResult = await fetch("".concat(this.url, "/addresses/").concat(queryPredicate, "/utxos/").concat(unit, "?page=").concat(page), {
        headers: {
          project_id: this.projectId,
          lucid
        }
      }).then(res => res.json());
      if (pageResult.error) {
        if (pageResult.status_code === 404) {
          return [];
        } else {
          throw new Error("Could not fetch UTxOs from Blockfrost. Try again.");
        }
      }
      result = result.concat(pageResult);
      if (pageResult.length <= 0) break;
      page++;
    }
    return this.blockfrostUtxosToUtxos(result);
  }
  async getUtxoByUnit(unit) {
    const addresses = await fetch("".concat(this.url, "/assets/").concat(unit, "/addresses?count=2"), {
      headers: {
        project_id: this.projectId,
        lucid
      }
    }).then(res => res.json());
    if (!addresses || addresses.error) {
      throw new Error("Unit not found.");
    }
    if (addresses.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    const address = addresses[0].address;
    const utxos = await this.getUtxosWithUnit(address, unit);
    if (utxos.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    return utxos[0];
  }
  async getUtxosByOutRef(outRefs) {
    // TODO: Make sure old already spent UTxOs are not retrievable.
    const queryHashes = [...new Set(outRefs.map(outRef => outRef.txHash))];
    const utxos = await Promise.all(queryHashes.map(async txHash => {
      const result = await fetch("".concat(this.url, "/txs/").concat(txHash, "/utxos"), {
        headers: {
          project_id: this.projectId,
          lucid
        }
      }).then(res => res.json());
      if (!result || result.error) {
        return [];
      }
      const utxosResult = result.outputs.map((
      // deno-lint-ignore no-explicit-any
      r) => _objectSpread(_objectSpread({}, r), {}, {
        tx_hash: txHash
      }));
      return this.blockfrostUtxosToUtxos(utxosResult);
    }));
    return utxos.reduce((acc, utxos) => acc.concat(utxos), []).filter(utxo => outRefs.some(outRef => utxo.txHash === outRef.txHash && utxo.outputIndex === outRef.outputIndex));
  }
  async getDelegation(rewardAddress) {
    const result = await fetch("".concat(this.url, "/accounts/").concat(rewardAddress), {
      headers: {
        project_id: this.projectId,
        lucid
      }
    }).then(res => res.json());
    if (!result || result.error) {
      return {
        poolId: null,
        rewards: 0n
      };
    }
    return {
      poolId: result.pool_id || null,
      rewards: BigInt(result.withdrawable_amount)
    };
  }
  async getDatum(datumHash) {
    const datum = await fetch("".concat(this.url, "/scripts/datum/").concat(datumHash, "/cbor"), {
      headers: {
        project_id: this.projectId,
        lucid
      }
    }).then(res => res.json()).then(res => res.cbor);
    if (!datum || datum.error) {
      throw new Error("No datum found for datum hash: ".concat(datumHash));
    }
    return datum;
  }
  awaitTx(txHash) {
    let checkInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
    return new Promise(res => {
      const confirmation = setInterval(async () => {
        const isConfirmed = await fetch("".concat(this.url, "/txs/").concat(txHash), {
          headers: {
            project_id: this.projectId,
            lucid
          }
        }).then(res => res.json());
        if (isConfirmed && !isConfirmed.error) {
          clearInterval(confirmation);
          await new Promise(res => setTimeout(() => res(1), 1000));
          return res(true);
        }
      }, checkInterval);
    });
  }
  async submitTx(tx) {
    const result = await fetch("".concat(this.url, "/tx/submit"), {
      method: "POST",
      headers: {
        "Content-Type": "application/cbor",
        project_id: this.projectId,
        lucid
      },
      body: (0, _mod2.fromHex)(tx)
    }).then(res => res.json());
    if (!result || result.error) {
      if ((result === null || result === void 0 ? void 0 : result.status_code) === 400) throw new Error(result.message);else throw new Error("Could not submit transaction.");
    }
    return result;
  }
  async blockfrostUtxosToUtxos(result) {
    return await Promise.all(result.map(async r => ({
      txHash: r.tx_hash,
      outputIndex: r.output_index,
      assets: Object.fromEntries(r.amount.map(_ref => {
        let {
          unit,
          quantity
        } = _ref;
        return [unit, BigInt(quantity)];
      })),
      address: r.address,
      datumHash: !r.inline_datum && r.data_hash || undefined,
      datum: r.inline_datum || undefined,
      scriptRef: r.reference_script_hash ? await (async () => {
        const {
          type
        } = await fetch("".concat(this.url, "/scripts/").concat(r.reference_script_hash), {
          headers: {
            project_id: this.projectId,
            lucid
          }
        }).then(res => res.json());
        // TODO: support native scripts
        if (type === "Native" || type === "native") {
          throw new Error("Native script ref not implemented!");
        }
        const {
          cbor: script
        } = await fetch("".concat(this.url, "/scripts/").concat(r.reference_script_hash, "/cbor"), {
          headers: {
            project_id: this.projectId,
            lucid
          }
        }).then(res => res.json());
        return {
          type: type === "plutusV1" ? "PlutusV1" : "PlutusV2",
          script: (0, _mod2.applyDoubleCborEncoding)(script)
        };
      })() : undefined
    })));
  }
}
/**
 * This function is temporarily needed only, until Blockfrost returns the datum natively in Cbor.
 * The conversion is ambigious, that's why it's better to get the datum directly in Cbor.
 */
exports.Blockfrost = Blockfrost;
function datumJsonToCbor(json) {
  const convert = json => {
    if (!isNaN(json.int)) {
      return _mod.C.PlutusData.new_integer(_mod.C.BigInt.from_str(json.int.toString()));
    } else if (json.bytes || !isNaN(Number(json.bytes))) {
      return _mod.C.PlutusData.new_bytes((0, _mod2.fromHex)(json.bytes));
    } else if (json.map) {
      const m = _mod.C.PlutusMap.new();
      json.map.forEach(_ref2 => {
        let {
          k,
          v
        } = _ref2;
        m.insert(convert(k), convert(v));
      });
      return _mod.C.PlutusData.new_map(m);
    } else if (json.list) {
      const l = _mod.C.PlutusList.new();
      json.list.forEach(v => {
        l.add(convert(v));
      });
      return _mod.C.PlutusData.new_list(l);
    } else if (!isNaN(json.constructor)) {
      const l = _mod.C.PlutusList.new();
      json.fields.forEach(v => {
        l.add(convert(v));
      });
      return _mod.C.PlutusData.new_constr_plutus_data(_mod.C.ConstrPlutusData.new(_mod.C.BigNum.from_str(json.constructor.toString()), l));
    }
    throw new Error("Unsupported type");
  };
  return (0, _mod2.toHex)(convert(json).to_bytes());
}
const lucid = _package.default.version; // Lucid version