import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Invitation } from "~/types";

export function NotificationInbox({ 
  userId, 
  initialInvitations, 
  onInvitationResponse 
}: { 
  userId: string, 
  initialInvitations: Invitation[], 
  onInvitationResponse: (invitationId: string, accept: boolean) => void
}) {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);

  const handleInvitationResponse = (invitationId: string, accept: boolean) => {
    onInvitationResponse(invitationId, accept);
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };

  if (invitations.length === 0) return <p>No pending invitations</p>;

  return (
    <div>
      <h2>Invitations</h2>
      {invitations.map((invitation) => (
        <div key={invitation.id} className="mb-4 p-4 border rounded">
          <p>{invitation.inviter.username} invited you to {invitation.junta.name}</p>
          <button onClick={() => handleInvitationResponse(invitation.id, true)}>Accept</button>
          <button onClick={() => handleInvitationResponse(invitation.id, false)}>Reject</button>
        </div>
      ))}
    </div>
  );
}