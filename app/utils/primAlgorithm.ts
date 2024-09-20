export interface Account {
  name: string;
  balance: number;
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export function primAlgorithm(accounts: Account[]): Transfer[] {
    const transfers: Transfer[] = [];
    const n = accounts.length;
    const visited = new Array(n).fill(false);
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const averageBalance = totalBalance / n;

    visited[0] = true;

    for (let i = 0; i < n - 1; i++) {
        let minCost = Infinity;
        let fromIndex = -1;
        let toIndex = -1;

        for (let j = 0; j < n; j++) {
            if (visited[j]) {
                for (let k = 0; k < n; k++) {
                    if (!visited[k]) {
                        const amount = Math.min(
                            Math.abs(accounts[j].balance - averageBalance),
                            Math.abs(accounts[k].balance - averageBalance)
                        );
                        if (amount < minCost) {
                            minCost = amount;
                            fromIndex = j;
                            toIndex = k;
                        }
                    }
                }
            }
        }

        if (fromIndex !== -1 && toIndex !== -1) {
            const amount = minCost;
            transfers.push({
                from: accounts[fromIndex].name,
                to: accounts[toIndex].name,
                amount: Number(amount.toFixed(2))
            });
            accounts[fromIndex].balance -= amount;
            accounts[toIndex].balance += amount;
            visited[toIndex] = true;
        }
    }

    return transfers;
}