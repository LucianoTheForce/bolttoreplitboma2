import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useQueueStore } from '../store/queueStore';
import { Monitor } from 'lucide-react';
import { initializeVonageSession } from '../services/vonageService';

interface DisplayScreenProps {
  screenId: string;
  resolution: { width: number; height: number };
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({ screenId, resolution }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { queues } = useQueueStore();

  const qrUrl = `${window.location.origin}/join/${screenId}`;

  useEffect(() => {
    if (currentUser) {
      const containerId = `vonage-container-${screenId}`;
      // Note: In production, these values should come from your backend
      const sessionId = 'YOUR_SESSION_ID';
      const token = 'YOUR_TOKEN';

      initializeVonageSession(sessionId, token, containerId)
        .catch(error => console.error('Failed to initialize Vonage session:', error));
    }
  }, [currentUser, screenId]);

  return (
    <div 
      className="relative bg-black"
      style={{ 
        width: resolution.width,
        height: resolution.height
      }}
    >
      {!currentUser ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <Monitor className="w-24 h-24 text-white mb-8" />
          <div className="bg-white p-8 rounded-lg">
            <QRCode value={qrUrl} size={256} />
          </div>
          <p className="text-white text-2xl mt-8">Scan to Join the Experience</p>
          <p className="text-gray-400 mt-4">People in queue: {(queues[screenId] || []).length}</p>
        </div>
      ) : (
        <div id={`vonage-container-${screenId}`} className="w-full h-full" />
      )}
    </div>
  );
};