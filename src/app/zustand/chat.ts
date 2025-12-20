import { create } from 'zustand';

import { get, post } from '../utils/fetch';
import type { ChatMessageDTO, ChatRoomDTO } from '../interfaces/chat';
import type { UserDTO } from '../interfaces/user';

export interface IChatState {
  rooms: ChatRoomDTO[];
  contacts: UserDTO[];

  activeRoomId: string | null;
  messages: ChatMessageDTO[];

  isLoadingRooms: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;

  loadRooms: () => Promise<void>;
  loadContacts: () => Promise<void>;
  selectRoom: (roomId: string | null) => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;

  createDirectRoom: (otherUserId: string) => Promise<ChatRoomDTO | null>;
  sendMessage: (roomId: string, content: string) => Promise<boolean>;

  reset: () => void;
}

export const useChatStore = create<IChatState>((set, getState) => ({
  rooms: [],
  contacts: [],

  activeRoomId: null,
  messages: [],

  isLoadingRooms: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,

  reset: () => {
    set({
      rooms: [],
      contacts: [],
      activeRoomId: null,
      messages: [],
      isLoadingRooms: false,
      isLoadingMessages: false,
      isSending: false,
      error: null,
    });
  },

  loadRooms: async () => {
    try {
      set({ isLoadingRooms: true, error: null });
      const resp: any = await get<ChatRoomDTO[]>('chat/rooms');
      set({ rooms: Array.isArray(resp) ? resp : [] });
    } catch (e: any) {
      set({ rooms: [], error: e?.message || 'Error al cargar chats' });
    } finally {
      set({ isLoadingRooms: false });
    }
  },

  loadContacts: async () => {
    try {
      const resp: any = await get<UserDTO[]>('chat/contacts');
      set({ contacts: Array.isArray(resp) ? resp : [] });
    } catch {
      set({ contacts: [] });
    }
  },

  selectRoom: async (roomId: string | null) => {
    if (!roomId) {
      set({ activeRoomId: null, messages: [] });
      return;
    }

    set({ activeRoomId: roomId });
    await getState().loadMessages(roomId);
  },

  loadMessages: async (roomId: string) => {
    try {
      set({ isLoadingMessages: true, error: null });
      const resp: any = await get<ChatMessageDTO[]>(`chat/rooms/${roomId}/messages`);
      set({ messages: Array.isArray(resp) ? resp : [] });
    } catch (e: any) {
      set({ messages: [], error: e?.message || 'Error al cargar mensajes' });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  createDirectRoom: async (otherUserId: string) => {
    try {
      set({ error: null });
      const resp: any = await post<ChatRoomDTO>('chat/rooms', {
        type: 'INDIVIDUAL',
        participantIds: [otherUserId],
      });

      if (resp?.id) {
        // Upsert into rooms list
        set((state) => {
          const exists = state.rooms.some((r) => r.id === resp.id);
          return {
            rooms: exists ? state.rooms.map((r) => (r.id === resp.id ? resp : r)) : [resp, ...state.rooms],
          };
        });

        set({ activeRoomId: resp.id });
        await getState().loadMessages(resp.id);
        return resp;
      }

      return null;
    } catch (e: any) {
      set({ error: e?.message || 'No se pudo crear el chat' });
      return null;
    }
  },

  sendMessage: async (roomId: string, content: string) => {
    const text = (content ?? '').trim();
    if (!text) return false;

    try {
      set({ isSending: true, error: null });
      const resp: any = await post<ChatMessageDTO>(`chat/rooms/${roomId}/messages`, { content: text });

      if (resp?.id) {
        // Append message
        set((state) => ({
          messages: [...state.messages, resp],
          rooms: state.rooms.map((r) => (r.id === roomId ? { ...r, messages: [resp] } : r)),
        }));
        return true;
      }

      return false;
    } catch (e: any) {
      set({ error: e?.message || 'No se pudo enviar el mensaje' });
      return false;
    } finally {
      set({ isSending: false });
    }
  },
}));
