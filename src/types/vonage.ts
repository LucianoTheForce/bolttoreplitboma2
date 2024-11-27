import { Session, Publisher, Stream, SubscriberProperties, PublisherProperties } from '@vonage/client-sdk-video';

export interface VonageError extends Error {
  code?: number;
  name?: string;
}

export interface StreamEvent {
  stream: Stream;
}

export interface VonageSessionEvents {
  streamCreated: (event: StreamEvent) => void;
  streamDestroyed: (event: StreamEvent) => void;
}

export interface VonageConnectionOptions {
  apiKey: string;
  sessionId: string;
  token: string;
}

export type VonageCallback = (error?: VonageError) => void;

export interface VonagePublisherOptions extends PublisherProperties {
  width?: string;
  height?: string;
  insertMode?: string;
  showControls?: boolean;
  style?: {
    buttonDisplayMode?: string;
    nameDisplayMode?: string;
  };
  videoSource?: boolean;
  audioSource?: boolean;
  resolution?: string;
  frameRate?: number;
  fitMode?: string;
}

export interface VonageSubscriberOptions extends SubscriberProperties {
  insertMode?: string;
  width?: string;
  height?: string;
  showControls?: boolean;
  style?: {
    buttonDisplayMode?: string;
    nameDisplayMode?: string;
  };
  fitMode?: string;
}

export type { Session as VonageSession, Publisher as VonagePublisher, Stream as VonageStream };