import api from '../utils/api';

// ── 타입 정의 ──────────────────────────────────────────

export type MessageType = 'TALK' | 'IMAGE' | 'SYSTEM' | 'TRADE_PROPOSAL';

export interface ChatRoom {
    roomId: number;
    bookId: number;
    bookTitle: string;
    bookImageUrl: string | null;
    partnerId: number;
    partnerNickname: string;
    partnerProfileImage: string | null;
    partnerMannerScore: number;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

export interface ChatMessage {
    messageId: number;
    roomId: number;
    senderId: number;
    senderNickname: string;
    content: string;
    messageType: MessageType;
    createdAt: string;
    read: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

// ── API 호출 ──────────────────────────────────────────

/** 채팅방 생성 또는 기존 방 ID 조회 */
export const createOrGetRoom = (bookId: number) => {
    return api.post<number>('/chats/rooms', { bookId });
};

/** 내 채팅방 목록 조회 */
export const getMyRooms = () => {
    return api.get<ChatRoom[]>('/chats/rooms');
};

/** 이전 메시지 조회 (페이징) */
export const getMessages = (roomId: number, page = 0, size = 30) => {
    return api.get<PageResponse<ChatMessage>>(`/chats/rooms/${roomId}/messages`, {
        params: { page, size },
    });
};

/** 채팅방 읽음 처리 (입장 시 호출) */
export const markAsRead = (roomId: number) => {
    return api.post(`/chats/rooms/${roomId}/read`);
};

export const chatService = {
    createOrGetRoom,
    getMyRooms,
    getMessages,
    markAsRead,
};
