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
    path: ConversionStep[];
    initialAmount: number;
    finalAmount: number;
    finalAmountInUSD: number; // Añadimos esta línea
    profit: number;
    profitPercentage: number;
    allPaths: {
      path: ConversionStep[];
      finalAmount: number;
      finalAmountInUSD: number; // Añadimos esta línea
      profit: number;
      profitPercentage: number;
    }[];
  }