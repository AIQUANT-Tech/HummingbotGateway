import { AssetAmount } from "./AssetAmount.js";
/**
 * Mutable
 */
export declare class TokenBundle {
    readonly tokensById: Map<string, AssetAmount>;
    constructor(...tokens: AssetAmount[]);
    add: (token: AssetAmount) => TokenBundle;
    sub: (token: AssetAmount) => TokenBundle;
    token: (id: string) => AssetAmount | undefined;
    tokens: () => AssetAmount[];
    addBundle: (bundle: TokenBundle) => TokenBundle;
}
//# sourceMappingURL=TokenBundle.d.ts.map