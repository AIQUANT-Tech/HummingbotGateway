"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.M = exports.C = void 0;
require("core-js/modules/es.global-this.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.dom-exception.constructor.js");
require("core-js/modules/web.dom-exception.stack.js");
require("core-js/modules/web.dom-exception.to-string-tag.js");
var _globalThis$process;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const isNode = globalThis === null || globalThis === void 0 || (_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 || (_globalThis$process = _globalThis$process.versions) === null || _globalThis$process === void 0 ? void 0 : _globalThis$process.node;
if (isNode) {
  if (typeof btoa === 'undefined') {
    globalThis.btoa = function (str) {
      return Buffer.from(str, 'binary').toString('base64');
    };
    globalThis.atob = function (b64Encoded) {
      return Buffer.from(b64Encoded, 'base64').toString('binary');
    };
  }
  const fetch = /* #__PURE__ */ Promise.resolve().then(() => _interopRequireWildcard(require( /* webpackIgnore: true */"node-fetch")));
  const {
    Crypto
  } = /* #__PURE__ */ Promise.resolve().then(() => _interopRequireWildcard(require( /* webpackIgnore: true */"@peculiar/webcrypto")));
  const {
    WebSocket
  } = /* #__PURE__ */ Promise.resolve().then(() => _interopRequireWildcard(require( /* webpackIgnore: true */"ws")));
  const fs = /* #__PURE__ */ Promise.resolve().then(() => _interopRequireWildcard(require( /* webpackIgnore: true */"fs")));
  if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;
  if (!globalThis.crypto) globalThis.crypto = Crypto;
  if (!globalThis.fetch) globalThis.fetch = fetch.default;
  if (!globalThis.Headers) globalThis.Headers = fetch.Headers;
  if (!globalThis.Request) globalThis.Request = fetch.Request;
  if (!globalThis.Response) globalThis.Response = fetch.Response;
  if (!globalThis.fs) globalThis.fs = fs;
}
//console.log('globalThis',globalThis)
const C = exports.C =  ( () => {
  try {
    if (isNode) {
      // return await Promise.resolve().then(
      //   () => _interopRequireWildcard(require( /* webpackIgnore: true */"./libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js"))
     return  require('./libs/cardano_multiplatform_lib/nodejs/cardano_multiplatform_lib.generated'); // Dynamic import
   
    }
    return  require("./libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js");
  } catch (_e) {
    // This only ever happens during SSR rendering
    return null;
  }
})(); 
//const C = exports.C  = require('./libs/cardano_multiplatform_lib/nodejs/cardano_multiplatform_lib.generated'); // Dynamic import


//console.log('CCCCCC',C)
const M = exports.M =  ( () => {
  try {
    if (isNode) {
      return require( /* webpackIgnore: true */"./libs/cardano_message_signing/nodejs/cardano_message_signing.generated.js");
    }
    return  require("./libs/cardano_message_signing/cardano_message_signing.generated.js");
  } catch (_e) {
    // This only ever happens during SSR rendering
    return null;
  }
})();
if (!isNode) {
  async function unsafeInstantiate(module) {
    try {
      await module.instantiate();
    } catch (_e) {
      // This only ever happens during SSR rendering
    }
  }
   Promise.all([unsafeInstantiate(C), unsafeInstantiate(M)]);
}