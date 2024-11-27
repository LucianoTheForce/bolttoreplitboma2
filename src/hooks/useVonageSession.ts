import { useState, useEffect, useCallback } from 'react';
import { VonageSession, VonagePublisher } from '../types/vonage';
import { 
  createSession, 
  connectToSession, 
  publishToSession, 
  createPublisher,
  subscribeToStream,
  validateConfig,
  disconnectSession,
  destroyPublisher
} from '../services/vonage';

export const useVonageSession = (containerId: string, isPublisher: boolean = false) => {
  const [session, setSession] = useState<VonageSession | null>(null);
  const [publisher, setPublisher] = useState<VonagePublisher | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const cleanup = useCallback(async () => {
    if (publisher) {
      await destroyPublisher(publisher);
      setPublisher(null);
    }
    if (session) {
      await disconnectSession(session);
      setSession(null);
    }
    setIsConnected(false);
    setIsStreaming(false);
  }, [publisher, session]);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const initSession = async () => {
      try {
        validateConfig();
        
        const sessionInstance = createSession();
        
        let publisherInstance = null;
        if (isPublisher) {
          publisherInstance = createPublisher(containerId);
        }
        
        if (!mounted) return;
        
        await connectToSession(sessionInstance);
        
        if (!mounted) {
          if (publisherInstance) await destroyPublisher(publisherInstance);
          await disconnectSession(sessionInstance);
          return;
        }

        setIsConnected(true);
        setRetryCount(0); // Reset retry count on successful connection

        if (isPublisher && publisherInstance) {
          await publishToSession(sessionInstance, publisherInstance);
          if (!mounted) {
            await destroyPublisher(publisherInstance);
            await disconnectSession(sessionInstance);
            return;
          }
          setIsStreaming(true);
        }

        const handleStreamCreated = (event: any) => {
          if (mounted && !isPublisher) {
            subscribeToStream(sessionInstance, event.stream, containerId);
            setIsStreaming(true);
          }
        };

        const handleStreamDestroyed = () => {
          if (mounted) {
            setIsStreaming(false);
          }
        };

        sessionInstance.on('streamCreated', handleStreamCreated);
        sessionInstance.on('streamDestroyed', handleStreamDestroyed);

        if (mounted) {
          setSession(sessionInstance);
          if (publisherInstance) setPublisher(publisherInstance);
        }
      } catch (err) {
        console.error('Vonage session error:', err);
        if (mounted) {
          setError(err as Error);
          await cleanup();

          // Implement retry logic
          if (retryCount < MAX_RETRIES) {
            const nextRetry = Math.min(1000 * Math.pow(2, retryCount), 10000);
            retryTimeout = setTimeout(() => {
              if (mounted) {
                setRetryCount(prev => prev + 1);
                initSession();
              }
            }, nextRetry);
          }
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      cleanup().catch(err => {
        console.error('Cleanup error:', err);
      });
    };
  }, [containerId, isPublisher, cleanup, retryCount]);

  return { session, publisher, error, isConnected, isStreaming };
};