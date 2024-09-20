export interface ExchangeHouse {
  name: string;
  exchanges: Exchange[];
}

export interface Exchange {
  fromCurrency: string;
  toCurrency: string;
  buyRate: number;
  sellRate: number;
}

export interface ConversionStep {
  exchangeHouse: string;
  from: string;
  to: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  isBuy: boolean;
}

export interface ConversionResult {
  initialAmount: number;
  finalAmountInUSD: number;
  profit: number;
  profitPercentage: number;
  path: ConversionStep[];
  allPaths: { currency: string; profit: number | null; profitPercentage: number | null }[];
}

export interface Graph {
  [key: string]: {
    [key: string]: {
      rate: number;
      exchangeHouse: string;
      isBuy: boolean;
    };
  };
}
