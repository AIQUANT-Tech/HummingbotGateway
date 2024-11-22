"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.object.has-own.js");
// https://github.com/tc39/proposal-accessible-object-hasownproperty/blob/main/polyfill.js
if (!Object.hasOwn) {
  Object.defineProperty(Object, "hasOwn", {
    value: function value(object, property) {
      if (object == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      return Object.prototype.hasOwnProperty.call(Object(object), property);
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
}