import { db } from "~/db.server";
import { Invitation } from "~/types";

export async function inviteUserToJunta(juntaId: string, invitedUserId: string, inviterId: string) {
  try {
    // Verificar que el usuario no se esté invitando a sí mismo
    if (invitedUserId === inviterId) {
      return { success: false, message: "You cannot invite yourself" };
    }

    // Verificar si ya existe una invitación pendiente para este usuario en esta junta
    const existingInvitation = await db.invitation.findFirst({
      where: {
        juntaId,
        invitedUserId,
        status: "PENDING"
      }
    });

    if (existingInvitation) {
      return { success: false, message: "An invitation for this user is already pending" };
    }

    // Verificar si el usuario ya es miembro de la junta
    const junta = await db.junta.findUnique({
      where: { id: juntaId },
      include: { members: true }
    });

    if (junta?.members.some(member => member.id === invitedUserId)) {
      return { success: false, message: "This user is already a member of the junta" };
    }

    // Crear la invitación si todas las validaciones pasan
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
        data: { members: { connect: { id: invitation.invitedUserId } } }
      });

      console.log("Invitation accepted and user added to junta");
    } else {
      // Eliminar la invitación en lugar de marcarla como rechazada
      await db.invitation.delete({
        where: { id: invitationId }
      });
      console.log("Invitation rejected and deleted");
    }
    return { success: true, message: accept ? "Invitation accepted" : "Invitation rejected" };
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return { success: false, message: "Failed to respond to invitation" };
  }
}