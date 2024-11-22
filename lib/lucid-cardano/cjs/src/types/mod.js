"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _types = require("./types.js");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});
var _global = require("./global.js");
Object.keys(_global).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _global[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _global[key];
    }
  });
});