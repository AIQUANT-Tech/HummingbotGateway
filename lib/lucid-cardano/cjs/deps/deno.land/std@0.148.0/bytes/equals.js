"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = equals;
exports.equals32Bit = equals32Bit;
exports.equalsNaive = equalsNaive;
require("core-js/modules/es.array-buffer.constructor.js");
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.array-buffer.detached.js");
require("core-js/modules/es.array-buffer.transfer.js");
require("core-js/modules/es.array-buffer.transfer-to-fixed-length.js");
require("core-js/modules/es.typed-array.uint32-array.js");
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
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/** Check whether binary arrays are equal to each other using 8-bit comparisons.
 * @private
 * @param a first array to check equality
 * @param b second array to check equality
 */
function equalsNaive(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < b.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
/** Check whether binary arrays are equal to each other using 32-bit comparisons.
 * @private
 * @param a first array to check equality
 * @param b second array to check equality
 */
function equals32Bit(a, b) {
  if (a.length !== b.length) return false;
  const len = a.length;
  const compressable = Math.floor(len / 4);
  const compressedA = new Uint32Array(a.buffer, 0, compressable);
  const compressedB = new Uint32Array(b.buffer, 0, compressable);
  for (let i = compressable * 4; i < len; i++) {
    if (a[i] !== b[i]) return false;
  }
  for (let i = 0; i < compressedA.length; i++) {
    if (compressedA[i] !== compressedB[i]) return false;
  }
  return true;
}
/** Check whether binary arrays are equal to each other.
 * @param a first array to check equality
 * @param b second array to check equality
 */
function equals(a, b) {
  if (a.length < 1000) return equalsNaive(a, b);
  return equals32Bit(a, b);
}