"use strict";

require("core-js/modules/es.array.push.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Maestro = void 0;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.object.from-entries.js");
require("core-js/modules/es.parse-float.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url-search-params.js");
require("core-js/modules/web.url-search-params.delete.js");
require("core-js/modules/web.url-search-params.has.js");
require("core-js/modules/web.url-search-params.size.js");
var _mod = require("../core/mod.js");
var _mod2 = require("../utils/mod.js");
var _package = _interopRequireDefault(require("../../package.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Maestro {
  constructor(_ref) {
    let {
      network,
      apiKey,
      turboSubmit = false
    } = _ref;
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "apiKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "turboSubmit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.url = "https://".concat(network, ".gomaestro-api.org/v1");
    this.apiKey = apiKey;
    this.turboSubmit = turboSubmit;
  }
  async getProtocolParameters() {
    const timestampedResult = await fetch("".concat(this.url, "/protocol-parameters"), {
      headers: this.commonHeaders()
    }).then(res => res.json());
    const result = timestampedResult.data;
    // Decimal numbers in Maestro are given as ratio of two numbers represented by string of format "firstNumber/secondNumber".
    const decimalFromRationalString = str => {
      const forwardSlashIndex = str.indexOf("/");
      return parseInt(str.slice(0, forwardSlashIndex)) / parseInt(str.slice(forwardSlashIndex + 1));
    };
    // To rename keys in an object by the given key-map.
    // deno-lint-ignore no-explicit-any
    const renameKeysAndSort = (obj, newKeys) => {
      const entries = Object.keys(obj).sort().map(key => {
        const newKey = newKeys[key] || key;
        return {
          [newKey]: Object.fromEntries(Object.entries(obj[key]).sort((_ref2, _ref3) => {
            let [k, _v] = _ref2;
            let [k2, _v2] = _ref3;
            return k.localeCompare(k2);
          }))
        };
      });
      return Object.assign({}, ...entries);
    };
    return {
      minFeeA: parseInt(result.min_fee_coefficient),
      minFeeB: parseInt(result.min_fee_constant.ada.lovelace),
      maxTxSize: parseInt(result.max_transaction_size.bytes),
      maxValSize: parseInt(result.max_value_size.bytes),
      keyDeposit: BigInt(result.stake_credential_deposit.ada.lovelace),
      poolDeposit: BigInt(result.stake_pool_deposit.ada.lovelace),
      priceMem: decimalFromRationalString(result.script_execution_prices.memory),
      priceStep: decimalFromRationalString(result.script_execution_prices.cpu),
      maxTxExMem: BigInt(result.max_execution_units_per_transaction.memory),
      maxTxExSteps: BigInt(result.max_execution_units_per_transaction.cpu),
      coinsPerUtxoByte: BigInt(result.min_utxo_deposit_coefficient),
      collateralPercentage: parseInt(result.collateral_percentage),
      maxCollateralInputs: parseInt(result.max_collateral_inputs),
      costModels: renameKeysAndSort(result.plutus_cost_models, {
        "plutus_v1": "PlutusV1",
        "plutus_v2": "PlutusV2",
        "plutus_v3": "PlutusV3"
      }),
      minfeeRefscriptCostPerByte: parseFloat(result.min_fee_reference_scripts.base)
    };
  }
  async getUtxosInternal(addressOrCredential, unit) {
    const queryPredicate = (() => {
      if (typeof addressOrCredential === "string") {
        return "/addresses/" + addressOrCredential;
      }
      let credentialBech32Query = "/addresses/cred/";
      credentialBech32Query += addressOrCredential.type === "Key" ? _mod.C.Ed25519KeyHash.from_hex(addressOrCredential.hash).to_bech32("addr_vkh") : _mod.C.ScriptHash.from_hex(addressOrCredential.hash).to_bech32("addr_shared_vkh");
      return credentialBech32Query;
    })();
    const qparams = new URLSearchParams(_objectSpread({
      count: "100"
    }, unit && {
      asset: unit
    }));
    const result = await this.getAllPagesData(async qry => await fetch(qry, {
      headers: this.commonHeaders()
    }), "".concat(this.url).concat(queryPredicate, "/utxos"), qparams, "Location: getUtxosInternal. Error: Could not fetch UTxOs from Maestro");
    return result.map(this.maestroUtxoToUtxo);
  }
  getUtxos(addressOrCredential) {
    return this.getUtxosInternal(addressOrCredential);
  }
  getUtxosWithUnit(addressOrCredential, unit) {
    return this.getUtxosInternal(addressOrCredential, unit);
  }
  async getUtxoByUnit(unit) {
    const timestampedAddressesResponse = await fetch("".concat(this.url, "/assets/").concat(unit, "/addresses?count=2"), {
      headers: this.commonHeaders()
    });
    const timestampedAddresses = await timestampedAddressesResponse.json();
    if (!timestampedAddressesResponse.ok) {
      if (timestampedAddresses.message) {
        throw new Error(timestampedAddresses.message);
      }
      throw new Error("Location: getUtxoByUnit. Error: Couldn't perform query. Received status code: " + timestampedAddressesResponse.status);
    }
    const addressesWithAmount = timestampedAddresses.data;
    if (addressesWithAmount.length === 0) {
      throw new Error("Location: getUtxoByUnit. Error: Unit not found.");
    }
    if (addressesWithAmount.length > 1) {
      throw new Error("Location: getUtxoByUnit. Error: Unit needs to be an NFT or only held by one address.");
    }
    const address = addressesWithAmount[0].address;
    const utxos = await this.getUtxosWithUnit(address, unit);
    if (utxos.length > 1) {
      throw new Error("Location: getUtxoByUnit. Error: Unit needs to be an NFT or only held by one address.");
    }
    return utxos[0];
  }
  async getUtxosByOutRef(outRefs) {
    const qry = "".concat(this.url, "/transactions/outputs");
    const body = JSON.stringify(outRefs.map(_ref4 => {
      let {
        txHash,
        outputIndex
      } = _ref4;
      return "".concat(txHash, "#").concat(outputIndex);
    }));
    const utxos = await this.getAllPagesData(async qry => await fetch(qry, {
      method: "POST",
      headers: _objectSpread({
        "Content-Type": "application/json"
      }, this.commonHeaders()),
      body: body
    }), qry, new URLSearchParams({}), "Location: getUtxosByOutRef. Error: Could not fetch UTxOs by references from Maestro");
    return utxos.map(this.maestroUtxoToUtxo);
  }
  async getDelegation(rewardAddress) {
    const timestampedResultResponse = await fetch("".concat(this.url, "/accounts/").concat(rewardAddress), {
      headers: this.commonHeaders()
    });
    if (!timestampedResultResponse.ok) {
      return {
        poolId: null,
        rewards: 0n
      };
    }
    const timestampedResult = await timestampedResultResponse.json();
    const result = timestampedResult.data;
    return {
      poolId: result.delegated_pool || null,
      rewards: BigInt(result.rewards_available)
    };
  }
  async getDatum(datumHash) {
    const timestampedResultResponse = await fetch("".concat(this.url, "/datum/").concat(datumHash), {
      headers: this.commonHeaders()
    });
    if (!timestampedResultResponse.ok) {
      if (timestampedResultResponse.status === 404) {
        throw new Error("No datum found for datum hash: ".concat(datumHash));
      } else {
        throw new Error("Location: getDatum. Error: Couldn't successfully perform query. Received status code: " + timestampedResultResponse.status);
      }
    }
    const timestampedResult = await timestampedResultResponse.json();
    return timestampedResult.data.bytes;
  }
  awaitTx(txHash) {
    let checkInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
    return new Promise(res => {
      const confirmation = setInterval(async () => {
        const isConfirmedResponse = await fetch("".concat(this.url, "/transactions/").concat(txHash, "/cbor"), {
          headers: this.commonHeaders()
        });
        if (isConfirmedResponse.ok) {
          await isConfirmedResponse.json();
          clearInterval(confirmation);
          await new Promise(res => setTimeout(() => res(1), 1000));
          return res(true);
        }
      }, checkInterval);
    });
  }
  async submitTx(tx) {
    let queryUrl = "".concat(this.url, "/txmanager");
    queryUrl += this.turboSubmit ? "/turbosubmit" : "";
    const response = await fetch(queryUrl, {
      method: "POST",
      headers: _objectSpread({
        "Content-Type": "application/cbor",
        "Accept": "text/plain"
      }, this.commonHeaders()),
      body: (0, _mod2.fromHex)(tx)
    });
    const result = await response.text();
    if (!response.ok) {
      if (response.status === 400) throw new Error(result);else {
        throw new Error("Could not submit transaction. Received status code: " + response.status);
      }
    }
    return result;
  }
  commonHeaders() {
    return {
      "api-key": this.apiKey,
      lucid
    };
  }
  maestroUtxoToUtxo(result) {
    var _result$datum;
    return {
      txHash: result.tx_hash,
      outputIndex: result.index,
      assets: (() => {
        const a = {};
        result.assets.forEach(am => {
          a[am.unit] = BigInt(am.amount);
        });
        return a;
      })(),
      address: result.address,
      datumHash: result.datum ? result.datum.type == "inline" ? undefined : result.datum.hash : undefined,
      datum: (_result$datum = result.datum) === null || _result$datum === void 0 ? void 0 : _result$datum.bytes,
      scriptRef: result.reference_script ? result.reference_script.type == "native" ? undefined : {
        type: result.reference_script.type == "plutusv1" ? "PlutusV1" : "PlutusV2",
        script: (0, _mod2.applyDoubleCborEncoding)(result.reference_script.bytes)
      } : undefined
    };
  }
  async getAllPagesData(getResponse, qry, paramsGiven, errorMsg) {
    let nextCursor = null;
    let result = [];
    while (true) {
      if (nextCursor !== null) {
        paramsGiven.set("cursor", nextCursor);
      }
      const response = await getResponse("".concat(qry, "?") + paramsGiven);
      const pageResult = await response.json();
      if (!response.ok) {
        throw new Error("".concat(errorMsg, ". Received status code: ").concat(response.status));
      }
      nextCursor = pageResult.next_cursor;
      result = result.concat(pageResult.data);
      if (nextCursor == null) break;
    }
    return result;
  }
}
exports.Maestro = Maestro;
const lucid = _package.default.version; // Lucid version