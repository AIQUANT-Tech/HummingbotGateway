"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MerkleTree = void 0;
exports.combineHash = combineHash;
Object.defineProperty(exports, "concat", {
  enumerable: true,
  get: function get() {
    return _mod.concat;
  }
});
Object.defineProperty(exports, "equals", {
  enumerable: true,
  get: function get() {
    return _mod.equals;
  }
});
exports.sha256 = sha256;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.array-buffer.constructor.js");
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.array-buffer.detached.js");
require("core-js/modules/es.array-buffer.transfer.js");
require("core-js/modules/es.array-buffer.transfer-to-fixed-length.js");
require("core-js/modules/es.json.stringify.js");
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
var _mod = require("../../deps/deno.land/std@0.148.0/bytes/mod.js");
var _sha = require("../../deps/deno.land/std@0.153.0/hash/sha256.js");
var _utils = require("./utils.js");
// Haskell implementation: https://github.com/input-output-hk/hydra-poc/blob/master/plutus-merkle-tree/src/Plutus/MerkleTree.hs

class MerkleTree {
  /** Construct Merkle tree from data, which get hashed with sha256 */
  constructor(data) {
    Object.defineProperty(this, "root", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.root = MerkleTree.buildRecursively(data.map(d => sha256(d)));
  }
  /** Construct Merkle tree from sha256 hashes */
  static fromHashes(hashes) {
    return new this(hashes);
  }
  static buildRecursively(hashes) {
    if (hashes.length <= 0) return null;
    if (hashes.length === 1) {
      return {
        node: hashes[0],
        left: null,
        right: null
      };
    }
    const cutoff = Math.floor(hashes.length / 2);
    const [left, right] = [hashes.slice(0, cutoff), hashes.slice(cutoff)];
    const lnode = this.buildRecursively(left);
    const rnode = this.buildRecursively(right);
    if (lnode === null || rnode === null) return null;
    return {
      node: combineHash(lnode.node, rnode.node),
      left: lnode,
      right: rnode
    };
  }
  rootHash() {
    if (this.root === null) throw new Error("Merkle tree root hash not found.");
    return this.root.node;
  }
  getProof(data) {
    const hash = sha256(data);
    const proof = [];
    const searchRecursively = tree => {
      if (tree && (0, _mod.equals)(tree.node, hash)) return true;
      if (tree !== null && tree !== void 0 && tree.right) {
        if (searchRecursively(tree.left)) {
          proof.push({
            right: tree.right.node
          });
          return true;
        }
      }
      if (tree !== null && tree !== void 0 && tree.left) {
        if (searchRecursively(tree.right)) {
          proof.push({
            left: tree.left.node
          });
          return true;
        }
      }
    };
    searchRecursively(this.root);
    return proof;
  }
  size() {
    const searchRecursively = tree => {
      if (tree === null) return 0;
      return 1 + searchRecursively(tree.left) + searchRecursively(tree.right);
    };
    return searchRecursively(this.root);
  }
  static verify(data, rootHash, proof) {
    const hash = sha256(data);
    const searchRecursively = (rootHash2, proof) => {
      if (proof.length <= 0) return (0, _mod.equals)(rootHash, rootHash2);
      const [h, t] = [proof[0], proof.slice(1)];
      if (h.left) {
        return searchRecursively(combineHash(h.left, rootHash2), t);
      }
      if (h.right) {
        return searchRecursively(combineHash(rootHash2, h.right), t);
      }
      return false;
    };
    return searchRecursively(hash, proof);
  }
  toString() {
    // deno-lint-ignore no-explicit-any
    const searchRecursively = tree => {
      if (tree === null) return null;
      return {
        node: (0, _utils.toHex)(tree.node),
        left: searchRecursively(tree.left),
        right: searchRecursively(tree.right)
      };
    };
    return JSON.stringify(searchRecursively(this.root), null, 2);
  }
}
exports.MerkleTree = MerkleTree;
function sha256(data) {
  return new Uint8Array(new _sha.Sha256().update(data).arrayBuffer());
}
function combineHash(hash1, hash2) {
  return sha256((0, _mod.concat)(hash1, hash2));
}