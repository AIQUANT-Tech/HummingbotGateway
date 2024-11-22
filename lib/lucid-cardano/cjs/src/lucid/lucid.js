"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lucid = void 0;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _mod = require("../core/mod.js");
var _mod2 = require("../utils/mod.js");
var _tx = require("./tx.js");
var _tx_complete = require("./tx_complete.js");
var _wallet = require("../misc/wallet.js");
var _sign_data = require("../misc/sign_data.js");
var _message = require("./message.js");
var _time = require("../plutus/time.js");
var _data = require("../plutus/data.js");
var _emulator = require("../provider/emulator.js");
class Lucid {
  constructor() {
    Object.defineProperty(this, "txBuilderConfig", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "wallet", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "provider", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "network", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Mainnet"
    });
    Object.defineProperty(this, "utils", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  static async new(provider, network) {
    const lucid = new this();
    if (network) lucid.network = network;
    if (provider) {
      lucid.provider = provider;
      const protocolParameters = await provider.getProtocolParameters();
      if (lucid.provider instanceof _emulator.Emulator) {
        lucid.network = "Custom";
        _time.SLOT_CONFIG_NETWORK[lucid.network] = {
          zeroTime: lucid.provider.now(),
          zeroSlot: 0,
          slotLength: 1000
        };
      }
      const slotConfig = _time.SLOT_CONFIG_NETWORK[lucid.network];
      lucid.txBuilderConfig = _mod.C.TransactionBuilderConfigBuilder.new().coins_per_utxo_byte(_mod.C.BigNum.from_str(protocolParameters.coinsPerUtxoByte.toString())).fee_algo(_mod.C.LinearFee.new(_mod.C.BigNum.from_str(protocolParameters.minFeeA.toString()), _mod.C.BigNum.from_str(protocolParameters.minFeeB.toString()))).key_deposit(_mod.C.BigNum.from_str(protocolParameters.keyDeposit.toString())).pool_deposit(_mod.C.BigNum.from_str(protocolParameters.poolDeposit.toString())).max_tx_size(protocolParameters.maxTxSize).max_value_size(protocolParameters.maxValSize).collateral_percentage(protocolParameters.collateralPercentage).max_collateral_inputs(protocolParameters.maxCollateralInputs).max_tx_ex_units(_mod.C.ExUnits.new(_mod.C.BigNum.from_str(protocolParameters.maxTxExMem.toString()), _mod.C.BigNum.from_str(protocolParameters.maxTxExSteps.toString()))).ex_unit_prices(_mod.C.ExUnitPrices.from_float(protocolParameters.priceMem, protocolParameters.priceStep)).minfee_refscript_cost_per_byte(_mod.C.UnitInterval.from_float(protocolParameters.minfeeRefscriptCostPerByte)).slot_config(_mod.C.BigNum.from_str(slotConfig.zeroTime.toString()), _mod.C.BigNum.from_str(slotConfig.zeroSlot.toString()), slotConfig.slotLength).blockfrost(
      // We have Aiken now as native plutus core engine (primary), but we still support blockfrost (secondary) in case of bugs.
      _mod.C.Blockfrost.new(
      // deno-lint-ignore no-explicit-any
      ((provider === null || provider === void 0 ? void 0 : provider.url) || "") + "/utils/txs/evaluate",
      // deno-lint-ignore no-explicit-any
      (provider === null || provider === void 0 ? void 0 : provider.projectId) || "")).costmdls((0, _mod2.createCostModels)(protocolParameters.costModels)).build();
    }
    lucid.utils = new _mod2.Utils(lucid);
    return lucid;
  }
  /**
   * Switch provider and/or network.
   * If provider or network unset, no overwriting happens. Provider or network from current instance are taken then.
   */
  async switchProvider(provider, network) {
    if (this.network === "Custom") {
      throw new Error("Cannot switch when on custom network.");
    }
    const lucid = await Lucid.new(provider, network);
    this.txBuilderConfig = lucid.txBuilderConfig;
    this.provider = provider || this.provider;
    this.network = network || this.network;
    this.wallet = lucid.wallet;
    return this;
  }
  newTx() {
    return new _tx.Tx(this);
  }
  fromTx(tx) {
    return new _tx_complete.TxComplete(this, _mod.C.Transaction.from_bytes((0, _mod2.fromHex)(tx)));
  }
  /** Signs a message. Expects the payload to be Hex encoded. */
  newMessage(address, payload) {
    return new _message.Message(this, address, payload);
  }
  /** Verify a message. Expects the payload to be Hex encoded. */
  verifyMessage(address, payload, signedMessage) {
    const {
      paymentCredential,
      stakeCredential,
      address: {
        hex: addressHex
      }
    } = this.utils.getAddressDetails(address);
    const keyHash = (paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash) || (stakeCredential === null || stakeCredential === void 0 ? void 0 : stakeCredential.hash);
    if (!keyHash) throw new Error("Not a valid address provided.");
    return (0, _sign_data.verifyData)(addressHex, keyHash, payload, signedMessage);
  }
  currentSlot() {
    return this.utils.unixTimeToSlot(Date.now());
  }
  utxosAt(addressOrCredential) {
    return this.provider.getUtxos(addressOrCredential);
  }
  utxosAtWithUnit(addressOrCredential, unit) {
    return this.provider.getUtxosWithUnit(addressOrCredential, unit);
  }
  /** Unit needs to be an NFT (or optionally the entire supply in one UTxO). */
  utxoByUnit(unit) {
    return this.provider.getUtxoByUnit(unit);
  }
  utxosByOutRef(outRefs) {
    return this.provider.getUtxosByOutRef(outRefs);
  }
  delegationAt(rewardAddress) {
    return this.provider.getDelegation(rewardAddress);
  }
  awaitTx(txHash) {
    let checkInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
    return this.provider.awaitTx(txHash, checkInterval);
  }
  async datumOf(utxo, type) {
    if (!utxo.datum) {
      if (!utxo.datumHash) {
        throw new Error("This UTxO does not have a datum hash.");
      }
      utxo.datum = await this.provider.getDatum(utxo.datumHash);
    }
    return _data.Data.from(utxo.datum, type);
  }
  /** Query CIP-0068 metadata for a specifc asset. */
  async metadataOf(unit) {
    const {
      policyId,
      name,
      label
    } = (0, _mod2.fromUnit)(unit);
    switch (label) {
      case 222:
      case 333:
      case 444:
        {
          const utxo = await this.utxoByUnit((0, _mod2.toUnit)(policyId, name, 100));
          const metadata = await this.datumOf(utxo);
          return _data.Data.toJson(metadata.fields[0]);
        }
      default:
        throw new Error("No variant matched.");
    }
  }
  /**
   * Cardano Private key in bech32; not the BIP32 private key or any key that is not fully derived.
   * Only an Enteprise address (without stake credential) is derived.
   */
  selectWalletFromPrivateKey(privateKey) {
    const priv = _mod.C.PrivateKey.from_bech32(privateKey);
    const pubKeyHash = priv.to_public().hash();
    this.wallet = {
      // deno-lint-ignore require-await
      address: async () => _mod.C.EnterpriseAddress.new(this.network === "Mainnet" ? 1 : 0, _mod.C.StakeCredential.from_keyhash(pubKeyHash)).to_address().to_bech32(undefined),
      // deno-lint-ignore require-await
      rewardAddress: async () => null,
      getUtxos: async () => {
        return await this.utxosAt((0, _mod2.paymentCredentialOf)(await this.wallet.address()));
      },
      getUtxosCore: async () => {
        const utxos = await this.utxosAt((0, _mod2.paymentCredentialOf)(await this.wallet.address()));
        const coreUtxos = _mod.C.TransactionUnspentOutputs.new();
        utxos.forEach(utxo => {
          coreUtxos.add((0, _mod2.utxoToCore)(utxo));
        });
        return coreUtxos;
      },
      // deno-lint-ignore require-await
      getDelegation: async () => {
        return {
          poolId: null,
          rewards: 0n
        };
      },
      // deno-lint-ignore require-await
      signTx: async tx => {
        const witness = _mod.C.make_vkey_witness(_mod.C.hash_transaction(tx.body()), priv);
        const txWitnessSetBuilder = _mod.C.TransactionWitnessSetBuilder.new();
        txWitnessSetBuilder.add_vkey(witness);
        return txWitnessSetBuilder.build();
      },
      // deno-lint-ignore require-await
      signMessage: async (address, payload) => {
        const {
          paymentCredential,
          address: {
            hex: hexAddress
          }
        } = this.utils.getAddressDetails(address);
        const keyHash = paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash;
        const originalKeyHash = pubKeyHash.to_hex();
        if (!keyHash || keyHash !== originalKeyHash) {
          throw new Error("Cannot sign message for address: ".concat(address, "."));
        }
        return (0, _sign_data.signData)(hexAddress, payload, privateKey);
      },
      submitTx: async tx => {
        return await this.provider.submitTx(tx);
      }
    };
    return this;
  }
  selectWallet(api) {
    const getAddressHex = async () => {
      const [addressHex] = await api.getUsedAddresses();
      if (addressHex) return addressHex;
      const [unusedAddressHex] = await api.getUnusedAddresses();
      return unusedAddressHex;
    };
    this.wallet = {
      address: async () => _mod.C.Address.from_bytes((0, _mod2.fromHex)(await getAddressHex())).to_bech32(undefined),
      rewardAddress: async () => {
        const [rewardAddressHex] = await api.getRewardAddresses();
        const rewardAddress = rewardAddressHex ? _mod.C.RewardAddress.from_address(_mod.C.Address.from_bytes((0, _mod2.fromHex)(rewardAddressHex))).to_address().to_bech32(undefined) : null;
        return rewardAddress;
      },
      getUtxos: async () => {
        const utxos = ((await api.getUtxos()) || []).map(utxo => {
          const parsedUtxo = _mod.C.TransactionUnspentOutput.from_bytes((0, _mod2.fromHex)(utxo));
          return (0, _mod2.coreToUtxo)(parsedUtxo);
        });
        return utxos;
      },
      getUtxosCore: async () => {
        const utxos = _mod.C.TransactionUnspentOutputs.new();
        ((await api.getUtxos()) || []).forEach(utxo => {
          utxos.add(_mod.C.TransactionUnspentOutput.from_bytes((0, _mod2.fromHex)(utxo)));
        });
        return utxos;
      },
      getDelegation: async () => {
        const rewardAddr = await this.wallet.rewardAddress();
        return rewardAddr ? await this.delegationAt(rewardAddr) : {
          poolId: null,
          rewards: 0n
        };
      },
      signTx: async tx => {
        const witnessSet = await api.signTx((0, _mod2.toHex)(tx.to_bytes()), true);
        return _mod.C.TransactionWitnessSet.from_bytes((0, _mod2.fromHex)(witnessSet));
      },
      signMessage: async (address, payload) => {
        const hexAddress = (0, _mod2.toHex)(_mod.C.Address.from_bech32(address).to_bytes());
        return await api.signData(hexAddress, payload);
      },
      submitTx: async tx => {
        const txHash = await api.submitTx(tx);
        return txHash;
      }
    };
    return this;
  }
  /**
   * Emulates a wallet by constructing it with the utxos and an address.
   * If utxos are not set, utxos are fetched from the provided address.
   */
  selectWalletFrom(_ref) {
    let {
      address: _address,
      utxos,
      rewardAddress: _rewardAddress
    } = _ref;
    const addressDetails = this.utils.getAddressDetails(_address);
    this.wallet = {
      // deno-lint-ignore require-await
      address: async () => _address,
      // deno-lint-ignore require-await
      rewardAddress: async () => {
        const rewardAddr = !_rewardAddress && addressDetails.stakeCredential ? (() => {
          if (addressDetails.stakeCredential.type === "Key") {
            return _mod.C.RewardAddress.new(this.network === "Mainnet" ? 1 : 0, _mod.C.StakeCredential.from_keyhash(_mod.C.Ed25519KeyHash.from_hex(addressDetails.stakeCredential.hash))).to_address().to_bech32(undefined);
          }
          return _mod.C.RewardAddress.new(this.network === "Mainnet" ? 1 : 0, _mod.C.StakeCredential.from_scripthash(_mod.C.ScriptHash.from_hex(addressDetails.stakeCredential.hash))).to_address().to_bech32(undefined);
        })() : _rewardAddress;
        return rewardAddr || null;
      },
      getUtxos: async () => {
        return utxos ? utxos : await this.utxosAt((0, _mod2.paymentCredentialOf)(_address));
      },
      getUtxosCore: async () => {
        const coreUtxos = _mod.C.TransactionUnspentOutputs.new();
        (utxos ? utxos : await this.utxosAt((0, _mod2.paymentCredentialOf)(_address))).forEach(utxo => coreUtxos.add((0, _mod2.utxoToCore)(utxo)));
        return coreUtxos;
      },
      getDelegation: async () => {
        const rewardAddr = await this.wallet.rewardAddress();
        return rewardAddr ? await this.delegationAt(rewardAddr) : {
          poolId: null,
          rewards: 0n
        };
      },
      // deno-lint-ignore require-await
      signTx: async () => {
        throw new Error("Not implemented");
      },
      // deno-lint-ignore require-await
      signMessage: async () => {
        throw new Error("Not implemented");
      },
      submitTx: async tx => {
        return await this.provider.submitTx(tx);
      }
    };
    return this;
  }
  /**
   * Select wallet from a seed phrase (e.g. 15 or 24 words). You have the option to choose between a Base address (with stake credential)
   * and Enterprise address (without stake credential). You can also decide which account index to derive. By default account 0 is derived.
   */
  selectWalletFromSeed(seed, options) {
    const {
      address: _address2,
      rewardAddress: _rewardAddress2,
      paymentKey,
      stakeKey
    } = (0, _wallet.walletFromSeed)(seed, {
      addressType: (options === null || options === void 0 ? void 0 : options.addressType) || "Base",
      accountIndex: (options === null || options === void 0 ? void 0 : options.accountIndex) || 0,
      password: options === null || options === void 0 ? void 0 : options.password,
      network: this.network
    });
    const paymentKeyHash = _mod.C.PrivateKey.from_bech32(paymentKey).to_public().hash().to_hex();
    const stakeKeyHash = stakeKey ? _mod.C.PrivateKey.from_bech32(stakeKey).to_public().hash().to_hex() : "";
    const privKeyHashMap = {
      [paymentKeyHash]: paymentKey,
      [stakeKeyHash]: stakeKey
    };
    this.wallet = {
      // deno-lint-ignore require-await
      address: async () => _address2,
      // deno-lint-ignore require-await
      rewardAddress: async () => _rewardAddress2 || null,
      // deno-lint-ignore require-await
      getUtxos: async () => this.utxosAt((0, _mod2.paymentCredentialOf)(_address2)),
      getUtxosCore: async () => {
        const coreUtxos = _mod.C.TransactionUnspentOutputs.new();
        (await this.utxosAt((0, _mod2.paymentCredentialOf)(_address2))).forEach(utxo => coreUtxos.add((0, _mod2.utxoToCore)(utxo)));
        return coreUtxos;
      },
      getDelegation: async () => {
        const rewardAddr = await this.wallet.rewardAddress();
        return rewardAddr ? await this.delegationAt(rewardAddr) : {
          poolId: null,
          rewards: 0n
        };
      },
      signTx: async tx => {
        const utxos = await this.utxosAt(_address2);
        const ownKeyHashes = [paymentKeyHash, stakeKeyHash];
        const usedKeyHashes = (0, _wallet.discoverOwnUsedTxKeyHashes)(tx, ownKeyHashes, utxos);
        const txWitnessSetBuilder = _mod.C.TransactionWitnessSetBuilder.new();
        usedKeyHashes.forEach(keyHash => {
          const witness = _mod.C.make_vkey_witness(_mod.C.hash_transaction(tx.body()), _mod.C.PrivateKey.from_bech32(privKeyHashMap[keyHash]));
          txWitnessSetBuilder.add_vkey(witness);
        });
        return txWitnessSetBuilder.build();
      },
      // deno-lint-ignore require-await
      signMessage: async (address, payload) => {
        const {
          paymentCredential,
          stakeCredential,
          address: {
            hex: hexAddress
          }
        } = this.utils.getAddressDetails(address);
        const keyHash = (paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash) || (stakeCredential === null || stakeCredential === void 0 ? void 0 : stakeCredential.hash);
        const privateKey = privKeyHashMap[keyHash];
        if (!privateKey) {
          throw new Error("Cannot sign message for address: ".concat(address, "."));
        }
        return (0, _sign_data.signData)(hexAddress, payload, privateKey);
      },
      submitTx: async tx => {
        return await this.provider.submitTx(tx);
      }
    };
    return this;
  }
}
exports.Lucid = Lucid;