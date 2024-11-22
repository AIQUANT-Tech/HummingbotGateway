"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Emulator = void 0;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.flat-map.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.array.unscopables.flat-map.js");
require("core-js/modules/es.json.stringify.js");
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
require("core-js/modules/es.string.includes.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _core = require("../core/core.js");
var _mod = require("../utils/mod.js");
var _utils = require("../utils/utils.js");
class Emulator {
  constructor(accounts) {
    let protocolParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _mod.PROTOCOL_PARAMETERS_DEFAULT;
    Object.defineProperty(this, "ledger", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mempool", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    /**
     * Only stake key registrations/delegations and rewards are tracked.
     * Other certificates are not tracked.
     */
    Object.defineProperty(this, "chain", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, "blockHeight", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "slot", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "protocolParameters", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "datumTable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    const GENESIS_HASH = "00".repeat(32);
    this.blockHeight = 0;
    this.slot = 0;
    this.time = Date.now();
    this.ledger = {};
    accounts.forEach((_ref, index) => {
      let {
        address,
        assets,
        outputData
      } = _ref;
      if ([outputData === null || outputData === void 0 ? void 0 : outputData.hash, outputData === null || outputData === void 0 ? void 0 : outputData.asHash, outputData === null || outputData === void 0 ? void 0 : outputData.inline].filter(b => b).length > 1) {
        throw new Error("Not allowed to set hash, asHash and inline at the same time.");
      }
      this.ledger[GENESIS_HASH + index] = {
        utxo: {
          txHash: GENESIS_HASH,
          outputIndex: index,
          address,
          assets,
          datumHash: outputData !== null && outputData !== void 0 && outputData.asHash ? _core.C.hash_plutus_data(_core.C.PlutusData.from_bytes((0, _utils.fromHex)(outputData.asHash))).to_hex() : outputData === null || outputData === void 0 ? void 0 : outputData.hash,
          datum: outputData === null || outputData === void 0 ? void 0 : outputData.inline,
          scriptRef: outputData === null || outputData === void 0 ? void 0 : outputData.scriptRef
        },
        spent: false
      };
    });
    this.protocolParameters = protocolParameters;
  }
  now() {
    return this.time;
  }
  awaitSlot() {
    let length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.slot += length;
    this.time += length * 1000;
    const currentHeight = this.blockHeight;
    this.blockHeight = Math.floor(this.slot / 20);
    if (this.blockHeight > currentHeight) {
      for (const [outRef, {
        utxo,
        spent
      }] of Object.entries(this.mempool)) {
        this.ledger[outRef] = {
          utxo,
          spent
        };
      }
      for (const [outRef, {
        spent
      }] of Object.entries(this.ledger)) {
        if (spent) delete this.ledger[outRef];
      }
      this.mempool = {};
    }
  }
  awaitBlock() {
    let height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.blockHeight += height;
    this.slot += height * 20;
    this.time += height * 20 * 1000;
    for (const [outRef, {
      utxo,
      spent
    }] of Object.entries(this.mempool)) {
      this.ledger[outRef] = {
        utxo,
        spent
      };
    }
    for (const [outRef, {
      spent
    }] of Object.entries(this.ledger)) {
      if (spent) delete this.ledger[outRef];
    }
    this.mempool = {};
  }
  getUtxos(addressOrCredential) {
    const utxos = Object.values(this.ledger).flatMap(_ref2 => {
      let {
        utxo
      } = _ref2;
      if (typeof addressOrCredential === "string") {
        return addressOrCredential === utxo.address ? utxo : [];
      } else {
        const {
          paymentCredential
        } = (0, _utils.getAddressDetails)(utxo.address);
        return (paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash) === addressOrCredential.hash ? utxo : [];
      }
    });
    return Promise.resolve(utxos);
  }
  getProtocolParameters() {
    return Promise.resolve(this.protocolParameters);
  }
  getDatum(datumHash) {
    return Promise.resolve(this.datumTable[datumHash]);
  }
  getUtxosWithUnit(addressOrCredential, unit) {
    const utxos = Object.values(this.ledger).flatMap(_ref3 => {
      let {
        utxo
      } = _ref3;
      if (typeof addressOrCredential === "string") {
        return addressOrCredential === utxo.address && utxo.assets[unit] > 0n ? utxo : [];
      } else {
        const {
          paymentCredential
        } = (0, _utils.getAddressDetails)(utxo.address);
        return (paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash) === addressOrCredential.hash && utxo.assets[unit] > 0n ? utxo : [];
      }
    });
    return Promise.resolve(utxos);
  }
  getUtxosByOutRef(outRefs) {
    return Promise.resolve(outRefs.flatMap(outRef => {
      var _this$ledger;
      return ((_this$ledger = this.ledger[outRef.txHash + outRef.outputIndex]) === null || _this$ledger === void 0 ? void 0 : _this$ledger.utxo) || [];
    }));
  }
  getUtxoByUnit(unit) {
    const utxos = Object.values(this.ledger).flatMap(_ref4 => {
      let {
        utxo
      } = _ref4;
      return utxo.assets[unit] > 0n ? utxo : [];
    });
    if (utxos.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    return Promise.resolve(utxos[0]);
  }
  getDelegation(rewardAddress) {
    var _this$chain$rewardAdd, _this$chain$rewardAdd2;
    return Promise.resolve({
      poolId: ((_this$chain$rewardAdd = this.chain[rewardAddress]) === null || _this$chain$rewardAdd === void 0 || (_this$chain$rewardAdd = _this$chain$rewardAdd.delegation) === null || _this$chain$rewardAdd === void 0 ? void 0 : _this$chain$rewardAdd.poolId) || null,
      rewards: ((_this$chain$rewardAdd2 = this.chain[rewardAddress]) === null || _this$chain$rewardAdd2 === void 0 || (_this$chain$rewardAdd2 = _this$chain$rewardAdd2.delegation) === null || _this$chain$rewardAdd2 === void 0 ? void 0 : _this$chain$rewardAdd2.rewards) || 0n
    });
  }
  awaitTx(txHash) {
    if (this.mempool[txHash + 0]) {
      this.awaitBlock();
      return Promise.resolve(true);
    }
    return Promise.resolve(true);
  }
  /**
   * Emulates the behaviour of the reward distribution at epoch boundaries.
   * Stake keys need to be registered and delegated like on a real chain in order to receive rewards.
   */
  distributeRewards(rewards) {
    for (const [rewardAddress, {
      registeredStake,
      delegation
    }] of Object.entries(this.chain)) {
      if (registeredStake && delegation.poolId) {
        this.chain[rewardAddress] = {
          registeredStake,
          delegation: {
            poolId: delegation.poolId,
            rewards: delegation.rewards += rewards
          }
        };
      }
    }
    this.awaitBlock();
  }
  submitTx(tx) {
    /*
        Checks that are already handled by the transaction builder:
          - Fee calculation
          - Phase 2 evaluation
          - Input value == Output value (including mint value)
          - Min ada requirement
          - Stake key registration deposit amount
          - Collateral
             Checks that need to be done:
          - Verify witnesses
          - Correct count of scripts and vkeys
          - Stake key registration
          - Withdrawals
          - Validity interval
     */
    const desTx = _core.C.Transaction.from_bytes((0, _utils.fromHex)(tx));
    const body = desTx.body();
    const witnesses = desTx.witness_set();
    const datums = witnesses.plutus_data();
    const txHash = _core.C.hash_transaction(body).to_hex();
    // Validity interval
    // Lower bound is inclusive?
    // Upper bound is inclusive?
    const lowerBound = body.validity_start_interval() ? parseInt(body.validity_start_interval().to_str()) : null;
    const upperBound = body.ttl() ? parseInt(body.ttl().to_str()) : null;
    if (Number.isInteger(lowerBound) && this.slot < lowerBound) {
      throw new Error("Lower bound (".concat(lowerBound, ") not in slot range (").concat(this.slot, ")."));
    }
    if (Number.isInteger(upperBound) && this.slot > upperBound) {
      throw new Error("Upper bound (".concat(upperBound, ") not in slot range (").concat(this.slot, ")."));
    }
    // Datums in witness set
    const datumTable = (() => {
      const table = {};
      for (let i = 0; i < ((datums === null || datums === void 0 ? void 0 : datums.len()) || 0); i++) {
        const datum = datums.get(i);
        const datumHash = _core.C.hash_plutus_data(datum).to_hex();
        table[datumHash] = (0, _utils.toHex)(datum.to_bytes());
      }
      return table;
    })();
    const consumedHashes = new Set();
    // Witness keys
    const keyHashes = (() => {
      const keyHashes = [];
      for (let i = 0; i < (((_witnesses$vkeys = witnesses.vkeys()) === null || _witnesses$vkeys === void 0 ? void 0 : _witnesses$vkeys.len()) || 0); i++) {
        var _witnesses$vkeys;
        const witness = witnesses.vkeys().get(i);
        const publicKey = witness.vkey().public_key();
        const keyHash = publicKey.hash().to_hex();
        if (!publicKey.verify((0, _utils.fromHex)(txHash), witness.signature())) {
          throw new Error("Invalid vkey witness. Key hash: ".concat(keyHash));
        }
        keyHashes.push(keyHash);
      }
      return keyHashes;
    })();
    // We only need this to verify native scripts. The check happens in the CML.
    const edKeyHashes = _core.C.Ed25519KeyHashes.new();
    keyHashes.forEach(keyHash => edKeyHashes.add(_core.C.Ed25519KeyHash.from_hex(keyHash)));
    const nativeHashes = (() => {
      const scriptHashes = [];
      for (let i = 0; i < (((_witnesses$native_scr = witnesses.native_scripts()) === null || _witnesses$native_scr === void 0 ? void 0 : _witnesses$native_scr.len()) || 0); i++) {
        var _witnesses$native_scr;
        const witness = witnesses.native_scripts().get(i);
        const scriptHash = witness.hash(_core.C.ScriptHashNamespace.NativeScript).to_hex();
        if (!witness.verify(Number.isInteger(lowerBound) ? _core.C.BigNum.from_str(lowerBound.toString()) : undefined, Number.isInteger(upperBound) ? _core.C.BigNum.from_str(upperBound.toString()) : undefined, edKeyHashes)) {
          throw new Error("Invalid native script witness. Script hash: ".concat(scriptHash));
        }
        for (let i = 0; i < witness.get_required_signers().len(); i++) {
          const keyHash = witness.get_required_signers().get(i).to_hex();
          consumedHashes.add(keyHash);
        }
        scriptHashes.push(scriptHash);
      }
      return scriptHashes;
    })();
    const nativeHashesOptional = {};
    const plutusHashesOptional = [];
    const plutusHashes = (() => {
      const scriptHashes = [];
      for (let i = 0; i < (((_witnesses$plutus_scr = witnesses.plutus_scripts()) === null || _witnesses$plutus_scr === void 0 ? void 0 : _witnesses$plutus_scr.len()) || 0); i++) {
        var _witnesses$plutus_scr;
        const script = witnesses.plutus_scripts().get(i);
        const scriptHash = script.hash(_core.C.ScriptHashNamespace.PlutusV1).to_hex();
        scriptHashes.push(scriptHash);
      }
      for (let i = 0; i < (((_witnesses$plutus_v2_ = witnesses.plutus_v2_scripts()) === null || _witnesses$plutus_v2_ === void 0 ? void 0 : _witnesses$plutus_v2_.len()) || 0); i++) {
        var _witnesses$plutus_v2_;
        const script = witnesses.plutus_v2_scripts().get(i);
        const scriptHash = script.hash(_core.C.ScriptHashNamespace.PlutusV2).to_hex();
        scriptHashes.push(scriptHash);
      }
      return scriptHashes;
    })();
    const inputs = body.inputs();
    inputs.sort();
    const resolvedInputs = [];
    // Check existence of inputs and look for script refs.
    for (let i = 0; i < inputs.len(); i++) {
      const input = inputs.get(i);
      const outRef = input.transaction_id().to_hex() + input.index().to_str();
      const entryLedger = this.ledger[outRef];
      const {
        entry,
        type
      } = !entryLedger ? {
        entry: this.mempool[outRef],
        type: "Mempool"
      } : {
        entry: entryLedger,
        type: "Ledger"
      };
      if (!entry || entry.spent) {
        throw new Error("Could not spend UTxO: ".concat(JSON.stringify({
          txHash: entry === null || entry === void 0 ? void 0 : entry.utxo.txHash,
          outputIndex: entry === null || entry === void 0 ? void 0 : entry.utxo.outputIndex
        }), "\nIt does not exist or was already spent."));
      }
      const scriptRef = entry.utxo.scriptRef;
      if (scriptRef) {
        switch (scriptRef.type) {
          case "Native":
            {
              const script = _core.C.NativeScript.from_bytes((0, _utils.fromHex)(scriptRef.script));
              nativeHashesOptional[script.hash(_core.C.ScriptHashNamespace.NativeScript).to_hex()] = script;
              break;
            }
          case "PlutusV1":
            {
              const script = _core.C.PlutusScript.from_bytes((0, _utils.fromHex)(scriptRef.script));
              plutusHashesOptional.push(script.hash(_core.C.ScriptHashNamespace.PlutusV1).to_hex());
              break;
            }
          case "PlutusV2":
            {
              const script = _core.C.PlutusScript.from_bytes((0, _utils.fromHex)(scriptRef.script));
              plutusHashesOptional.push(script.hash(_core.C.ScriptHashNamespace.PlutusV2).to_hex());
              break;
            }
        }
      }
      if (entry.utxo.datumHash) consumedHashes.add(entry.utxo.datumHash);
      resolvedInputs.push({
        entry,
        type
      });
    }
    // Check existence of reference inputs and look for script refs.
    for (let i = 0; i < (((_body$reference_input = body.reference_inputs()) === null || _body$reference_input === void 0 ? void 0 : _body$reference_input.len()) || 0); i++) {
      var _body$reference_input;
      const input = body.reference_inputs().get(i);
      const outRef = input.transaction_id().to_hex() + input.index().to_str();
      const entry = this.ledger[outRef] || this.mempool[outRef];
      if (!entry || entry.spent) {
        throw new Error("Could not read UTxO: ".concat(JSON.stringify({
          txHash: entry === null || entry === void 0 ? void 0 : entry.utxo.txHash,
          outputIndex: entry === null || entry === void 0 ? void 0 : entry.utxo.outputIndex
        }), "\nIt does not exist or was already spent."));
      }
      const scriptRef = entry.utxo.scriptRef;
      if (scriptRef) {
        switch (scriptRef.type) {
          case "Native":
            {
              const script = _core.C.NativeScript.from_bytes((0, _utils.fromHex)(scriptRef.script));
              nativeHashesOptional[script.hash(_core.C.ScriptHashNamespace.NativeScript).to_hex()] = script;
              break;
            }
          case "PlutusV1":
            {
              const script = _core.C.PlutusScript.from_bytes((0, _utils.fromHex)(scriptRef.script));
              plutusHashesOptional.push(script.hash(_core.C.ScriptHashNamespace.PlutusV1).to_hex());
              break;
            }
          case "PlutusV2":
            {
              const script = _core.C.PlutusScript.from_bytes((0, _utils.fromHex)(scriptRef.script));
              plutusHashesOptional.push(script.hash(_core.C.ScriptHashNamespace.PlutusV2).to_hex());
              break;
            }
        }
      }
      if (entry.utxo.datumHash) consumedHashes.add(entry.utxo.datumHash);
    }
    const redeemers = (() => {
      const tagMap = {
        0: "Spend",
        1: "Mint",
        2: "Cert",
        3: "Reward"
      };
      const collected = [];
      for (let i = 0; i < (((_witnesses$redeemers = witnesses.redeemers()) === null || _witnesses$redeemers === void 0 ? void 0 : _witnesses$redeemers.len()) || 0); i++) {
        var _witnesses$redeemers;
        const redeemer = witnesses.redeemers().get(i);
        collected.push({
          tag: tagMap[redeemer.tag().kind()],
          index: parseInt(redeemer.index().to_str())
        });
      }
      return collected;
    })();
    function checkAndConsumeHash(credential, tag, index) {
      switch (credential.type) {
        case "Key":
          {
            if (!keyHashes.includes(credential.hash)) {
              throw new Error("Missing vkey witness. Key hash: ".concat(credential.hash));
            }
            consumedHashes.add(credential.hash);
            break;
          }
        case "Script":
          {
            if (nativeHashes.includes(credential.hash)) {
              consumedHashes.add(credential.hash);
              break;
            } else if (nativeHashesOptional[credential.hash]) {
              if (!nativeHashesOptional[credential.hash].verify(Number.isInteger(lowerBound) ? _core.C.BigNum.from_str(lowerBound.toString()) : undefined, Number.isInteger(upperBound) ? _core.C.BigNum.from_str(upperBound.toString()) : undefined, edKeyHashes)) {
                throw new Error("Invalid native script witness. Script hash: ".concat(credential.hash));
              }
              break;
            } else if (plutusHashes.includes(credential.hash) || plutusHashesOptional.includes(credential.hash)) {
              if (redeemers.find(redeemer => redeemer.tag === tag && redeemer.index === index)) {
                consumedHashes.add(credential.hash);
                break;
              }
            }
            throw new Error("Missing script witness. Script hash: ".concat(credential.hash));
          }
      }
    }
    // Check collateral inputs
    for (let i = 0; i < (((_body$collateral = body.collateral()) === null || _body$collateral === void 0 ? void 0 : _body$collateral.len()) || 0); i++) {
      var _body$collateral;
      const input = body.collateral().get(i);
      const outRef = input.transaction_id().to_hex() + input.index().to_str();
      const entry = this.ledger[outRef] || this.mempool[outRef];
      if (!entry || entry.spent) {
        throw new Error("Could not read UTxO: ".concat(JSON.stringify({
          txHash: entry === null || entry === void 0 ? void 0 : entry.utxo.txHash,
          outputIndex: entry === null || entry === void 0 ? void 0 : entry.utxo.outputIndex
        }), "\nIt does not exist or was already spent."));
      }
      const {
        paymentCredential
      } = (0, _utils.getAddressDetails)(entry.utxo.address);
      if ((paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.type) === "Script") {
        throw new Error("Collateral inputs can only contain vkeys.");
      }
      checkAndConsumeHash(paymentCredential, null, null);
    }
    // Check required signers
    for (let i = 0; i < (((_body$required_signer = body.required_signers()) === null || _body$required_signer === void 0 ? void 0 : _body$required_signer.len()) || 0); i++) {
      var _body$required_signer;
      const signer = body.required_signers().get(i);
      checkAndConsumeHash({
        type: "Key",
        hash: signer.to_hex()
      }, null, null);
    }
    // Check mint witnesses
    for (let index = 0; index < (((_body$mint = body.mint()) === null || _body$mint === void 0 ? void 0 : _body$mint.keys().len()) || 0); index++) {
      var _body$mint;
      const policyId = body.mint().keys().get(index).to_hex();
      checkAndConsumeHash({
        type: "Script",
        hash: policyId
      }, "Mint", index);
    }
    // Check withdrawal witnesses
    const withdrawalRequests = [];
    for (let index = 0; index < (((_body$withdrawals = body.withdrawals()) === null || _body$withdrawals === void 0 ? void 0 : _body$withdrawals.keys().len()) || 0); index++) {
      var _body$withdrawals, _this$chain$rewardAdd3;
      const rawAddress = body.withdrawals().keys().get(index);
      const withdrawal = BigInt(body.withdrawals().get(rawAddress).to_str());
      const rewardAddress = rawAddress.to_address().to_bech32(undefined);
      const {
        stakeCredential
      } = (0, _utils.getAddressDetails)(rewardAddress);
      checkAndConsumeHash(stakeCredential, "Reward", index);
      if (((_this$chain$rewardAdd3 = this.chain[rewardAddress]) === null || _this$chain$rewardAdd3 === void 0 ? void 0 : _this$chain$rewardAdd3.delegation.rewards) !== withdrawal) {
        throw new Error("Withdrawal amount doesn't match actual reward balance.");
      }
      withdrawalRequests.push({
        rewardAddress,
        withdrawal
      });
    }
    // Check cert witnesses
    const certRequests = [];
    for (let index = 0; index < (((_body$certs = body.certs()) === null || _body$certs === void 0 ? void 0 : _body$certs.len()) || 0); index++) {
      var _body$certs;
      /*
        Checking only:
        1. Stake registration
        2. Stake deregistration
        3. Stake delegation
               All other certificate types are not checked and considered valid.
      */
      const cert = body.certs().get(index);
      switch (cert.kind()) {
        case 0:
          {
            var _this$chain$rewardAdd4;
            const registration = cert.as_stake_registration();
            const rewardAddress = _core.C.RewardAddress.new(_core.C.NetworkInfo.testnet().network_id(), registration.stake_credential()).to_address().to_bech32(undefined);
            if ((_this$chain$rewardAdd4 = this.chain[rewardAddress]) !== null && _this$chain$rewardAdd4 !== void 0 && _this$chain$rewardAdd4.registeredStake) {
              throw new Error("Stake key is already registered. Reward address: ".concat(rewardAddress));
            }
            certRequests.push({
              type: "Registration",
              rewardAddress
            });
            break;
          }
        case 1:
          {
            var _this$chain$rewardAdd5;
            const deregistration = cert.as_stake_deregistration();
            const rewardAddress = _core.C.RewardAddress.new(_core.C.NetworkInfo.testnet().network_id(), deregistration.stake_credential()).to_address().to_bech32(undefined);
            const {
              stakeCredential
            } = (0, _utils.getAddressDetails)(rewardAddress);
            checkAndConsumeHash(stakeCredential, "Cert", index);
            if (!((_this$chain$rewardAdd5 = this.chain[rewardAddress]) !== null && _this$chain$rewardAdd5 !== void 0 && _this$chain$rewardAdd5.registeredStake)) {
              throw new Error("Stake key is already deregistered. Reward address: ".concat(rewardAddress));
            }
            certRequests.push({
              type: "Deregistration",
              rewardAddress
            });
            break;
          }
        case 2:
          {
            var _this$chain$rewardAdd6;
            const delegation = cert.as_stake_delegation();
            const rewardAddress = _core.C.RewardAddress.new(_core.C.NetworkInfo.testnet().network_id(), delegation.stake_credential()).to_address().to_bech32(undefined);
            const poolId = delegation.pool_keyhash().to_bech32("pool");
            const {
              stakeCredential
            } = (0, _utils.getAddressDetails)(rewardAddress);
            checkAndConsumeHash(stakeCredential, "Cert", index);
            if (!((_this$chain$rewardAdd6 = this.chain[rewardAddress]) !== null && _this$chain$rewardAdd6 !== void 0 && _this$chain$rewardAdd6.registeredStake) && !certRequests.find(request => request.type === "Registration" && request.rewardAddress === rewardAddress)) {
              throw new Error("Stake key is not registered. Reward address: ".concat(rewardAddress));
            }
            certRequests.push({
              type: "Delegation",
              rewardAddress,
              poolId
            });
            break;
          }
      }
    }
    // Check input witnesses
    resolvedInputs.forEach((_ref5, index) => {
      let {
        entry: {
          utxo
        }
      } = _ref5;
      const {
        paymentCredential
      } = (0, _utils.getAddressDetails)(utxo.address);
      checkAndConsumeHash(paymentCredential, "Spend", index);
    });
    // Create outputs and consume datum hashes
    const outputs = (() => {
      const collected = [];
      for (let i = 0; i < body.outputs().len(); i++) {
        const output = body.outputs().get(i);
        const unspentOutput = _core.C.TransactionUnspentOutput.new(_core.C.TransactionInput.new(_core.C.TransactionHash.from_hex(txHash), _core.C.BigNum.from_str(i.toString())), output);
        const utxo = (0, _utils.coreToUtxo)(unspentOutput);
        if (utxo.datumHash) consumedHashes.add(utxo.datumHash);
        collected.push({
          utxo,
          spent: false
        });
      }
      return collected;
    })();
    // Check consumed witnesses
    const [extraKeyHash] = keyHashes.filter(keyHash => !consumedHashes.has(keyHash));
    if (extraKeyHash) {
      throw new Error("Extraneous vkey witness. Key hash: ".concat(extraKeyHash));
    }
    const [extraNativeHash] = nativeHashes.filter(scriptHash => !consumedHashes.has(scriptHash));
    if (extraNativeHash) {
      throw new Error("Extraneous native script. Script hash: ".concat(extraNativeHash));
    }
    const [extraPlutusHash] = plutusHashes.filter(scriptHash => !consumedHashes.has(scriptHash));
    if (extraPlutusHash) {
      throw new Error("Extraneous plutus script. Script hash: ".concat(extraPlutusHash));
    }
    const [extraDatumHash] = Object.keys(datumTable).filter(datumHash => !consumedHashes.has(datumHash));
    if (extraDatumHash) {
      throw new Error("Extraneous plutus data. Datum hash: ".concat(extraDatumHash));
    }
    // Apply transitions
    resolvedInputs.forEach(_ref6 => {
      let {
        entry,
        type
      } = _ref6;
      const outRef = entry.utxo.txHash + entry.utxo.outputIndex;
      entry.spent = true;
      if (type === "Ledger") this.ledger[outRef] = entry;else if (type === "Mempool") this.mempool[outRef] = entry;
    });
    withdrawalRequests.forEach(_ref7 => {
      let {
        rewardAddress,
        withdrawal
      } = _ref7;
      this.chain[rewardAddress].delegation.rewards -= withdrawal;
    });
    certRequests.forEach(_ref8 => {
      let {
        type,
        rewardAddress,
        poolId
      } = _ref8;
      switch (type) {
        case "Registration":
          {
            if (this.chain[rewardAddress]) {
              this.chain[rewardAddress].registeredStake = true;
            } else {
              this.chain[rewardAddress] = {
                registeredStake: true,
                delegation: {
                  poolId: null,
                  rewards: 0n
                }
              };
            }
            break;
          }
        case "Deregistration":
          {
            this.chain[rewardAddress].registeredStake = false;
            this.chain[rewardAddress].delegation.poolId = null;
            break;
          }
        case "Delegation":
          {
            this.chain[rewardAddress].delegation.poolId = poolId;
          }
      }
    });
    outputs.forEach(_ref9 => {
      let {
        utxo,
        spent
      } = _ref9;
      this.mempool[utxo.txHash + utxo.outputIndex] = {
        utxo,
        spent
      };
    });
    for (const [datumHash, datum] of Object.entries(datumTable)) {
      this.datumTable[datumHash] = datum;
    }
    return Promise.resolve(txHash);
  }
  log() {
    function getRandomColor(unit) {
      const seed = unit === "lovelace" ? "1" : unit;
      // Convert the seed string to a number
      let num = 0;
      for (let i = 0; i < seed.length; i++) {
        num += seed.charCodeAt(i);
      }
      // Generate a color based on the seed number
      const r = num * 123 % 256;
      const g = num * 321 % 256;
      const b = num * 213 % 256;
      // Return the color as a hex string
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    const totalBalances = {};
    const balances = {};
    for (const {
      utxo
    } of Object.values(this.ledger)) {
      for (const [unit, quantity] of Object.entries(utxo.assets)) {
        var _balances$utxo$addres;
        if (!balances[utxo.address]) {
          balances[utxo.address] = {
            [unit]: quantity
          };
        } else if (!((_balances$utxo$addres = balances[utxo.address]) !== null && _balances$utxo$addres !== void 0 && _balances$utxo$addres[unit])) {
          balances[utxo.address][unit] = quantity;
        } else {
          balances[utxo.address][unit] += quantity;
        }
        if (!totalBalances[unit]) {
          totalBalances[unit] = quantity;
        } else {
          totalBalances[unit] += quantity;
        }
      }
    }
    console.log("\n%cBlockchain state", "color:purple");
    console.log("\n    Block height:   %c".concat(this.blockHeight, "%c\n    Slot:           %c").concat(this.slot, "%c\n    Unix time:      %c").concat(this.time, "\n  "), "color:yellow", "color:white", "color:yellow", "color:white", "color:yellow");
    console.log("\n");
    for (const [address, assets] of Object.entries(balances)) {
      console.log("Address: %c".concat(address), "color:blue", "\n");
      for (const [unit, quantity] of Object.entries(assets)) {
        const barLength = Math.max(Math.floor(60 * (Number(quantity) / Number(totalBalances[unit]))), 1);
        console.log("%c".concat("\u2586".repeat(barLength) + " ".repeat(60 - barLength)), "color: ".concat(getRandomColor(unit)), "", "".concat(unit, ":"), quantity, "");
      }
      console.log("\n".concat("\u2581".repeat(60), "\n"));
    }
  }
}
exports.Emulator = Emulator;