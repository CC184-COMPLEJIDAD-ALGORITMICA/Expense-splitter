import { AnyExpense, User, Split } from '~/types';
import { floydWarshall } from './floydWarshall';
import { calculateIndividualSplits } from './calculateIndividualSplits';

// Función existente, renombrada para claridad
export function calculateEqualSplits(expenses: AnyExpense[], participants: User[]): Split[] {
  const balances = calculateBalances(expenses, participants);
  console.log('Calculated balances:', balances);

  const initialSplits: Split[] = [];

  // Crear splits iniciales basados en los balances
  Object.entries(balances).forEach(([payer, balance]) => {
    if (balance > 0) {
      Object.entries(balances).forEach(([receiver, receiverBalance]) => {
        if (receiverBalance < 0) {
          const amount = Math.min(balance, -receiverBalance);
          if (amount > 0.01) {
            initialSplits.push({
              from: payer,
              to: receiver,
              amount: parseFloat(amount.toFixed(2))
            });
          }
        }
      });
    }
  });

  console.log('Initial splits:', initialSplits);

  // Aplicar el algoritmo de Floyd-Warshall
  const optimizedSplits = floydWarshall(initialSplits);

  console.log('Optimized splits:', optimizedSplits);
  return optimizedSplits;
}

// Nueva función para calcular divisiones basadas en gastos individuales
export { calculateIndividualSplits };

function calculateBalances(expenses: AnyExpense[], participants: User[]): { [key: string]: number } {
  const balances: { [key: string]: number } = {};
  participants.forEach(p => balances[p.username] = 0);

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const sharePerPerson = totalExpense / participants.length;

  expenses.forEach(expense => {
    const paidByUser = participants.find(p => p.id === expense.paidBy);
    const paidBy = paidByUser ? paidByUser.username : expense.paidBy;
    balances[paidBy] = (balances[paidBy] || 0) + expense.amount;
  });

  participants.forEach(person => {
    balances[person.username] -= sharePerPerson;
  });

  return balances;
}
