import { db } from "~/db.server";
import { Expense, JuntaExpense } from "~/types";

export async function addLocalExpense(userId: string, data: { description: string, amount: number, paidBy: string, splitAmong: string }): Promise<Expense> {
  const { description, amount, paidBy, splitAmong } = data;

  const newExpense = await db.expense.create({
    data: {
      description,
      amount,
      paidBy,
      splitAmong,
      isLocal: true,
      userId
    }
  });

  return newExpense as Expense;
}

export async function addJuntaExpense(userId: string, data: { juntaId: string, description: string, amount: number, splitAmong: string }): Promise<JuntaExpense> {
  const { juntaId, description, amount, splitAmong } = data;

  const newExpense = await db.juntaExpense.create({
    data: {
      description,
      amount,
      paidBy: userId,
      splitAmong,
      junta: { connect: { id: juntaId } },
    },
  });

  return newExpense as JuntaExpense;
}

export async function deleteExpense(expenseId: string) {
  await db.expense.delete({
    where: { id: expenseId }
  });

  return { success: true };
}
