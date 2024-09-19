import { AnyExpense, User, Split } from '~/types';

export function calculateIndividualSplits(expenses: AnyExpense[], participants: User[]): Split[] {
  const balances: { [key: string]: number } = {};
  participants.forEach(p => balances[p.id] = 0);

  // Calcular los balances iniciales
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = totalExpense / participants.length;

  expenses.forEach(expense => {
    balances[expense.paidBy] += expense.amount;
  });

  participants.forEach(p => {
    balances[p.id] -= averageExpense;
  });

  console.log("Balances iniciales:", balances);

  // Crear las divisiones
  const splits: Split[] = [];
  const debtors = participants.filter(p => balances[p.id] < 0);
  const creditors = participants.filter(p => balances[p.id] > 0);

  debtors.forEach(debtor => {
    let remainingDebt = -balances[debtor.id];
    creditors.forEach(creditor => {
      if (remainingDebt > 0 && balances[creditor.id] > 0) {
        const amount = Math.min(remainingDebt, balances[creditor.id]);
        if (amount > 0.01) {
          splits.push({
            from: debtor.username,
            to: creditor.username,
            amount: parseFloat(amount.toFixed(2))
          });
        }
        remainingDebt -= amount;
        balances[creditor.id] -= amount;
      }
    });
  });

  console.log("Splits calculados:", splits);

  return splits;
}