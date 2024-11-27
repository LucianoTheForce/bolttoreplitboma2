import { useEffect } from 'react';

export const useFullscreen = () => {
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        // Only request fullscreen after user interaction
        const element = document.documentElement;
        await element.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen not available:', err);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'f' || event.key === 'F') {
        enterFullscreen();
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.warn('Error exiting fullscreen:', err);
        });
      }
    };
  }, []);

  return {
    isFullscreenAvailable: document.fullscreenEnabled,
    enterFullscreen: () => document.documentElement.requestFullscreen(),
  };
};