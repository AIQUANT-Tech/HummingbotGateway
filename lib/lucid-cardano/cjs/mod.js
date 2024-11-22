"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
require("./_dnt.polyfills.js");
var _mod = require("./src/mod.js");
Object.keys(_mod).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mod[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mod[key];
    }
  });
});