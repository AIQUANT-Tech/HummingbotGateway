"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tx = void 0;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array-buffer.constructor.js");
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.array-buffer.detached.js");
require("core-js/modules/es.array-buffer.transfer.js");
require("core-js/modules/es.array-buffer.transfer-to-fixed-length.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.string.replace-all.js");
require("core-js/modules/es.typed-array.uint8-array.js");
require("core-js/modules/es.typed-array.uint32-array.js");
require("core-js/modules/es.typed-array.at.js");
require("core-js/modules/es.typed-array.fill.js");
require("core-js/modules/es.typed-array.find-last.js");
require("core-js/modules/es.typed-array.find-last-index.js");
require("core-js/modules/es.typed-array.from.js");
require("core-js/modules/es.typed-array.set.js");
require("core-js/modules/es.typed-array.sort.js");
require("core-js/modules/es.typed-array.to-locale-string.js");
require("core-js/modules/es.typed-array.to-reversed.js");
require("core-js/modules/es.typed-array.to-sorted.js");
require("core-js/modules/es.typed-array.with.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _mod = require("../core/mod.js");
var _mod2 = require("../mod.js");
var _mod3 = require("../utils/mod.js");
var _utils = require("../utils/utils.js");
var _tx_complete = require("./tx_complete.js");
class Tx {
  constructor(lucid) {
    Object.defineProperty(this, "txBuilder", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    /** Stores the tx instructions, which get executed after calling .complete() */
    Object.defineProperty(this, "tasks", {
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
    this.txBuilder = _mod.C.TransactionBuilder.new(this.lucid.txBuilderConfig);
    this.tasks = [];
  }
  /** Read data from utxos. These utxos are only referenced and not spent. */
  readFrom(utxos) {
    this.tasks.push(async that => {
      for (const utxo of utxos) {
        if (utxo.datumHash) {
          utxo.datum = _mod2.Data.to(await that.lucid.datumOf(utxo));
          // Add datum to witness set, so it can be read from validators
          const plutusData = _mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(utxo.datum));
          that.txBuilder.add_plutus_data(plutusData);
        }
        const coreUtxo = (0, _mod3.utxoToCore)(utxo);
        that.txBuilder.add_reference_input(coreUtxo);
      }
    });
    return this;
  }
  /**
   * A public key or native script input.
   * With redeemer it's a plutus script input.
   */
  collectFrom(utxos, redeemer) {
    this.tasks.push(async that => {
      for (const utxo of utxos) {
        if (utxo.datumHash && !utxo.datum) {
          utxo.datum = _mod2.Data.to(await that.lucid.datumOf(utxo));
        }
        const coreUtxo = (0, _mod3.utxoToCore)(utxo);
        that.txBuilder.add_input(coreUtxo, redeemer && _mod.C.ScriptWitness.new_plutus_witness(_mod.C.PlutusWitness.new(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(redeemer)), utxo.datumHash && utxo.datum ? _mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(utxo.datum)) : undefined, undefined)));
      }
    });
    return this;
  }
  /**
   * All assets should be of the same policy id.
   * You can chain mintAssets functions together if you need to mint assets with different policy ids.
   * If the plutus script doesn't need a redeemer, you still need to specifiy the void redeemer.
   */
  mintAssets(assets, redeemer) {
    this.tasks.push(that => {
      const units = Object.keys(assets);
      const policyId = units[0].slice(0, 56);
      const mintAssets = _mod.C.MintAssets.new();
      units.forEach(unit => {
        if (unit.slice(0, 56) !== policyId) {
          throw new Error("Only one policy id allowed. You can chain multiple mintAssets functions together if you need to mint assets with different policy ids.");
        }
        mintAssets.insert(_mod.C.AssetName.new((0, _mod3.fromHex)(unit.slice(56))), _mod.C.Int.from_str(assets[unit].toString()));
      });
      const scriptHash = _mod.C.ScriptHash.from_bytes((0, _mod3.fromHex)(policyId));
      that.txBuilder.add_mint(scriptHash, mintAssets, redeemer ? _mod.C.ScriptWitness.new_plutus_witness(_mod.C.PlutusWitness.new(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(redeemer)), undefined, undefined)) : undefined);
    });
    return this;
  }
  /** Pay to a public key or native script address. */
  payToAddress(address, assets) {
    this.tasks.push(that => {
      const output = _mod.C.TransactionOutput.new(addressFromWithNetworkCheck(address, that.lucid), (0, _mod3.assetsToValue)(assets));
      that.txBuilder.add_output(output);
    });
    return this;
  }
  /** Pay to a public key or native script address with datum or scriptRef. */
  payToAddressWithData(address, outputData, assets) {
    this.tasks.push(that => {
      if (typeof outputData === "string") {
        outputData = {
          asHash: outputData
        };
      }
      if ([outputData.hash, outputData.asHash, outputData.inline].filter(b => b).length > 1) {
        throw new Error("Not allowed to set hash, asHash and inline at the same time.");
      }
      const output = _mod.C.TransactionOutput.new(addressFromWithNetworkCheck(address, that.lucid), (0, _mod3.assetsToValue)(assets));
      if (outputData.hash) {
        output.set_datum(_mod.C.Datum.new_data_hash(_mod.C.DataHash.from_hex(outputData.hash)));
      } else if (outputData.asHash) {
        const plutusData = _mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(outputData.asHash));
        output.set_datum(_mod.C.Datum.new_data_hash(_mod.C.hash_plutus_data(plutusData)));
        that.txBuilder.add_plutus_data(plutusData);
      } else if (outputData.inline) {
        const plutusData = _mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(outputData.inline));
        output.set_datum(_mod.C.Datum.new_data(_mod.C.Data.new(plutusData)));
      }
      const script = outputData.scriptRef;
      if (script) {
        output.set_script_ref((0, _mod3.toScriptRef)(script));
      }
      that.txBuilder.add_output(output);
    });
    return this;
  }
  /** Pay to a plutus script address with datum or scriptRef. */
  payToContract(address, outputData, assets) {
    if (typeof outputData === "string") {
      outputData = {
        asHash: outputData
      };
    }
    if (!(outputData.hash || outputData.asHash || outputData.inline)) {
      throw new Error("No datum set. Script output becomes unspendable without datum.");
    }
    return this.payToAddressWithData(address, outputData, assets);
  }
  /** Delegate to a stake pool. */
  delegateTo(rewardAddress, poolId, redeemer) {
    this.tasks.push(that => {
      const addressDetails = that.lucid.utils.getAddressDetails(rewardAddress);
      if (addressDetails.type !== "Reward" || !addressDetails.stakeCredential) {
        throw new Error("Not a reward address provided.");
      }
      const credential = addressDetails.stakeCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_bytes((0, _mod3.fromHex)(addressDetails.stakeCredential.hash))) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_bytes((0, _mod3.fromHex)(addressDetails.stakeCredential.hash)));
      that.txBuilder.add_certificate(_mod.C.Certificate.new_stake_delegation(_mod.C.StakeDelegation.new(credential, _mod.C.Ed25519KeyHash.from_bech32(poolId))), redeemer ? _mod.C.ScriptWitness.new_plutus_witness(_mod.C.PlutusWitness.new(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(redeemer)), undefined, undefined)) : undefined);
    });
    return this;
  }
  /** Register a reward address in order to delegate to a pool and receive rewards. */
  registerStake(rewardAddress) {
    this.tasks.push(that => {
      const addressDetails = that.lucid.utils.getAddressDetails(rewardAddress);
      if (addressDetails.type !== "Reward" || !addressDetails.stakeCredential) {
        throw new Error("Not a reward address provided.");
      }
      const credential = addressDetails.stakeCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_bytes((0, _mod3.fromHex)(addressDetails.stakeCredential.hash))) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_bytes((0, _mod3.fromHex)(addressDetails.stakeCredential.hash)));
      that.txBuilder.add_certificate(_mod.C.Certificate.new_stake_registration(_mod.C.StakeRegistration.new(credential)), undefined);
    });
    return this;
  }
  /** Deregister a reward address. */
  deregisterStake(rewardAddress, redeemer) {
    this.tasks.push(that => {
      const addressDetails = that.lucid.utils.getAddressDetails(rewardAddress);
      if (addressDetails.type !== "Reward" || !addressDetails.stakeCredential) {
        throw new Error("Not a reward address provided.");
      }
      const credential = addressDetails.stakeCredential.type === "Key" ? _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_bytes((0, _mod3.fromHex)(addressDetails.stakeCredential.hash))) : _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_bytes((0, _mod3.fromHex)(addressDetails.stakeCredential.hash)));
      that.txBuilder.add_certificate(_mod.C.Certificate.new_stake_deregistration(_mod.C.StakeDeregistration.new(credential)), redeemer ? _mod.C.ScriptWitness.new_plutus_witness(_mod.C.PlutusWitness.new(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(redeemer)), undefined, undefined)) : undefined);
    });
    return this;
  }
  /** Register a stake pool. A pool deposit is required. The metadataUrl needs to be hosted already before making the registration. */
  registerPool(poolParams) {
    this.tasks.push(async that => {
      const poolRegistration = await createPoolRegistration(poolParams, that.lucid);
      const certificate = _mod.C.Certificate.new_pool_registration(poolRegistration);
      that.txBuilder.add_certificate(certificate, undefined);
    });
    return this;
  }
  /** Update a stake pool. No pool deposit is required. The metadataUrl needs to be hosted already before making the update. */
  updatePool(poolParams) {
    this.tasks.push(async that => {
      const poolRegistration = await createPoolRegistration(poolParams, that.lucid);
      // This flag makes sure a pool deposit is not required
      poolRegistration.set_is_update(true);
      const certificate = _mod.C.Certificate.new_pool_registration(poolRegistration);
      that.txBuilder.add_certificate(certificate, undefined);
    });
    return this;
  }
  /**
   * Retire a stake pool. The epoch needs to be the greater than the current epoch + 1 and less than current epoch + eMax.
   * The pool deposit will be sent to reward address as reward after full retirement of the pool.
   */
  retirePool(poolId, epoch) {
    this.tasks.push(that => {
      const certificate = _mod.C.Certificate.new_pool_retirement(_mod.C.PoolRetirement.new(_mod.C.Ed25519KeyHash.from_bech32(poolId), epoch));
      that.txBuilder.add_certificate(certificate, undefined);
    });
    return this;
  }
  withdraw(rewardAddress, amount, redeemer) {
    this.tasks.push(that => {
      that.txBuilder.add_withdrawal(_mod.C.RewardAddress.from_address(addressFromWithNetworkCheck(rewardAddress, that.lucid)), _mod.C.BigNum.from_str(amount.toString()), redeemer ? _mod.C.ScriptWitness.new_plutus_witness(_mod.C.PlutusWitness.new(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(redeemer)), undefined, undefined)) : undefined);
    });
    return this;
  }
  /**
   * Needs to be a public key address.
   * The PaymentKeyHash is taken when providing a Base, Enterprise or Pointer address.
   * The StakeKeyHash is taken when providing a Reward address.
   */
  addSigner(address) {
    const addressDetails = this.lucid.utils.getAddressDetails(address);
    if (!addressDetails.paymentCredential && !addressDetails.stakeCredential) {
      throw new Error("Not a valid address.");
    }
    const credential = addressDetails.type === "Reward" ? addressDetails.stakeCredential : addressDetails.paymentCredential;
    if (credential.type === "Script") {
      throw new Error("Only key hashes are allowed as signers.");
    }
    return this.addSignerKey(credential.hash);
  }
  /** Add a payment or stake key hash as a required signer of the transaction. */
  addSignerKey(keyHash) {
    this.tasks.push(that => {
      that.txBuilder.add_required_signer(_mod.C.Ed25519KeyHash.from_bytes((0, _mod3.fromHex)(keyHash)));
    });
    return this;
  }
  validFrom(unixTime) {
    this.tasks.push(that => {
      const slot = that.lucid.utils.unixTimeToSlot(unixTime);
      that.txBuilder.set_validity_start_interval(_mod.C.BigNum.from_str(slot.toString()));
    });
    return this;
  }
  validTo(unixTime) {
    this.tasks.push(that => {
      const slot = that.lucid.utils.unixTimeToSlot(unixTime);
      that.txBuilder.set_ttl(_mod.C.BigNum.from_str(slot.toString()));
    });
    return this;
  }
  attachMetadata(label, metadata) {
    this.tasks.push(that => {
      that.txBuilder.add_json_metadatum(_mod.C.BigNum.from_str(label.toString()), JSON.stringify(metadata));
    });
    return this;
  }
  /** Converts strings to bytes if prefixed with **'0x'**. */
  attachMetadataWithConversion(label, metadata) {
    this.tasks.push(that => {
      that.txBuilder.add_json_metadatum_with_schema(_mod.C.BigNum.from_str(label.toString()), JSON.stringify(metadata), _mod.C.MetadataJsonSchema.BasicConversions);
    });
    return this;
  }
  /** Explicitely set the network id in the transaction body. */
  addNetworkId(id) {
    this.tasks.push(that => {
      that.txBuilder.set_network_id(_mod.C.NetworkId.from_bytes((0, _mod3.fromHex)(id.toString(16).padStart(2, "0"))));
    });
    return this;
  }
  attachSpendingValidator(spendingValidator) {
    this.tasks.push(that => {
      attachScript(that, spendingValidator);
    });
    return this;
  }
  attachMintingPolicy(mintingPolicy) {
    this.tasks.push(that => {
      attachScript(that, mintingPolicy);
    });
    return this;
  }
  attachCertificateValidator(certValidator) {
    this.tasks.push(that => {
      attachScript(that, certValidator);
    });
    return this;
  }
  attachWithdrawalValidator(withdrawalValidator) {
    this.tasks.push(that => {
      attachScript(that, withdrawalValidator);
    });
    return this;
  }
  /** Compose transactions. */
  compose(tx) {
    if (tx) this.tasks = this.tasks.concat(tx.tasks);
    return this;
  }
  async complete(options) {
    var _options$change, _options$change2, _options$change3, _options$change4;
    if ([options === null || options === void 0 || (_options$change = options.change) === null || _options$change === void 0 || (_options$change = _options$change.outputData) === null || _options$change === void 0 ? void 0 : _options$change.hash, options === null || options === void 0 || (_options$change2 = options.change) === null || _options$change2 === void 0 || (_options$change2 = _options$change2.outputData) === null || _options$change2 === void 0 ? void 0 : _options$change2.asHash, options === null || options === void 0 || (_options$change3 = options.change) === null || _options$change3 === void 0 || (_options$change3 = _options$change3.outputData) === null || _options$change3 === void 0 ? void 0 : _options$change3.inline].filter(b => b).length > 1) {
      throw new Error("Not allowed to set hash, asHash and inline at the same time.");
    }
    let task = this.tasks.shift();
    while (task) {
      await task(this);
      task = this.tasks.shift();
    }
    const utxos = await this.lucid.wallet.getUtxosCore();
    const changeAddress = addressFromWithNetworkCheck((options === null || options === void 0 || (_options$change4 = options.change) === null || _options$change4 === void 0 ? void 0 : _options$change4.address) || (await this.lucid.wallet.address()), this.lucid);
    if (options !== null && options !== void 0 && options.coinSelection || (options === null || options === void 0 ? void 0 : options.coinSelection) === undefined) {
      this.txBuilder.add_inputs_from(utxos, changeAddress, Uint32Array.from([200, 1000, 1500, 800, 800, 5000 // weight utxos
      ]));
    }
    this.txBuilder.balance(changeAddress, ((_options$change5, _options$change6, _options$change7) => {
      if (options !== null && options !== void 0 && (_options$change5 = options.change) !== null && _options$change5 !== void 0 && (_options$change5 = _options$change5.outputData) !== null && _options$change5 !== void 0 && _options$change5.hash) {
        return _mod.C.Datum.new_data_hash(_mod.C.DataHash.from_hex(options.change.outputData.hash));
      } else if (options !== null && options !== void 0 && (_options$change6 = options.change) !== null && _options$change6 !== void 0 && (_options$change6 = _options$change6.outputData) !== null && _options$change6 !== void 0 && _options$change6.asHash) {
        this.txBuilder.add_plutus_data(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(options.change.outputData.asHash)));
        return _mod.C.Datum.new_data_hash(_mod.C.hash_plutus_data(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(options.change.outputData.asHash))));
      } else if (options !== null && options !== void 0 && (_options$change7 = options.change) !== null && _options$change7 !== void 0 && (_options$change7 = _options$change7.outputData) !== null && _options$change7 !== void 0 && _options$change7.inline) {
        return _mod.C.Datum.new_data(_mod.C.Data.new(_mod.C.PlutusData.from_bytes((0, _mod3.fromHex)(options.change.outputData.inline))));
      } else {
        return undefined;
      }
    })());
    return new _tx_complete.TxComplete(this.lucid, await this.txBuilder.construct(utxos, changeAddress, (options === null || options === void 0 ? void 0 : options.nativeUplc) === undefined ? true : options === null || options === void 0 ? void 0 : options.nativeUplc));
  }
  /** Return the current transaction body in Hex encoded Cbor. */
  async toString() {
    let task = this.tasks.shift();
    while (task) {
      await task(this);
      task = this.tasks.shift();
    }
    return (0, _mod3.toHex)(this.txBuilder.to_bytes());
  }
}
exports.Tx = Tx;
function attachScript(tx, _ref) {
  let {
    type,
    script
  } = _ref;
  if (type === "Native") {
    return tx.txBuilder.add_native_script(_mod.C.NativeScript.from_bytes((0, _mod3.fromHex)(script)));
  } else if (type === "PlutusV1") {
    return tx.txBuilder.add_plutus_script(_mod.C.PlutusScript.from_bytes((0, _mod3.fromHex)((0, _utils.applyDoubleCborEncoding)(script))));
  } else if (type === "PlutusV2") {
    return tx.txBuilder.add_plutus_v2_script(_mod.C.PlutusScript.from_bytes((0, _mod3.fromHex)((0, _utils.applyDoubleCborEncoding)(script))));
  }
  throw new Error("No variant matched.");
}
async function createPoolRegistration(poolParams, lucid) {
  const poolOwners = _mod.C.Ed25519KeyHashes.new();
  poolParams.owners.forEach(owner => {
    const {
      stakeCredential
    } = lucid.utils.getAddressDetails(owner);
    if ((stakeCredential === null || stakeCredential === void 0 ? void 0 : stakeCredential.type) === "Key") {
      poolOwners.add(_mod.C.Ed25519KeyHash.from_hex(stakeCredential.hash));
    } else throw new Error("Only key hashes allowed for pool owners.");
  });
  const metadata = poolParams.metadataUrl ? await fetch(poolParams.metadataUrl).then(res => res.arrayBuffer()) : null;
  const metadataHash = metadata ? _mod.C.PoolMetadataHash.from_bytes(_mod.C.hash_blake2b256(new Uint8Array(metadata))) : null;
  const relays = _mod.C.Relays.new();
  poolParams.relays.forEach(relay => {
    switch (relay.type) {
      case "SingleHostIp":
        {
          const ipV4 = relay.ipV4 ? _mod.C.Ipv4.new(new Uint8Array(relay.ipV4.split(".").map(b => parseInt(b)))) : undefined;
          const ipV6 = relay.ipV6 ? _mod.C.Ipv6.new((0, _mod3.fromHex)(relay.ipV6.replaceAll(":", ""))) : undefined;
          relays.add(_mod.C.Relay.new_single_host_addr(_mod.C.SingleHostAddr.new(relay.port, ipV4, ipV6)));
          break;
        }
      case "SingleHostDomainName":
        {
          relays.add(_mod.C.Relay.new_single_host_name(_mod.C.SingleHostName.new(relay.port, _mod.C.DNSRecordAorAAAA.new(relay.domainName))));
          break;
        }
      case "MultiHost":
        {
          relays.add(_mod.C.Relay.new_multi_host_name(_mod.C.MultiHostName.new(_mod.C.DNSRecordSRV.new(relay.domainName))));
          break;
        }
    }
  });
  return _mod.C.PoolRegistration.new(_mod.C.PoolParams.new(_mod.C.Ed25519KeyHash.from_bech32(poolParams.poolId), _mod.C.VRFKeyHash.from_hex(poolParams.vrfKeyHash), _mod.C.BigNum.from_str(poolParams.pledge.toString()), _mod.C.BigNum.from_str(poolParams.cost.toString()), _mod.C.UnitInterval.from_float(poolParams.margin), _mod.C.RewardAddress.from_address(addressFromWithNetworkCheck(poolParams.rewardAddress, lucid)), poolOwners, relays, metadataHash ? _mod.C.PoolMetadata.new(_mod.C.Url.new(poolParams.metadataUrl), metadataHash) : undefined));
}
function addressFromWithNetworkCheck(address, lucid) {
  const {
    type,
    networkId
  } = lucid.utils.getAddressDetails(address);
  const actualNetworkId = (0, _mod3.networkToId)(lucid.network);
  if (networkId !== actualNetworkId) {
    throw new Error("Invalid address: Expected address with network id ".concat(actualNetworkId, ", but got ").concat(networkId));
  }
  return type === "Byron" ? _mod.C.ByronAddress.from_base58(address).to_address() : _mod.C.Address.from_bech32(address);
}