import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Loader } from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { useStreamStore } from '../store/streamStore';

export const UserView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userId] = useState(() => crypto.randomUUID());
  const { addToQueue, getPosition, removeFromQueue, initializeRealtimeSubscription } = useQueueStore();
  const { streams, setStream } = useStreamStore();
  
  useEffect(() => {
    const cleanup = initializeRealtimeSubscription();
    return () => cleanup();
  }, [initializeRealtimeSubscription]);

  useEffect(() => {
    if (id) {
      addToQueue(id, userId).catch(console.error);
      
      return () => {
        removeFromQueue(id, userId).catch(console.error);
      };
    }
  }, [id, userId, addToQueue, removeFromQueue]);

  const position = id ? getPosition(id, userId) : 0;
  const isStreaming = streams[id!]?.userId === userId;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {isStreaming ? (
        <div className="w-full max-w-lg">
          <Camera className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-white text-xl text-center mb-4">Você está ao vivo!</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
            {/* Stream preview will be handled by WebRTC */}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-white text-2xl mb-2">Fila de Espera</p>
          <p className="text-gray-300 text-xl">
            {position > 1 
              ? `${position - 1} pessoas na sua frente`
              : 'Você é o próximo!'}
          </p>
        </div>
      )}
    </div>
  );
};