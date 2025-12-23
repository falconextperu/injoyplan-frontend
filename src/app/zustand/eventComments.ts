import { create } from 'zustand';

import { get, post, del, patch } from '../utils/fetch';
import type { UserDTO } from '../interfaces/user';

export interface EventCommentDTO {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: UserDTO;
  parentId?: string;
  replies?: EventCommentDTO[];
  isLiked?: boolean;
  _count?: {
    likes?: number;
    replies?: number;
  };
}

export interface IEventCommentsState {
  commentsByEvent: Record<string, EventCommentDTO[]>;
  totalByEvent: Record<string, number>;
  isLoadingByEvent: Record<string, boolean>;
  errorByEvent: Record<string, string | null>;

  loadComments: (eventId: string, page?: number, limit?: number) => Promise<void>;
  addComment: (eventId: string, content: string, parentId?: string) => Promise<boolean>;
  deleteComment: (eventId: string, commentId: string) => Promise<boolean>;
  editComment: (eventId: string, commentId: string, content: string) => Promise<boolean>;
  toggleLike: (eventId: string, commentId: string) => Promise<boolean>;
  resetEvent: (eventId: string) => void;
}

// Helper for recursive updates
const updateCommentTree = (
  comments: EventCommentDTO[],
  commentId: string,
  updater: (c: EventCommentDTO) => EventCommentDTO
): EventCommentDTO[] => {
  return comments.map((c) => {
    if (c.id === commentId) return updater(c);
    if (c.replies && c.replies.length > 0) {
      return { ...c, replies: updateCommentTree(c.replies, commentId, updater) };
    }
    return c;
  });
};

// Helper for recursive delete
const deleteFromTree = (comments: EventCommentDTO[], commentId: string): EventCommentDTO[] => {
  return comments
    .filter((c) => c.id !== commentId) // First level check
    .map((c) => ({
      ...c,
      replies: c.replies ? deleteFromTree(c.replies, commentId) : [],
    }));
};

export const useEventCommentsStore = create<IEventCommentsState>((set, getState) => ({
  commentsByEvent: {},
  totalByEvent: {},
  isLoadingByEvent: {},
  errorByEvent: {},

  resetEvent: (eventId: string) => {
    set((state) => ({
      commentsByEvent: { ...state.commentsByEvent, [eventId]: [] },
      totalByEvent: { ...state.totalByEvent, [eventId]: 0 },
      isLoadingByEvent: { ...state.isLoadingByEvent, [eventId]: false },
      errorByEvent: { ...state.errorByEvent, [eventId]: null },
    }));
  },

  loadComments: async (eventId: string, page: number = 1, limit: number = 20) => {
    try {
      set((state) => ({
        isLoadingByEvent: { ...state.isLoadingByEvent, [eventId]: true },
        errorByEvent: { ...state.errorByEvent, [eventId]: null },
      }));

      const resp: any = await get(`events/${eventId}/comments?page=${page}&limit=${limit}`);
      const data: EventCommentDTO[] = Array.isArray(resp?.data) ? resp.data : [];
      const total = resp?.total ?? data.length;

      set((state) => ({
        commentsByEvent: { ...state.commentsByEvent, [eventId]: data },
        totalByEvent: { ...state.totalByEvent, [eventId]: total },
      }));
    } catch (e: any) {
      set((state) => ({
        commentsByEvent: { ...state.commentsByEvent, [eventId]: [] },
        totalByEvent: { ...state.totalByEvent, [eventId]: 0 },
        errorByEvent: { ...state.errorByEvent, [eventId]: e?.message || 'Error al cargar comentarios' },
      }));
    } finally {
      set((state) => ({
        isLoadingByEvent: { ...state.isLoadingByEvent, [eventId]: false },
      }));
    }
  },

  addComment: async (eventId: string, content: string, parentId?: string) => {
    const text = (content ?? '').trim();
    if (!text) return false;

    try {
      const resp: any = await post(`events/${eventId}/comments`, { content: text, parentId });
      if (resp?.id) {
        set((state) => {
          const currentComments = state.commentsByEvent[eventId] || [];
          let newComments = [...currentComments];

          if (parentId) {
            // Add reply to parent
            newComments = updateCommentTree(newComments, parentId, (parent) => ({
              ...parent,
              replies: [...(parent.replies || []), resp],
              _count: { ...parent._count, replies: (parent._count?.replies || 0) + 1 },
            }));
          } else {
            // New top-level comment
            newComments = [resp, ...newComments];
          }

          return {
            commentsByEvent: { ...state.commentsByEvent, [eventId]: newComments },
            totalByEvent: {
              ...state.totalByEvent,
              [eventId]: parentId ? state.totalByEvent[eventId] : (state.totalByEvent[eventId] || 0) + 1
            },
          };
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  deleteComment: async (eventId: string, commentId: string) => {
    // Optimistic delete
    const previousComments = getState().commentsByEvent[eventId];
    set((state) => ({
      commentsByEvent: {
        ...state.commentsByEvent,
        [eventId]: deleteFromTree(state.commentsByEvent[eventId] || [], commentId)
      },
      totalByEvent: {
        ...state.totalByEvent,
        [eventId]: Math.max(0, (state.totalByEvent[eventId] || 0) - 1)
      }
    }));

    try {
      await del(`events/comments/${commentId}`);
      return true;
    } catch (e) {
      set((state) => ({
        commentsByEvent: { ...state.commentsByEvent, [eventId]: previousComments }
      }));
      return false;
    }
  },

  editComment: async (eventId: string, commentId: string, content: string) => {
    try {
      const resp: any = await patch(`events/comments/${commentId}`, { content });
      if (resp?.id) {
        set((state) => ({
          commentsByEvent: {
            ...state.commentsByEvent,
            [eventId]: updateCommentTree(state.commentsByEvent[eventId] || [], commentId, (c) => ({ ...c, content: resp.content }))
          }
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  toggleLike: async (eventId: string, commentId: string) => {
    // Optimistic update
    set((state) => ({
      commentsByEvent: {
        ...state.commentsByEvent,
        [eventId]: updateCommentTree(state.commentsByEvent[eventId] || [], commentId, (c) => {
          const isLiked = !c.isLiked;
          //   const count = (c._count?.likes || 0) + (isLiked ? 1 : -1);
          // count logic is tricky if undefined.
          const currentCount = c._count?.likes || 0;
          const newCount = isLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
          return {
            ...c,
            isLiked,
            _count: { ...c._count, likes: newCount }
          };
        })
      }
    }));

    try {
      const allowed = await post(`events/comments/${commentId}/like`, {});
      // if allowed has logic? usually returns isLiked.
      return true;
    } catch {
      // Revert?
      return false;
    }
  }

}));
