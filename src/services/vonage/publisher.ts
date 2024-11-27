import { initPublisher } from '@vonage/client-sdk-video';
import { VonagePublisher, VonagePublisherOptions } from '../../types/vonage';

const defaultPublisherOptions: VonagePublisherOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  showControls: false,
  style: {
    buttonDisplayMode: 'off',
    nameDisplayMode: 'off',
  },
  videoSource: true,
  audioSource: false,
  resolution: '1280x720',
  frameRate: 30,
  fitMode: 'cover'
};

export const createPublisher = (
  containerId: string, 
  options: Partial<VonagePublisherOptions> = {}
): VonagePublisher => {
  return initPublisher(
    containerId, 
    { ...defaultPublisherOptions, ...options }
  );
};

export const destroyPublisher = async (publisher: VonagePublisher): Promise<void> => {
  return new Promise<void>((resolve) => {
    try {
      if (publisher?.destroy) {
        publisher.destroy();
      }
    } catch (err) {
      console.error('Error destroying publisher:', err);
    }
    resolve();
  });
};