import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { Expense, JuntaExpense } from "~/types";

export async function addLocalExpense(userId: string, expenseData: { description: string; amount: number; paidBy: string; splitAmong: string }) {
  try {
    const expense = await db.expense.create({
      data: {
        ...expenseData,
        userId,
        isLocal: true
      }
    });

    return json({ success: true, expense });
  } catch (error) {
    console.error("Error adding local expense:", error);
    return json({ success: false, error: "Failed to add local expense" }, { status: 500 });
  }
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
  try {
    // Primero, intentamos eliminar un gasto local
    const deletedLocalExpense = await db.expense.delete({
      where: { id: expenseId },
    }).catch(() => null);

    // Si no se encontró un gasto local, intentamos eliminar un gasto de junta
    if (!deletedLocalExpense) {
      await db.juntaExpense.delete({
        where: { id: expenseId },
      });
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return json({ success: false, error: "Failed to delete expense" }, { status: 500 });
  }
}
