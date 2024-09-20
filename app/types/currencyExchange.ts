import { ExchangeHouse, ConversionResult, Graph, ConversionStep } from './exchangeTypes';

function buildGraph(exchangeHouses: ExchangeHouse[]): Graph {
  const graph: Graph = {};

  exchangeHouses.forEach(house => {
    house.exchanges.forEach(exchange => {
      if (!graph[exchange.fromCurrency]) {
        graph[exchange.fromCurrency] = {};
      }
      if (!graph[exchange.toCurrency]) {
        graph[exchange.toCurrency] = {};
      }

      // Buy rate
      graph[exchange.fromCurrency][exchange.toCurrency] = {
        rate: exchange.buyRate,
        exchangeHouse: house.name,
        isBuy: true
      };

      // Sell rate
      graph[exchange.toCurrency][exchange.fromCurrency] = {
        rate: 1 / exchange.sellRate,
        exchangeHouse: house.name,
        isBuy: false
      };
    });
  });

  return graph;
}

function bellmanFord(graph: Graph, start: string, amount: number, maxSteps: number, allowRepetitions: boolean): ConversionResult {
  const distances: { [key: string]: number[] } = {};
  const predecessors: { [key: string]: (string | null)[] } = {};
  const exchangeHouses: { [key: string]: string[] } = {};
  const isBuy: { [key: string]: boolean[] } = {};

  Object.keys(graph).forEach(node => {
    distances[node] = new Array(maxSteps + 1).fill(node === start ? amount : -Infinity);
    predecessors[node] = new Array(maxSteps + 1).fill(null);
    exchangeHouses[node] = new Array(maxSteps + 1).fill('');
    isBuy[node] = new Array(maxSteps + 1).fill(false);
  });

  for (let step = 1; step <= maxSteps; step++) {
    let updated = false;
    Object.keys(graph).forEach(from => {
      Object.keys(graph[from]).forEach(to => {
        const rate = graph[from][to].rate;
        const newAmount = distances[from][step - 1] * rate;
        if (newAmount > distances[to][step] && (allowRepetitions || from !== predecessors[to][step - 1])) {
          distances[to][step] = newAmount;
          predecessors[to][step] = from;
          exchangeHouses[to][step] = graph[from][to].exchangeHouse;
          isBuy[to][step] = graph[from][to].isBuy;
          updated = true;
        }
      });
    });
    if (!updated) break;
  }

  // Find the currency with the maximum final amount at the last step
  let maxCurrency = Object.keys(distances).reduce((a, b) => distances[a][maxSteps] > distances[b][maxSteps] ? a : b);

  // Reconstruct the path
  const path: ConversionStep[] = [];
  let current = maxCurrency;
  for (let step = maxSteps; step > 0; step--) {
    const prev = predecessors[current][step];
    if (prev === null) break;
    path.unshift({
      exchangeHouse: exchangeHouses[current][step],
      from: prev,
      to: current,
      fromAmount: distances[prev][step - 1],
      toAmount: distances[current][step],
      rate: graph[prev][current].rate,
      isBuy: isBuy[current][step]
    });
    current = prev;
  }

  const finalAmount = distances[maxCurrency][maxSteps];
  const profit = finalAmount - amount;
  const profitPercentage = (profit / amount) * 100;

  // Calculate alternative paths
  const allPaths = Object.keys(distances).map(currency => ({
    currency,
    profit: distances[currency][maxSteps] - amount,
    profitPercentage: ((distances[currency][maxSteps] - amount) / amount) * 100
  })).sort((a, b) => b.profit - a.profit);

  return {
    initialAmount: amount,
    finalAmountInUSD: finalAmount, // Assuming USD as the base currency
    profit,
    profitPercentage,
    path,
    allPaths
  };
}

export function findBestConversionPath(
  amount: number,
  startCurrency: string,
  exchangeHouses: ExchangeHouse[],
  maxSteps: number,
  allowRepetitions: boolean
): ConversionResult {
  const graph = buildGraph(exchangeHouses);
  const result = bellmanFord(graph, startCurrency, amount, maxSteps, allowRepetitions);

  // Si no se encontró una ruta válida, devuelve un resultado con valores predeterminados
  if (result.path.length === 0) {
    return {
      initialAmount: amount,
      finalAmountInUSD: amount,
      profit: 0,
      profitPercentage: 0,
      path: [],
      allPaths: Object.keys(graph).map(currency => ({
        currency,
        profit: currency === startCurrency ? 0 : null,
        profitPercentage: currency === startCurrency ? 0 : null
      }))
    };
  }

  return result;
}
