"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenBundle = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Mutable
 */
var TokenBundle = exports.TokenBundle = /*#__PURE__*/_createClass(function TokenBundle() {
  var _this = this;
  _classCallCheck(this, TokenBundle);
  _defineProperty(this, "tokensById", void 0);
  _defineProperty(this, "add", function (token) {
    if (_this.tokensById.has(token.id)) _this.tokensById.set(token.id, _this.tokensById.get(token.id).add(token));else _this.tokensById.set(token.id, token);
    return _this;
  });
  _defineProperty(this, "sub", function (token) {
    if (!_this.tokensById.has(token.id)) _this.tokensById.set(token.id, token.withAmount(0n));
    _this.tokensById.set(token.id, _this.tokensById.get(token.id).sub(token));
    return _this;
  });
  _defineProperty(this, "token", function (id) {
    return _this.tokensById.get(id);
  });
  _defineProperty(this, "tokens", function () {
    return _toConsumableArray(_this.tokensById.values());
  });
  _defineProperty(this, "addBundle", function (bundle) {
    bundle.tokens().forEach(_this.add);
    return _this;
  });
  this.tokensById = new Map();
  for (var _len = arguments.length, tokens = new Array(_len), _key = 0; _key < _len; _key++) {
    tokens[_key] = arguments[_key];
  }
  tokens.forEach(this.add);
});
//# sourceMappingURL=TokenBundle.js.map