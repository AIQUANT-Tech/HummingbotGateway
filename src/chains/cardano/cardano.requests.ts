export type AssetsRequest = {
    network?: string;
    tokenSymbols?: string[];
};

export interface CardanoAsset {
    symbol: string;
    assetId: number;
    decimals: number;
}


export type AssetsResponse = {
    assets: CardanoAsset[];
};

export interface PollRequest {
    network: string;
    txHash: string;
}
