import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  url: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <QRCode 
        value={url} 
        size={200} 
        className="bg-white p-4 rounded-lg"
      />
    </div>
  );
};