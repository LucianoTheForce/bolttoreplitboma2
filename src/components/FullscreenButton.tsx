import React from 'react';
import { Maximize2 } from 'lucide-react';

interface FullscreenButtonProps {
  onClick: () => void;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      title="Enter fullscreen (or press 'F')"
    >
      <Maximize2 className="w-6 h-6 text-white" />
    </button>
  );
};