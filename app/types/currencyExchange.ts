import { ExchangeHouse, Exchange, ConversionStep, ConversionResult } from '../types/exchangeTypes';

function findBestConversionPath(
  initialAmount: number,
  initialCurrency: string,
  exchangeHouses: ExchangeHouse[],
  maxSteps: number,
  allowRepetitions: boolean
): ConversionResult {
  const currencies = new Set<string>();
  exchangeHouses.forEach(house => 
    house.exchanges.forEach(exchange => {
      currencies.add(exchange.fromCurrency);
      currencies.add(exchange.toCurrency);
    })
  );
  const currencyList = Array.from(currencies);
  
  // Inicializar las estructuras de datos
  const graph: { [key: string]: { [key: string]: { rate: number, exchangeHouse: string } } } = {};
  currencyList.forEach(currency => {
    graph[currency] = {};
    currencyList.forEach(otherCurrency => {
      graph[currency][otherCurrency] = { rate: currency === otherCurrency ? 1 : 0, exchangeHouse: '' };
    });
  });

  // Llenar el grafo con las tasas de cambio
  exchangeHouses.forEach(house => {
    house.exchanges.forEach(exchange => {
      graph[exchange.fromCurrency][exchange.toCurrency] = { rate: exchange.sellRate, exchangeHouse: house.name };
      graph[exchange.toCurrency][exchange.fromCurrency] = { rate: 1 / exchange.buyRate, exchangeHouse: house.name };
    });
  });

  let bestResult: ConversionResult = {
    path: [],
    initialAmount,
    finalAmount: initialAmount,
    finalAmountInUSD: initialAmount,
    profit: 0,
    profitPercentage: 0,
    allPaths: []
  };

  function dfs(currentCurrency: string, currentAmount: number, path: ConversionStep[], visited: Set<string>) {
    if (path.length > 0) {
      const finalAmountInUSD = currentCurrency === 'USD' ? currentAmount : currentAmount * graph[currentCurrency]['USD'].rate;
      const profit = finalAmountInUSD - initialAmount;
      const profitPercentage = (profit / initialAmount) * 100;

      const currentResult: ConversionResult = {
        path: [...path],
        initialAmount,
        finalAmount: currentAmount,
        finalAmountInUSD,
        profit,
        profitPercentage,
        allPaths: []
      };

      bestResult.allPaths.push(currentResult);

      if (profit > bestResult.profit) {
        bestResult = currentResult;
      }
    }

    if (path.length >= maxSteps) return;

    for (const nextCurrency in graph[currentCurrency]) {
      if (!allowRepetitions && visited.has(nextCurrency)) continue;

      const { rate, exchangeHouse } = graph[currentCurrency][nextCurrency];
      if (rate === 0) continue;

      const nextAmount = currentAmount * rate;
      const step: ConversionStep = {
        exchangeHouse,
        from: currentCurrency,
        to: nextCurrency,
        fromAmount: currentAmount,
        toAmount: nextAmount,
        rate,
        isBuy: false
      };

      path.push(step);
      visited.add(nextCurrency);

      dfs(nextCurrency, nextAmount, path, new Set(visited));

      path.pop();
      visited.delete(nextCurrency);
    }
  }

  dfs(initialCurrency, initialAmount, [], new Set([initialCurrency]));

  return bestResult;
}

export { findBestConversionPath };