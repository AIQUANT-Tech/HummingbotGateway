"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discoverOwnUsedTxKeyHashes = discoverOwnUsedTxKeyHashes;
exports.walletFromSeed = walletFromSeed;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array-buffer.constructor.js");
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.array-buffer.detached.js");
require("core-js/modules/es.array-buffer.transfer.js");
require("core-js/modules/es.array-buffer.transfer-to-fixed-length.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.typed-array.uint8-array.js");
require("core-js/modules/es.typed-array.at.js");
require("core-js/modules/es.typed-array.fill.js");
require("core-js/modules/es.typed-array.find-last.js");
require("core-js/modules/es.typed-array.find-last-index.js");
require("core-js/modules/es.typed-array.set.js");
require("core-js/modules/es.typed-array.sort.js");
require("core-js/modules/es.typed-array.to-locale-string.js");
require("core-js/modules/es.typed-array.to-reversed.js");
require("core-js/modules/es.typed-array.to-sorted.js");
require("core-js/modules/es.typed-array.with.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _mod = require("../mod.js");
var _bip = require("./bip39.js");
function walletFromSeed(seed) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    addressType: "Base",
    accountIndex: 0,
    network: "Mainnet"
  };
  function harden(num) {
    if (typeof num !== "number") throw new Error("Type number required here!");
    return 0x80000000 + num;
  }
  const entropy = (0, _bip.mnemonicToEntropy)(seed);
  const rootKey = _mod.C.Bip32PrivateKey.from_bip39_entropy((0, _mod.fromHex)(entropy), options.password ? new TextEncoder().encode(options.password) : new Uint8Array());
  const accountKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(options.accountIndex));
  const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
  const stakeKey = accountKey.derive(2).derive(0).to_raw_key();
  const paymentKeyHash = paymentKey.to_public().hash();
  const stakeKeyHash = stakeKey.to_public().hash();
  const networkId = options.network === "Mainnet" ? 1 : 0;
  const address = options.addressType === "Base" ? _mod.C.BaseAddress.new(networkId, _mod.C.StakeCredential.from_keyhash(paymentKeyHash), _mod.C.StakeCredential.from_keyhash(stakeKeyHash)).to_address().to_bech32(undefined) : _mod.C.EnterpriseAddress.new(networkId, _mod.C.StakeCredential.from_keyhash(paymentKeyHash)).to_address().to_bech32(undefined);
  const rewardAddress = options.addressType === "Base" ? _mod.C.RewardAddress.new(networkId, _mod.C.StakeCredential.from_keyhash(stakeKeyHash)).to_address().to_bech32(undefined) : null;
  return {
    address,
    rewardAddress,
    paymentKey: paymentKey.to_bech32(),
    stakeKey: options.addressType === "Base" ? stakeKey.to_bech32() : null
  };
}
function discoverOwnUsedTxKeyHashes(tx, ownKeyHashes, ownUtxos) {
  const usedKeyHashes = [];
  // key hashes from inputs
  const inputs = tx.body().inputs();
  for (let i = 0; i < inputs.len(); i++) {
    const input = inputs.get(i);
    const txHash = (0, _mod.toHex)(input.transaction_id().to_bytes());
    const outputIndex = parseInt(input.index().to_str());
    const utxo = ownUtxos.find(utxo => utxo.txHash === txHash && utxo.outputIndex === outputIndex);
    if (utxo) {
      const {
        paymentCredential
      } = (0, _mod.getAddressDetails)(utxo.address);
      usedKeyHashes.push(paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash);
    }
  }
  const txBody = tx.body();
  // key hashes from certificates
  function keyHashFromCert(txBody) {
    const certs = txBody.certs();
    if (!certs) return;
    for (let i = 0; i < certs.len(); i++) {
      const cert = certs.get(i);
      if (cert.kind() === 0) {
        var _cert$as_stake_regist;
        const credential = (_cert$as_stake_regist = cert.as_stake_registration()) === null || _cert$as_stake_regist === void 0 ? void 0 : _cert$as_stake_regist.stake_credential();
        if ((credential === null || credential === void 0 ? void 0 : credential.kind()) === 0) {
          // Key hash not needed for registration
        }
      } else if (cert.kind() === 1) {
        var _cert$as_stake_deregi;
        const credential = (_cert$as_stake_deregi = cert.as_stake_deregistration()) === null || _cert$as_stake_deregi === void 0 ? void 0 : _cert$as_stake_deregi.stake_credential();
        if ((credential === null || credential === void 0 ? void 0 : credential.kind()) === 0) {
          const keyHash = (0, _mod.toHex)(credential.to_keyhash().to_bytes());
          usedKeyHashes.push(keyHash);
        }
      } else if (cert.kind() === 2) {
        var _cert$as_stake_delega;
        const credential = (_cert$as_stake_delega = cert.as_stake_delegation()) === null || _cert$as_stake_delega === void 0 ? void 0 : _cert$as_stake_delega.stake_credential();
        if ((credential === null || credential === void 0 ? void 0 : credential.kind()) === 0) {
          const keyHash = (0, _mod.toHex)(credential.to_keyhash().to_bytes());
          usedKeyHashes.push(keyHash);
        }
      } else if (cert.kind() === 3) {
        var _cert$as_pool_registr;
        const poolParams = (_cert$as_pool_registr = cert.as_pool_registration()) === null || _cert$as_pool_registr === void 0 ? void 0 : _cert$as_pool_registr.pool_params();
        const owners = poolParams === null || poolParams === void 0 ? void 0 : poolParams.pool_owners();
        if (!owners) break;
        for (let i = 0; i < owners.len(); i++) {
          const keyHash = (0, _mod.toHex)(owners.get(i).to_bytes());
          usedKeyHashes.push(keyHash);
        }
        const operator = poolParams.operator().to_hex();
        usedKeyHashes.push(operator);
      } else if (cert.kind() === 4) {
        const operator = cert.as_pool_retirement().pool_keyhash().to_hex();
        usedKeyHashes.push(operator);
      } else if (cert.kind() === 6) {
        var _cert$as_move_instant;
        const instantRewards = (_cert$as_move_instant = cert.as_move_instantaneous_rewards_cert()) === null || _cert$as_move_instant === void 0 || (_cert$as_move_instant = _cert$as_move_instant.move_instantaneous_reward().as_to_stake_creds()) === null || _cert$as_move_instant === void 0 ? void 0 : _cert$as_move_instant.keys();
        if (!instantRewards) break;
        for (let i = 0; i < instantRewards.len(); i++) {
          const credential = instantRewards.get(i);
          if (credential.kind() === 0) {
            const keyHash = (0, _mod.toHex)(credential.to_keyhash().to_bytes());
            usedKeyHashes.push(keyHash);
          }
        }
      }
    }
  }
  if (txBody.certs()) keyHashFromCert(txBody);
  // key hashes from withdrawals
  const withdrawals = txBody.withdrawals();
  function keyHashFromWithdrawal(withdrawals) {
    const rewardAddresses = withdrawals.keys();
    for (let i = 0; i < rewardAddresses.len(); i++) {
      const credential = rewardAddresses.get(i).payment_cred();
      if (credential.kind() === 0) {
        usedKeyHashes.push(credential.to_keyhash().to_hex());
      }
    }
  }
  if (withdrawals) keyHashFromWithdrawal(withdrawals);
  // key hashes from scripts
  const scripts = tx.witness_set().native_scripts();
  function keyHashFromScript(scripts) {
    for (let i = 0; i < scripts.len(); i++) {
      const script = scripts.get(i);
      if (script.kind() === 0) {
        const keyHash = (0, _mod.toHex)(script.as_script_pubkey().addr_keyhash().to_bytes());
        usedKeyHashes.push(keyHash);
      }
      if (script.kind() === 1) {
        keyHashFromScript(script.as_script_all().native_scripts());
        return;
      }
      if (script.kind() === 2) {
        keyHashFromScript(script.as_script_any().native_scripts());
        return;
      }
      if (script.kind() === 3) {
        keyHashFromScript(script.as_script_n_of_k().native_scripts());
        return;
      }
    }
  }
  if (scripts) keyHashFromScript(scripts);
  // keyHashes from required signers
  const requiredSigners = txBody.required_signers();
  if (requiredSigners) {
    for (let i = 0; i < requiredSigners.len(); i++) {
      usedKeyHashes.push((0, _mod.toHex)(requiredSigners.get(i).to_bytes()));
    }
  }
  // keyHashes from collateral
  const collateral = txBody.collateral();
  if (collateral) {
    for (let i = 0; i < collateral.len(); i++) {
      const input = collateral.get(i);
      const txHash = (0, _mod.toHex)(input.transaction_id().to_bytes());
      const outputIndex = parseInt(input.index().to_str());
      const utxo = ownUtxos.find(utxo => utxo.txHash === txHash && utxo.outputIndex === outputIndex);
      if (utxo) {
        const {
          paymentCredential
        } = (0, _mod.getAddressDetails)(utxo.address);
        usedKeyHashes.push(paymentCredential === null || paymentCredential === void 0 ? void 0 : paymentCredential.hash);
      }
    }
  }
  return usedKeyHashes.filter(k => ownKeyHashes.includes(k));
}