declare module '@vonage/client-sdk-video' {
  export interface VonageSession {
    connect: (token: string, callback: (error?: Error) => void) => void;
    publish: (publisher: any, callback: (error?: Error) => void) => void;
    on: (event: string, callback: (event: any) => void) => void;
    subscribe: (stream: any, targetElement: string, options: any, callback: (error?: Error) => void) => void;
  }

  export interface VonagePublisher {
    insertMode: string;
    width: string;
    height: string;
  }

  export function initSession(apiKey: string, sessionId: string): VonageSession;
  export function initPublisher(targetElement: string, options: VonagePublisher, callback: (error?: Error) => void): any;
}