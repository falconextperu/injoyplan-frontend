import type { UserDTO } from './user';

export type ChatRoomType = 'INDIVIDUAL' | 'GROUP';

export interface ChatMessageDTO {
  id: string;
  chatRoomId: string | null;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: UserDTO;
}

export interface ChatParticipantDTO {
  id: string;
  chatRoomId: string;
  userId: string;
  joinedAt: string;
  user: UserDTO;
}

export interface ChatRoomDTO {
  id: string;
  type: ChatRoomType;
  name?: string | null;
  participants: ChatParticipantDTO[];
  messages?: ChatMessageDTO[];
  createdAt: string;
  updatedAt: string;
}
