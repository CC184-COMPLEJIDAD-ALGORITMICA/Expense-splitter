import { useState, useEffect } from "react";
import { Invitation } from "~/types";

export function NotificationInbox({ 
  userId, 
  initialInvitations, 
  onInvitationResponse 
}: { 
  userId: string, 
  initialInvitations: Invitation[], 
  onInvitationResponse: (invitationId: string, accept: boolean) => Promise<{ success: boolean, message: string, junta?: any }>
}) {
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [responseMessages, setResponseMessages] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState<{[key: string]: boolean}>({});

  const handleInvitationResponse = async (invitationId: string, accept: boolean) => {
    if (isProcessing[invitationId]) return;
    
    setIsProcessing(prev => ({...prev, [invitationId]: true}));
    try {
      const result = await onInvitationResponse(invitationId, accept);
      setResponseMessages(prev => ({...prev, [invitationId]: result.message}));
      if (result.success) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        // Aquí podrías actualizar el estado global de las juntas si es necesario
        // Por ejemplo: updateJuntas(result.junta);
      }
      // Configurar un temporizador para limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setResponseMessages(prev => {
          const newMessages = {...prev};
          delete newMessages[invitationId];
          return newMessages;
        });
      }, 5000);
    } catch (error) {
      console.error("Error processing invitation response:", error);
      setResponseMessages(prev => ({...prev, [invitationId]: "An error occurred. Please try again. (Maybe just need to reload the page and look for your groups)"}));
    } finally {
      setIsProcessing(prev => ({...prev, [invitationId]: false}));
    }
  };

  if (invitations.length === 0 && Object.keys(responseMessages).length === 0) {
    return (
      <p className="text-gray-500 italic">
        No pending invitations. Try refreshing the page to check for new invitations.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-600">Invitations</h2>
      {invitations.map((invitation) => (
        <div key={invitation.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <p className="text-lg mb-2">
            <span className="font-semibold text-blue-500">{invitation.inviter.username}</span> invited you to join 
            <span className="font-semibold text-green-500"> {invitation.junta.name}</span>
          </p>
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => handleInvitationResponse(invitation.id, true)}
              className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${isProcessing[invitation.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing[invitation.id]}
            >
              {isProcessing[invitation.id] ? 'Processing...' : 'Accept'}
            </button>
            <button 
              onClick={() => handleInvitationResponse(invitation.id, false)}
              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ${isProcessing[invitation.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing[invitation.id]}
            >
              {isProcessing[invitation.id] ? 'Processing...' : 'Reject'}
            </button>
          </div>
          {responseMessages[invitation.id] && (
            <p className={`mt-2 text-sm ${isProcessing[invitation.id] ? 'text-yellow-600' : 'text-green-600'}`}>
              {responseMessages[invitation.id]}
            </p>
          )}
        </div>
      ))}
      {Object.entries(responseMessages).map(([invitationId, message]) => (
        <div key={invitationId} className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <p className="font-bold">Response:</p>
          <p>{message}</p>
        </div>
      ))}
    </div>
  );
}