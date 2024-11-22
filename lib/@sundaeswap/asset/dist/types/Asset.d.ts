export interface IFungibleAsset {
    amount: bigint;
}
export interface IHasDecimals {
    decimals: number;
}
export interface IHasStringId {
    id: string;
}
export type TFungibleToken = IFungibleAsset & IHasDecimals & IHasStringId;
export type TNonFungibleToken = IHasStringId;
export declare const stringIdEquals: (a: IHasStringId, b: IHasStringId) => boolean;
//# sourceMappingURL=Asset.d.ts.map