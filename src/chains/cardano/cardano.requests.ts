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

export enum CardanoNetworkID {
    MAINNET = 764824073,
    PREPROD = 1,
}

export function getNetworkId(network: string = ''): number {
    switch (network) {
        case 'mainnet':
            return CardanoNetworkID.MAINNET;

        case 'preprod':
            return CardanoNetworkID.PREPROD;

        default:
            return 0;
    }
}

