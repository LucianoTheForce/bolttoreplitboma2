import { create } from 'zustand';
import { supabase, REALTIME_CHANNELS } from '../lib/supabase';

interface Stream {
  id: string;
  userId: string;
  active: boolean;
  startedAt: string;
}

interface StreamState {
  streams: Record<string, Stream>;
  setStream: (screenId: string, stream: Stream) => void;
  removeStream: (screenId: string) => void;
  initializeRealtimeSubscription: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  streams: {},
  setStream: (screenId, stream) => {
    set((state) => ({
      streams: { ...state.streams, [screenId]: stream }
    }));
  },
  removeStream: (screenId) => {
    set((state) => {
      const newStreams = { ...state.streams };
      delete newStreams[screenId];
      return { streams: newStreams };
    });
  },
  initializeRealtimeSubscription: () => {
    const channel = supabase.channel(REALTIME_CHANNELS.SCREENS)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Join:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Leave:', key, leftPresences);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
}));