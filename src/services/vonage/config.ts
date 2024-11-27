import { VonageConnectionOptions } from '../../types/vonage';

export const vonageConfig: VonageConnectionOptions = {
  apiKey: import.meta.env.VITE_VONAGE_API_KEY,
  sessionId: import.meta.env.VITE_VONAGE_SESSION_ID,
  token: import.meta.env.VITE_VONAGE_TOKEN,
};

export const validateConfig = () => {
  const { apiKey, sessionId, token } = vonageConfig;
  
  if (!apiKey || !sessionId || !token) {
    throw new Error('Missing required Vonage credentials in environment variables');
  }
  
  if (sessionId === 'YOUR_SESSION_ID' || token === 'YOUR_TOKEN') {
    throw new Error('Invalid Vonage credentials. Please update the environment variables.');
  }

  // Validate token format
  if (!token.startsWith('T1==')) {
    throw new Error('Invalid token format. Token must start with "T1=="');
  }

  // Validate API key format (should be a string of numbers)
  if (!/^\d+$/.test(apiKey)) {
    throw new Error('Invalid API key format. API key should be a string of numbers');
  }

  // Validate session ID format (should start with number_MX followed by the API key)
  const expectedPrefix = `2_MX${apiKey}`;
  if (!sessionId.startsWith(expectedPrefix)) {
    throw new Error('Invalid session ID format');
  }
};