import { AssetAmount } from "./AssetAmount.js";

/**
 * Mutable
 */
export class TokenBundle {
  readonly tokensById: Map<string, AssetAmount>;

  constructor(...tokens: AssetAmount[]) {
    this.tokensById = new Map<string, AssetAmount>();
    tokens.forEach(this.add);
  }

  add = (token: AssetAmount): TokenBundle => {
    if (this.tokensById.has(token.id))
      this.tokensById.set(token.id, this.tokensById.get(token.id).add(token));
    else this.tokensById.set(token.id, token);
    return this;
  };

  sub = (token: AssetAmount): TokenBundle => {
    if (!this.tokensById.has(token.id))
      this.tokensById.set(token.id, token.withAmount(0n));
    this.tokensById.set(token.id, this.tokensById.get(token.id).sub(token));
    return this;
  };

  token = (id: string): AssetAmount | undefined => this.tokensById.get(id);

  tokens = (): AssetAmount[] => {
    return [...this.tokensById.values()];
  };

  addBundle = (bundle: TokenBundle): TokenBundle => {
    bundle.tokens().forEach(this.add);
    return this;
  };
}
