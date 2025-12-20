import { create } from 'zustand';

import { post, patch, del } from '../utils/fetch';

export interface CreateEventDateInput {
  date: string; // YYYY-MM-DD or ISO
  startTime?: string;
  endTime?: string;
  price?: number;
  capacity?: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  category: string;

  imageUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  isFeatured?: boolean;

  dates: CreateEventDateInput[];

  // Location
  locationName?: string;
  department?: string;
  province?: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface IEventCreateState {
  isSubmitting: boolean;
  error: string | null;

  createEvent: (dto: CreateEventInput) => Promise<any | null>;
  updateEvent: (eventId: string, dto: CreateEventInput) => Promise<any | null>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  reset: () => void;
}

export const useEventCreateStore = create<IEventCreateState>((set) => ({
  isSubmitting: false,
  error: null,

  reset: () => set({ isSubmitting: false, error: null }),

  createEvent: async (dto: CreateEventInput) => {
    try {
      set({ isSubmitting: true, error: null });
      const resp: any = await post('events', dto);
      if (resp?.id) return resp;
      if (resp?.message) {
        set({ error: resp.message });
      } else {
        set({ error: 'No se pudo crear el evento' });
      }
      return null;
    } catch (e: any) {
      set({ error: e?.message || 'No se pudo crear el evento' });
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateEvent: async (eventId: string, dto: CreateEventInput) => {
    try {
      set({ isSubmitting: true, error: null });
      const resp: any = await patch(`events/${eventId}`, dto);
      if (resp?.id) return resp;
      if (resp?.message) {
        set({ error: resp.message });
      } else {
        set({ error: 'No se pudo actualizar el evento' });
      }
      return null;
    } catch (e: any) {
      set({ error: e?.message || 'No se pudo actualizar el evento' });
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteEvent: async (eventId: string) => {
    try {
      set({ isSubmitting: true, error: null });
      const resp: any = await del(`events/${eventId}`);
      if (resp?.message) {
        return true;
      }
      return false;
    } catch (e: any) {
      set({ error: e?.message || 'No se pudo eliminar el evento' });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
