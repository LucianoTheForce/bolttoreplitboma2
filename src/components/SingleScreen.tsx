import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ThankYouScreen } from './ThankYouScreen';
import { useStreamStore } from '../store/streamStore';

export const SingleScreen: React.FC = () => {
  const { id = "1" } = useParams<{ id: string }>();
  const [showThankYou, setShowThankYou] = useState(false);
  const screenId = `screen-${id}`;
  const qrUrl = `${window.location.origin}/join/${screenId}`;
  
  const { streams, initializeRealtimeSubscription } = useStreamStore();
  const currentStream = streams[screenId];

  useEffect(() => {
    const cleanup = initializeRealtimeSubscription();
    return () => cleanup();
  }, [initializeRealtimeSubscription]);

  useEffect(() => {
    let streamTimer: NodeJS.Timeout;
    let thankYouTimer: NodeJS.Timeout;

    if (currentStream?.active) {
      streamTimer = setTimeout(() => {
        setShowThankYou(true);
        thankYouTimer = setTimeout(() => {
          setShowThankYou(false);
        }, 5000);
      }, 60000);
    }

    return () => {
      if (streamTimer) clearTimeout(streamTimer);
      if (thankYouTimer) clearTimeout(thankYouTimer);
    };
  }, [currentStream?.active]);

  return (
    <div 
      className="relative bg-black overflow-hidden w-screen h-screen"
    >
      {showThankYou ? (
        <ThankYouScreen />
      ) : (
        <>
          {currentStream?.active ? (
            <div className="w-full h-full">
              {/* Stream content will be handled by WebRTC */}
            </div>
          ) : (
            <QRCodeDisplay url={qrUrl} />
          )}
        </>
      )}
    </div>
  );
};