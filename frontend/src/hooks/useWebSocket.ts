import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage, MessageType } from '../services/chatService';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ReadEvent {
    roomId: number;
    readBy: number;
}

interface UseWebSocketOptions {
    roomId: number | null;
    onMessage: (message: ChatMessage) => void;
    onRead?: (event: ReadEvent) => void;
}

export function useWebSocket({ roomId, onMessage, onRead }: UseWebSocketOptions) {
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const clientRef = useRef<Client | null>(null);
    const onMessageRef = useRef(onMessage);
    const onReadRef = useRef(onRead);

    // 최신 콜백 참조 유지
    onMessageRef.current = onMessage;
    onReadRef.current = onRead;

    useEffect(() => {
        if (roomId === null) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('/ws/chat'),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                setStatus('connected');

                // 채팅방 메시지 구독
                client.subscribe(`/topic/chat/${roomId}`, (frame: IMessage) => {
                    try {
                        const msg: ChatMessage = JSON.parse(frame.body);
                        onMessageRef.current(msg);
                    } catch (e) {
                        console.error('Failed to parse message:', e);
                    }
                });

                // 읽음 이벤트 구독
                client.subscribe(`/topic/chat/${roomId}/read`, (frame: IMessage) => {
                    try {
                        const event: ReadEvent = JSON.parse(frame.body);
                        onReadRef.current?.(event);
                    } catch (e) {
                        console.error('Failed to parse read event:', e);
                    }
                });
            },

            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
                setStatus('disconnected');
            },

            onDisconnect: () => {
                setStatus('disconnected');
            },

            onWebSocketClose: () => {
                setStatus('disconnected');
            },
        });

        setStatus('connecting');
        clientRef.current = client;
        client.activate();

        return () => {
            client.deactivate();
            clientRef.current = null;
            setStatus('disconnected');
        };
    }, [roomId]);

    const sendMessage = useCallback(
        (senderId: number, content: string, messageType: MessageType = 'TALK') => {
            if (!clientRef.current?.connected || roomId === null) {
                console.warn('WebSocket not connected');
                return;
            }

            clientRef.current.publish({
                destination: `/app/chat/${roomId}`,
                body: JSON.stringify({ senderId, content, messageType }),
            });
        },
        [roomId],
    );

    return { status, sendMessage };
}
