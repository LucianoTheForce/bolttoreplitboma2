import React from 'react';
import { Monitor } from 'lucide-react';

interface QueueDisplayProps {
  screenId: string;
  queueLength: number;
}

export const QueueDisplay: React.FC<QueueDisplayProps> = ({ screenId, queueLength }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <Monitor className="w-32 h-32 text-white mb-8" />
      <h1 className="text-white text-4xl mb-8">Screen {screenId}</h1>
      <p className="text-gray-400 text-xl mb-8">
        People in queue: {queueLength}
      </p>
    </div>
  );
};