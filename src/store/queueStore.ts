import { create } from 'zustand';
import { supabase, REALTIME_CHANNELS } from '../lib/supabase';

interface QueueState {
  queues: Record<string, string[]>;
  addToQueue: (screenId: string, userId: string) => Promise<void>;
  removeFromQueue: (screenId: string, userId: string) => Promise<void>;
  getPosition: (screenId: string, userId: string) => number;
  initializeRealtimeSubscription: () => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queues: {},
  addToQueue: async (screenId, userId) => {
    const { error } = await supabase
      .from('queues')
      .insert([{ screen_id: screenId, user_id: userId }]);

    if (error) throw error;

    set((state) => ({
      queues: {
        ...state.queues,
        [screenId]: [...(state.queues[screenId] || []), userId]
      }
    }));
  },
  removeFromQueue: async (screenId, userId) => {
    const { error } = await supabase
      .from('queues')
      .delete()
      .match({ screen_id: screenId, user_id: userId });

    if (error) throw error;

    set((state) => ({
      queues: {
        ...state.queues,
        [screenId]: (state.queues[screenId] || []).filter(id => id !== userId)
      }
    }));
  },
  getPosition: (screenId, userId) => {
    const queue = get().queues[screenId] || [];
    return queue.indexOf(userId) + 1;
  },
  initializeRealtimeSubscription: () => {
    const channel = supabase.channel(REALTIME_CHANNELS.QUEUE)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Queue state:', state);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
}));