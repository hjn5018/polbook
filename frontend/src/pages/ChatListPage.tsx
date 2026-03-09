import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiArrowLeft, FiUser } from 'react-icons/fi';
import { chatService, type ChatRoom } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const ChatListPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchRooms();
    }, [user, navigate]);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const res = await chatService.getMyRooms();
            setRooms(res.data);
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    /** 시간 포맷 */
    const formatTime = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    // ── 로딩 스켈레톤 ──
    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto py-10 px-4">
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mr-4 hover:shadow-sm transition-all">
                        <FiArrowLeft size={18} className="text-gray-500" />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900">채팅</h1>
                </div>
                <div className="space-y-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-[2rem]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mr-4 hover:shadow-sm hover:border-blue-100 transition-all"
                >
                    <FiArrowLeft size={18} className="text-gray-500" />
                </button>
                <h1 className="text-2xl font-black text-gray-900">채팅</h1>
                <span className="ml-3 px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-black rounded-lg">
                    {rooms.length}
                </span>
            </div>

            {/* Room List */}
            {rooms.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-100/50">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-200">
                        <FiMessageCircle size={40} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">아직 진행 중인 대화가 없습니다</h3>
                    <p className="text-gray-400 font-bold mb-8">관심 있는 책의 판매자에게 먼저 메시지를 보내보세요!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
                    >
                        둘러보기
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {rooms.map((room) => (
                        <button
                            key={room.roomId}
                            onClick={() => navigate(`/chat/${room.roomId}`)}
                            className="w-full flex items-center p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/80 hover:border-blue-50 hover:translate-y-[-2px] transition-all text-left group"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0 mr-4">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                                    {room.partnerProfileImage ? (
                                        <img src={room.partnerProfileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <FiUser size={22} className="text-gray-300" />
                                    )}
                                </div>
                                {room.unreadCount > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-blue-200">
                                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <h3 className="font-black text-gray-900 truncate text-sm group-hover:text-blue-600 transition-colors">
                                        {room.partnerNickname}
                                    </h3>
                                    <span className="text-[11px] text-gray-400 font-bold flex-shrink-0 ml-3">
                                        {formatTime(room.lastMessageAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium truncate mb-1">
                                    {room.lastMessage}
                                </p>
                                <span className="text-[10px] text-gray-400 font-bold truncate block">
                                    📖 {room.bookTitle}
                                </span>
                            </div>

                            {/* Book Thumbnail */}
                            {room.bookImageUrl && (
                                <div className="flex-shrink-0 ml-4 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                                    <img src={room.bookImageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatListPage;
