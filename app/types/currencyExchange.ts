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
    initialCurrency: start,
    finalAmount: finalAmount,
    finalCurrency: maxCurrency,
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

  if (result.path.length === 0) {
    return {
      initialAmount: amount,
      initialCurrency: startCurrency,
      finalAmount: amount,
      finalCurrency: startCurrency,
      profit: 0,
      profitPercentage: 0,
      path: [],
      allPaths: []
    };
  }

  return result;
}

function convertAmount(graph: Graph, amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  if (graph[fromCurrency] && graph[fromCurrency][toCurrency]) {
    return amount * graph[fromCurrency][toCurrency].rate;
  }
  
  // Si no hay conversión directa, intentamos una conversión en dos pasos a través de USD
  if (graph[fromCurrency] && graph[fromCurrency]['USD'] && graph['USD'] && graph['USD'][toCurrency]) {
    const amountInUSD = amount * graph[fromCurrency]['USD'].rate;
    return amountInUSD * graph['USD'][toCurrency].rate;
  }
  
  console.warn(`No se pudo encontrar una tasa de conversión de ${fromCurrency} a ${toCurrency}.`);
  return amount; // Retornamos el monto original si no se puede convertir
}

function findUSDRate(graph: Graph, currency: string): number {
  if (graph[currency] && graph[currency]['USD']) {
    return graph[currency]['USD'].rate;
  }
  if (graph['USD'] && graph['USD'][currency]) {
    return 1 / graph['USD'][currency].rate;
  }
  // If direct conversion is not available, use a two-step conversion through a common currency (e.g., EUR)
  const commonCurrency = 'EUR';
  if (graph[currency] && graph[currency][commonCurrency] && graph[commonCurrency] && graph[commonCurrency]['USD']) {
    return graph[currency][commonCurrency].rate * graph[commonCurrency]['USD'].rate;
  }
  // If no conversion path is found, return 1 as a fallback (assuming 1:1 conversion)
  console.warn(`No USD conversion rate found for ${currency}. Assuming 1:1 conversion.`);
  return 1;
}
