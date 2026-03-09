import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend, FiUser, FiLoader } from 'react-icons/fi';
import { chatService, type ChatMessage, type ChatRoom } from '../services/chatService';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../context/AuthContext';

const ChatRoomPage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
    const [input, setInput] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const numericRoomId = roomId ? Number(roomId) : null;

    // WebSocket 연결
    const { status, sendMessage } = useWebSocket({
        roomId: numericRoomId,
        onMessage: useCallback((msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
            // 상대방 메시지가 도착하면 즉시 읽음 처리
            if (numericRoomId !== null && msg.senderId !== user?.id) {
                chatService.markAsRead(numericRoomId).catch(() => { });
            }
        }, [numericRoomId, user?.id]),
        onRead: useCallback(() => {
            // 상대방이 읽음 처리 → 내가 보낸 메시지들 읽음 표시
            setMessages((prev) =>
                prev.map((m) => (m.senderId === user?.id ? { ...m, read: true } : m))
            );
        }, [user?.id]),
    });

    // 채팅방 정보 로드
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchRoomInfo();
        fetchMessages(0);
        // 입장 시 읽음 처리
        if (numericRoomId !== null) {
            chatService.markAsRead(numericRoomId).catch(() => { });
        }
    }, [user, numericRoomId]);

    const fetchRoomInfo = async () => {
        try {
            const res = await chatService.getMyRooms();
            const room = res.data.find((r) => r.roomId === numericRoomId);
            if (room) setRoomInfo(room);
        } catch (e) {
            console.error('Failed to fetch room info:', e);
        }
    };

    const fetchMessages = async (p: number) => {
        if (numericRoomId === null) return;
        setIsLoadingHistory(true);
        try {
            const res = await chatService.getMessages(numericRoomId, p, 30);
            const fetched = res.data.content.reverse(); // API는 최신순 → 시간순으로 뒤집기
            if (p === 0) {
                setMessages(fetched);
                setInitialLoad(false);
            } else {
                setMessages((prev) => [...fetched, ...prev]);
            }
            setPage(p);
            setHasMore(!res.data.totalPages || p + 1 < res.data.totalPages);
        } catch (e) {
            console.error('Failed to fetch messages:', e);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // 새 메시지 도착 시 스크롤
    useEffect(() => {
        if (!initialLoad) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, initialLoad]);

    // 초기 로드 완료 시 맨 아래로
    useEffect(() => {
        if (!initialLoad && messages.length > 0 && page === 0) {
            messagesEndRef.current?.scrollIntoView();
        }
    }, [initialLoad]);

    // 이전 메시지 더 불러오기
    const handleLoadMore = () => {
        if (!hasMore || isLoadingHistory) return;
        const container = messagesContainerRef.current;
        const prevScrollHeight = container?.scrollHeight || 0;

        fetchMessages(page + 1).then(() => {
            // 스크롤 위치 유지
            requestAnimationFrame(() => {
                if (container) {
                    container.scrollTop = container.scrollHeight - prevScrollHeight;
                }
            });
        });
    };

    // 메시지 전송
    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || !user) return;
        sendMessage(user.id, trimmed, 'TALK');
        setInput('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /** 시간 포맷 (HH:MM) */
    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    /** 날짜 구분선 */
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
        });
    };

    const shouldShowDateSeparator = (i: number) => {
        if (i === 0) return true;
        const prev = new Date(messages[i - 1].createdAt).toDateString();
        const curr = new Date(messages[i].createdAt).toDateString();
        return prev !== curr;
    };

    return (
        <div className="flex flex-col h-screen bg-[#FDFDFF]">
            {/* ── Header ── */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 safe-top">
                <div className="max-w-3xl mx-auto flex items-center">
                    <button
                        onClick={() => navigate('/chat')}
                        className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mr-4 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all"
                    >
                        <FiArrowLeft size={18} className="text-gray-600" />
                    </button>

                    <div className="flex items-center flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center mr-3 flex-shrink-0">
                            {roomInfo?.partnerProfileImage ? (
                                <img src={roomInfo.partnerProfileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser size={18} className="text-gray-300" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-black text-gray-900 text-sm truncate">
                                {roomInfo?.partnerNickname || '채팅'}
                            </h2>
                            {roomInfo && (
                                <p className="text-[11px] text-gray-400 font-bold truncate">
                                    📖 {roomInfo.bookTitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 연결 상태 */}
                    <div className="flex-shrink-0 ml-3">
                        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${status === 'connected' ? 'bg-green-400 shadow-sm shadow-green-200' :
                            status === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                                'bg-gray-300'
                            }`} title={status === 'connected' ? '연결됨' : status === 'connecting' ? '연결 중...' : '연결 끊김'} />
                    </div>
                </div>
            </div>

            {/* ── Messages ── */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-6"
            >
                <div className="max-w-3xl mx-auto">
                    {/* 이전 메시지 불러오기 */}
                    {hasMore && (
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingHistory}
                                className="px-5 py-2 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-sm transition-all disabled:opacity-50"
                            >
                                {isLoadingHistory ? (
                                    <span className="flex items-center"><FiLoader className="animate-spin mr-2" size={14} /> 불러오는 중...</span>
                                ) : '이전 메시지 보기'}
                            </button>
                        </div>
                    )}

                    {/* 메시지 리스트 */}
                    {messages.map((msg, i) => {
                        const isMe = msg.senderId === user?.id;
                        const showDate = shouldShowDateSeparator(i);

                        return (
                            <React.Fragment key={msg.messageId || `msg-${i}`}>
                                {/* 날짜 구분선 */}
                                {showDate && (
                                    <div className="flex items-center justify-center my-6">
                                        <div className="px-4 py-1.5 bg-gray-100 text-gray-400 text-[11px] font-bold rounded-full">
                                            {formatDate(msg.createdAt)}
                                        </div>
                                    </div>
                                )}

                                {/* 메시지 버블 */}
                                <div className={`flex mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!isMe && (
                                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                            {roomInfo?.partnerProfileImage ? (
                                                <img src={roomInfo.partnerProfileImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <FiUser size={14} className="text-gray-300" />
                                            )}
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        <div
                                            className={`px-4 py-2.5 text-sm font-medium leading-relaxed break-words whitespace-pre-wrap ${isMe
                                                ? 'bg-blue-600 text-white rounded-[1.2rem] rounded-tr-md shadow-lg shadow-blue-100'
                                                : 'bg-white text-gray-800 rounded-[1.2rem] rounded-tl-md border border-gray-100 shadow-sm'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <div className={`flex items-center mt-1 gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-[10px] text-gray-300 font-bold">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                            {isMe && (
                                                <span className={`text-[10px] font-bold ${msg.read ? 'text-blue-400' : 'text-gray-300'}`}>
                                                    {msg.read ? '읽음' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}

                    {/* 메시지 없을 때 */}
                    {!initialLoad && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-4">
                                <FiSend size={28} className="text-blue-300" />
                            </div>
                            <p className="text-gray-400 font-bold text-sm">첫 메시지를 보내보세요!</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ── Input ── */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-4 py-3 safe-bottom">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="메시지를 입력하세요..."
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-blue-200 focus:bg-white focus:shadow-sm transition-all"
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || status !== 'connected'}
                        className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 hover:translate-y-[-1px] transition-all disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none flex-shrink-0"
                    >
                        <FiSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoomPage;
