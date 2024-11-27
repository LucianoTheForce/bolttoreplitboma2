import { initSession } from '@vonage/client-sdk-video';
import { 
  VonageSession, 
  VonagePublisher, 
  VonageStream,
  VonageSubscriberOptions,
  VonageError
} from '../../types/vonage';
import { vonageConfig, validateConfig } from './config';

const defaultSubscriberOptions: VonageSubscriberOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  showControls: false,
  style: {
    buttonDisplayMode: 'off',
    nameDisplayMode: 'off',
  },
  fitMode: 'cover'
};

export const createSession = (): VonageSession => {
  validateConfig();
  const session = initSession(vonageConfig.apiKey, vonageConfig.sessionId);
  
  // Add error event handler
  session.on('sessionDisconnected', (event: any) => {
    console.error('Session disconnected:', event);
  });

  session.on('connectionCreated', () => {
    console.log('Connection created');
  });

  session.on('connectionDestroyed', () => {
    console.log('Connection destroyed');
  });

  return session;
};

export const connectToSession = async (session: VonageSession): Promise<void> => {
  validateConfig();
  
  return new Promise<void>((resolve, reject) => {
    try {
      session.connect(vonageConfig.token, (error?: VonageError) => {
        if (error) {
          console.error('Session connection error:', error);
          reject(error);
        } else {
          console.log('Successfully connected to session');
          resolve();
        }
      });
    } catch (error) {
      console.error('Error connecting to session:', error);
      reject(error);
    }
  });
};

export const publishToSession = async (
  session: VonageSession, 
  publisher: VonagePublisher
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      session.publish(publisher, (error?: VonageError) => {
        if (error) {
          console.error('Publishing error:', error);
          reject(error);
        } else {
          console.log('Successfully published to session');
          resolve();
        }
      });
    } catch (error) {
      console.error('Error publishing to session:', error);
      reject(error);
    }
  });
};

export const subscribeToStream = (
  session: VonageSession,
  stream: VonageStream,
  containerId: string,
  options: Partial<VonageSubscriberOptions> = {}
): void => {
  try {
    session.subscribe(
      stream,
      containerId,
      { ...defaultSubscriberOptions, ...options },
      (error?: VonageError) => {
        if (error) {
          console.error('Error subscribing to stream:', error);
        } else {
          console.log('Successfully subscribed to stream');
        }
      }
    );
  } catch (error) {
    console.error('Error setting up stream subscription:', error);
  }
};

export const disconnectSession = async (session: VonageSession): Promise<void> => {
  return new Promise<void>((resolve) => {
    try {
      if (session?.disconnect) {
        session.disconnect();
        console.log('Session disconnected successfully');
      }
    } catch (err) {
      console.error('Error disconnecting session:', err);
    }
    resolve();
  });
};