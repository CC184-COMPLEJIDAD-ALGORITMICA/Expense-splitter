import { db } from "~/db.server";
import { inviteUserToJunta } from "~/utils/invitations";
import { json } from "@remix-run/node";
import { ActionData } from "../types";



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

    return json({ success: true, junta });
  } catch (error) {
    console.error("Error creating junta:", error);
    return json({ success: false, error: "Failed to create junta" }, { status: 500 });
  }
}

export async function clearJunta(juntaId: string) {
  try {
    await db.juntaExpense.deleteMany({
      where: { juntaId }
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error clearing junta:", error);
    return json({ success: false, error: "Failed to clear junta" }, { status: 500 });
  }
}

export async function inviteToJunta(juntaId: string, invitedUsername: string, inviterId: string) {
  try {
    const invitedUser = await db.user.findUnique({ where: { username: invitedUsername } });
    if (!invitedUser) {
      return json({ success: false, message: "User not found" } as ActionData);
    }

    const result = await inviteUserToJunta(juntaId, invitedUser.id, inviterId);
    return json({ success: true, message: "Invitation sent successfully" } as ActionData);
  } catch (error) {
    console.error("Error inviting user:", error);
    return json({ success: false, message: "An error occurred while sending the invitation" } as ActionData);
  }
}

export const juntaActions = {
  createJunta,
  clearJunta,
  inviteToJunta
};
