import { create } from 'zustand';

import { get } from '../utils/fetch';
import type { Event } from '../interfaces/event';
import type { UserDTO } from '../interfaces/user';
import { mapEventFromBackend } from './events';

export interface FeedEventItem {
  event: Event;
  owner?: UserDTO;
  raw?: any;
}

export interface IEventFeedState {
  items: FeedEventItem[];
  page: number;
  totalPages: number;
  total: number;
  isLoading: boolean;
  error: string | null;

  loadFeed: (page?: number, limit?: number, append?: boolean) => Promise<void>;
  reset: () => void;
}

export const useEventFeedStore = create<IEventFeedState>((set, getState) => ({
  items: [],
  page: 1,
  totalPages: 1,
  total: 0,
  isLoading: false,
  error: null,

  reset: () => {
    set({ items: [], page: 1, totalPages: 1, total: 0, isLoading: false, error: null });
  },

  loadFeed: async (page: number = 1, limit: number = 12, append: boolean = false) => {
    try {
      set({ isLoading: true, error: null });
      const resp: any = await get(`events/feed?page=${page}&limit=${limit}`);

      const data = Array.isArray(resp?.data) ? resp.data : [];
      const mapped: FeedEventItem[] = data.map((raw: any) => ({
        raw,
        owner: raw?.user,
        event: mapEventFromBackend(raw),
      }));

      set((state) => ({
        items: append ? [...state.items, ...mapped] : mapped,
        page: resp?.page ?? page,
        total: resp?.total ?? data.length,
        totalPages: resp?.totalPages ?? 1,
      }));
    } catch (e: any) {
      set({ items: [], error: e?.message || 'Error al cargar el feed' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
