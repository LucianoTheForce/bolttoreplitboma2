import { initSession, initPublisher } from '@vonage/client-sdk-video';

const API_KEY = import.meta.env.VITE_VONAGE_API_KEY;
const SESSION_ID = import.meta.env.VITE_VONAGE_SESSION_ID;
const TOKEN = import.meta.env.VITE_VONAGE_TOKEN;

export const validateCredentials = () => {
  if (!API_KEY || !SESSION_ID || !TOKEN) {
    throw new Error('Missing required Vonage credentials in environment variables');
  }
  
  if (TOKEN === 'YOUR_TOKEN' || SESSION_ID === 'YOUR_SESSION_ID') {
    throw new Error('Invalid Vonage credentials. Please update the environment variables.');
  }
};

export const initializePublisher = (containerId: string) => {
  validateCredentials();
  
  return initPublisher(containerId, {
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
  });
};

export const createSession = () => {
  validateCredentials();
  return initSession(API_KEY, SESSION_ID);
};

export const connectToSession = async (session: any) => {
  validateCredentials();
  
  return new Promise<void>((resolve, reject) => {
    session.connect(TOKEN, (error: Error) => {
      if (error) {
        console.error('Session connection error:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const publishToSession = async (session: any, publisher: any) => {
  return new Promise<void>((resolve, reject) => {
    session.publish(publisher, (error: Error) => {
      if (error) {
        console.error('Publishing error:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const subscribeToStream = (session: any, stream: any, containerId: string) => {
  session.subscribe(stream, containerId, {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    showControls: false,
    style: {
      buttonDisplayMode: 'off',
      nameDisplayMode: 'off',
    },
    fitMode: 'cover'
  });
};

export const destroyPublisher = async (publisher: any) => {
  return new Promise<void>((resolve) => {
    try {
      if (publisher && typeof publisher.destroy === 'function') {
        publisher.destroy();
      }
    } catch (err) {
      console.error('Error destroying publisher:', err);
    }
    resolve();
  });
};

export const disconnectSession = async (session: any) => {
  return new Promise<void>((resolve) => {
    try {
      if (session && typeof session.disconnect === 'function') {
        session.disconnect();
      }
    } catch (err) {
      console.error('Error disconnecting session:', err);
    }
    resolve();
  });
};