"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = decode;
exports.decodeString = decodeString;
exports.decodedLen = decodedLen;
exports.encode = encode;
exports.encodeToString = encodeToString;
exports.encodedLen = encodedLen;
exports.errInvalidByte = errInvalidByte;
exports.errLength = errLength;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array-buffer.constructor.js");
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.array-buffer.detached.js");
require("core-js/modules/es.array-buffer.transfer.js");
require("core-js/modules/es.array-buffer.transfer-to-fixed-length.js");
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
// Ported from Go
// https://github.com/golang/go/blob/go1.12.5/src/encoding/hex/hex.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
const hexTable = new TextEncoder().encode("0123456789abcdef");
/**
 * ErrInvalidByte takes an invalid byte and returns an Error.
 * @param byte
 */
function errInvalidByte(byte) {
  return new Error("encoding/hex: invalid byte: " + new TextDecoder().decode(new Uint8Array([byte])));
}
/** ErrLength returns an error about odd string length. */
function errLength() {
  return new Error("encoding/hex: odd length hex string");
}
// fromHexChar converts a hex character into its value.
function fromHexChar(byte) {
  // '0' <= byte && byte <= '9'
  if (48 <= byte && byte <= 57) return byte - 48;
  // 'a' <= byte && byte <= 'f'
  if (97 <= byte && byte <= 102) return byte - 97 + 10;
  // 'A' <= byte && byte <= 'F'
  if (65 <= byte && byte <= 70) return byte - 65 + 10;
  throw errInvalidByte(byte);
}
/**
 * EncodedLen returns the length of an encoding of n source bytes. Specifically,
 * it returns n * 2.
 * @param n
 */
function encodedLen(n) {
  return n * 2;
}
/**
 * Encode encodes `src` into `encodedLen(src.length)` bytes.
 * @param src
 */
function encode(src) {
  const dst = new Uint8Array(encodedLen(src.length));
  for (let i = 0; i < dst.length; i++) {
    const v = src[i];
    dst[i * 2] = hexTable[v >> 4];
    dst[i * 2 + 1] = hexTable[v & 0x0f];
  }
  return dst;
}
/**
 * EncodeToString returns the hexadecimal encoding of `src`.
 * @param src
 */
function encodeToString(src) {
  return new TextDecoder().decode(encode(src));
}
/**
 * Decode decodes `src` into `decodedLen(src.length)` bytes
 * If the input is malformed an error will be thrown
 * the error.
 * @param src
 */
function decode(src) {
  const dst = new Uint8Array(decodedLen(src.length));
  for (let i = 0; i < dst.length; i++) {
    const a = fromHexChar(src[i * 2]);
    const b = fromHexChar(src[i * 2 + 1]);
    dst[i] = a << 4 | b;
  }
  if (src.length % 2 == 1) {
    // Check for invalid char before reporting bad length,
    // since the invalid char (if present) is an earlier problem.
    fromHexChar(src[dst.length * 2]);
    throw errLength();
  }
  return dst;
}
/**
 * DecodedLen returns the length of decoding `x` source bytes.
 * Specifically, it returns `x / 2`.
 * @param x
 */
function decodedLen(x) {
  return x >>> 1;
}
/**
 * DecodeString returns the bytes represented by the hexadecimal string `s`.
 * DecodeString expects that src contains only hexadecimal characters and that
 * src has even length.
 * If the input is malformed, DecodeString will throw an error.
 * @param s the `string` to decode to `Uint8Array`
 */
function decodeString(s) {
  return decode(new TextEncoder().encode(s));
}