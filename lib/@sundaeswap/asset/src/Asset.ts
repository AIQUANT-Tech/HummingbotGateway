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

export const stringIdEquals = (a: IHasStringId, b: IHasStringId) =>
  a.id === b.id;
