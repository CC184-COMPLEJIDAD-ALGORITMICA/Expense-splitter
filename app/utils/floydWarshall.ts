import { Split } from '~/types';

export function floydWarshall(initialSplits: Split[]): Split[] {
  console.log('Initial splits:', initialSplits);

  const participants = Array.from(new Set(initialSplits.flatMap(split => [split.from, split.to])));
  console.log('Participants:', participants);

  const n = participants.length;
  const dist: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

  // Initialize distance matrix
  initialSplits.forEach(split => {
    const i = participants.indexOf(split.from);
    const j = participants.indexOf(split.to);
    dist[i][j] += split.amount;
    dist[j][i] -= split.amount;
  });
  console.log('Initial distance matrix:', dist);

  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (Math.abs(dist[i][k] + dist[k][j]) < Math.abs(dist[i][j])) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Construct optimized splits
  const optimizedSplits: Split[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const amount = parseFloat(dist[i][j].toFixed(2));
      if (amount > 0.01) {
        optimizedSplits.push({
          from: participants[i],
          to: participants[j],
          amount: amount
        });
      } else if (amount < -0.01) {
        optimizedSplits.push({
          from: participants[j],
          to: participants[i],
          amount: -amount
        });
      }
    }
  }
  console.log('Optimized splits:', optimizedSplits);

  return optimizedSplits;
}