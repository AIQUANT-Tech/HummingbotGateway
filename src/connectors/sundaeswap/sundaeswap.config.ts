import { CardanoTokenInfo } from '../../chains/cardano/cardano';

export interface ExpectedTrade {
  expectedAmount: string;
  rawAmount: string;
}

export interface TradeInfo {
  baseToken: CardanoTokenInfo[];
  quoteToken: CardanoTokenInfo[];
  requestAmount: string;
  expectedTrade: ExpectedTrade;
  baseTokenAddress: string;
  quoteTokenAddress: string;
}

export interface Transaction {
  hash: string;
  to?: string;
  from?: string;
  rawAmount: BigInt;
}
