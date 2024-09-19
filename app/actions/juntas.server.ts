import { db } from "~/db.server";
import { inviteUserToJunta } from "~/utils/invitations";
import { json } from "@remix-run/node";
import { ActionData, Junta, JuntaExpense } from "../types";

export async function createJunta(userId: string, juntaName: string) {
  try {
    const junta = await db.junta.create({
      data: {
        name: juntaName,
        ownerId: userId,
        members: {
          connect: { id: userId }
        }
      },
      include: {
        members: true,
        expenses: true
      }
    });

    // Convertir las fechas a cadenas
    const formattedJunta: Omit<Junta, "expenses"> & { 
      expenses: (Omit<JuntaExpense, "createdAt"> & { createdAt: string })[] 
    } = {
      ...junta,
      expenses: junta.expenses.map(expense => ({
        ...expense,
        createdAt: expense.createdAt.toISOString()
      }))
    };

    return json<ActionData>({ success: true, junta: formattedJunta });
  } catch (error) {
    console.error("Error creating junta:", error);
    return json<ActionData>({ success: false, error: "Failed to create junta" }, { status: 500 });
  }
}

export async function clearJunta(juntaId: string) {
  try {
    await db.juntaExpense.deleteMany({
      where: { juntaId }
    });

    return json<ActionData>({ success: true, message: "Junta cleared successfully" });
  } catch (error) {
    console.error("Error clearing junta:", error);
    return json<ActionData>({ success: false, error: "Failed to clear junta" }, { status: 500 });
  }
}

export async function inviteToJunta(juntaId: string, invitedUsername: string, inviterId: string) {
  try {
    const invitedUser = await db.user.findUnique({ where: { username: invitedUsername } });
    if (!invitedUser) {
      return json<ActionData>({ success: false, message: "User not found" });
    }

    const result = await inviteUserToJunta(juntaId, invitedUser.id, inviterId);
    return json<ActionData>({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error inviting user:", error);
    return json<ActionData>({ success: false, error: "An error occurred while sending the invitation" });
  }
}

export const juntaActions = {
  createJunta,
  clearJunta,
  inviteToJunta
};
