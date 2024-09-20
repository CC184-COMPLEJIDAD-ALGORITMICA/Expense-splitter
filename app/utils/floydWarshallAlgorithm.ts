export interface Transaction {
  name: string;
  description?: string;
  from: string;
  to: string;
  amount: number;
  emitter?: string;
  recipient?: string;
}

export interface ConversionResult {
  from: string;
  to: string;
  rate: number;
  path: string[];
}

export function floydWarshallAlgorithm(transactions: Transaction[], exchangeRates: Record<string, number>): ConversionResult[] {
    const currencies = Array.from(new Set(transactions.flatMap(t => [t.from, t.to])));
    const n = currencies.length;
    const dist: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));
    const next: number[][] = Array(n).fill(null).map(() => Array(n).fill(null));

    // Initialize distances and next pointers
    currencies.forEach((c, i) => dist[i][i] = 0);
    currencies.forEach((from, i) => {
        currencies.forEach((to, j) => {
            if (from !== to) {
                const rate = exchangeRates[to] / exchangeRates[from];
                dist[i][j] = -Math.log(rate);
                next[i][j] = j;
            }
        });
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