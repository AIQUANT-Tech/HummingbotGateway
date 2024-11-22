function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Mutable
 */
export class TokenBundle {
  constructor(...tokens) {
    _defineProperty(this, "tokensById", void 0);
    _defineProperty(this, "add", token => {
      if (this.tokensById.has(token.id)) this.tokensById.set(token.id, this.tokensById.get(token.id).add(token));else this.tokensById.set(token.id, token);
      return this;
    });
    _defineProperty(this, "sub", token => {
      if (!this.tokensById.has(token.id)) this.tokensById.set(token.id, token.withAmount(0n));
      this.tokensById.set(token.id, this.tokensById.get(token.id).sub(token));
      return this;
    });
    _defineProperty(this, "token", id => this.tokensById.get(id));
    _defineProperty(this, "tokens", () => {
      return [...this.tokensById.values()];
    });
    _defineProperty(this, "addBundle", bundle => {
      bundle.tokens().forEach(this.add);
      return this;
    });
    this.tokensById = new Map();
    tokens.forEach(this.add);
  }
}
//# sourceMappingURL=TokenBundle.js.map