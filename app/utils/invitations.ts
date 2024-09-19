import { db } from "~/db.server";
import { Invitation } from "~/types";

export async function inviteUserToJunta(juntaId: string, invitedUserId: string, inviterId: string) {
  try {
    console.log("Creating invitation with:", { juntaId, invitedUserId, inviterId });
    const invitation = await db.invitation.create({
      data: {
        juntaId,
        invitedUserId,
        inviterId,
        status: "PENDING"
      },
      include: {
        junta: { select: { name: true } },
        inviter: { select: { username: true } },
        invitedUser: { select: { username: true } }
      }
    });
    console.log("Created invitation:", invitation);
    return { success: true, message: "Invitation sent successfully", invitation };
  } catch (error) {
    console.error("Error creating invitation:", error);
    return { success: false, message: "Failed to create invitation" };
  }
}

export async function getInvitations(userId: string): Promise<Invitation[]> {
  try {
    console.log("Fetching invitations for user:", userId);
    console.log("DB object:", db);
    
    if (!db) {
      console.error("Database not initialized");
      return [];
    }

    if (!db.invitation) {
      console.error("Invitation model not available");
      return [];
    }

    const invitations = await db.invitation.findMany({
      where: { 
        invitedUserId: userId, 
        status: "PENDING" 
      },
      include: { 
        junta: { 
          select: { 
            id: true,
            name: true 
          } 
        },
        inviter: { 
          select: { 
            id: true,
            username: true 
          } 
        }
      }
    });
    console.log("Fetched invitations:", JSON.stringify(invitations, null, 2));
    return invitations;
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return [];
  }
}

export async function respondToInvitation(invitationId: string, accept: boolean) {
  try {
    console.log("Responding to invitation:", { invitationId, accept });
    if (accept) {
      const invitation = await db.invitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
        include: { junta: true, invitedUser: true }
      });

      await db.junta.update({
        where: { id: invitation.juntaId },
        data: { members: { connect: { id: invitation.invitedUserId } } } }
      );

      console.log("Invitation accepted and user added to junta");
    } else {
      await db.invitation.update({
        where: { id: invitationId },
        data: { status: "REJECTED" }
      });
      console.log("Invitation rejected");
    }
    return { success: true, message: accept ? "Invitation accepted" : "Invitation rejected" };
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return { success: false, message: "Failed to respond to invitation" };
  }
}