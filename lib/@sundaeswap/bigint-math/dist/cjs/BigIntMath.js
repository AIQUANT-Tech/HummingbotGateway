"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abs = abs;
exports.max = max;
exports.min = min;
exports.rootNth = rootNth;
exports.sign = sign;
exports.sqrt = sqrt;
function max() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }
  if (values.length === 0) {
    return null;
  }
  if (values.length === 1) {
    return values[0];
  }
  var max = values[0];
  for (var i = 1; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
    }
  }
  return max;
}
function min() {
  for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }
  if (values.length === 0) {
    return null;
  }
  if (values.length === 1) {
    return values[0];
  }
  var min = values[0];
  for (var i = 1; i < values.length; i++) {
    if (values[i] < min) {
      min = values[i];
    }
  }
  return min;
}
function sign(value) {
  if (value > 0n) {
    return 1n;
  }
  if (value < 0n) {
    return -1n;
  }
  return 0n;
}
function abs(value) {
  if (sign(value) === -1n) {
    return -value;
  }
  return value;
}

// https://stackoverflow.com/questions/53683995/javascript-big-integer-square-root/58863398#58863398
function rootNth(value) {
  var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2n;
  if (value < 0n) {
    throw new Error("negative number is not supported");
  }
  var o = 0n;
  var x = value;
  var limit = 100;
  while (Math.pow(x, k) !== k && x !== o && --limit) {
    o = x;
    x = ((k - 1n) * x + value / Math.pow(x, k - 1n)) / k;
  }
  return x;
}
function sqrt(value) {
  return rootNth(value);
}
//# sourceMappingURL=BigIntMath.js.map