import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeOverlayProps {
  url: string;
  screenId: string;
}

export const QRCodeOverlay: React.FC<QRCodeOverlayProps> = ({ url, screenId }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg">
      <QRCode value={url} size={200} />
      <p className="text-center mt-4 text-lg font-semibold">
        Scan to Join Screen {screenId}
      </p>
    </div>
  );
};