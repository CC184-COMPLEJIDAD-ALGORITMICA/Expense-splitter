export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  rate: number;
  path: string[];
}

export function floydWarshallAlgorithm(exchangeRates: ExchangeRate[]): ConversionResult[] {
    const currencies = Array.from(new Set(exchangeRates.flatMap(rate => [rate.from, rate.to])));
    const n = currencies.length;
    const dist: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    const next: number[][] = Array(n).fill(null).map(() => Array(n).fill(null));

    // Initialize distances and next pointers
    currencies.forEach((c, i) => dist[i][i] = 0);
    exchangeRates.forEach(rate => {
        const i = currencies.indexOf(rate.from);
        const j = currencies.indexOf(rate.to);
        dist[i][j] = -Math.log(rate.rate);
        next[i][j] = j;
    });

    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    // Construct results
    const results: ConversionResult[] = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j && isFinite(dist[i][j])) {
                const path = reconstructPath(next, i, j, currencies);
                results.push({
                    from: currencies[i],
                    to: currencies[j],
                    rate: Math.exp(-dist[i][j]),
                    path: path
                });
            }
        }
    }

    return results;
}

function reconstructPath(next: number[][], start: number, end: number, currencies: string[]): string[] {
    if (next[start][end] === null) return [];
    const path = [currencies[start]];
    while (start !== end) {
        start = next[start][end];
        path.push(currencies[start]);
    }
    return path;
}