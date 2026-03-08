import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../services/bookService';
import { FiEye, FiUser, FiClock, FiMapPin } from 'react-icons/fi';

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    // 상대 시간 계산 (단순화)
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "년 전";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "개월 전";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "일 전";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "시간 전";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "분 전";
        return Math.floor(seconds) + "초 전";
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'SELLING': return '판매중';
            case 'RESERVED': return '예약중';
            case 'SOLD': return '판매완료';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'SELLING': return 'bg-green-100 text-green-700';
            case 'RESERVED': return 'bg-blue-100 text-blue-700';
            case 'SOLD': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100';
        }
    };

    return (
        <Link
            to={`/books/${book.bookId}`}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                {book.imageUrls && book.imageUrls.length > 0 ? (
                    <img
                        src={book.imageUrls[0]}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <div className="w-12 h-12 mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📖</span>
                        </div>
                        <span className="text-xs font-medium">이미지 없음</span>
                    </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-sm ${getStatusClass(book.tradeStatus)}`}>
                    {getStatusLabel(book.tradeStatus)}
                </div>

                {/* Overlays for micro-interactions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Category & Badge */}
                <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                        {book.category === 'MAJOR' ? '전공' : book.category === 'LIBERAL' ? '교양' : '자격증'}
                    </span>
                    {book.hasNotes && (
                        <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-500 text-[10px] font-bold uppercase tracking-wider">
                            필기있음
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                    {book.title}
                </h3>

                {/* Subinfo (Course & Prof) */}
                {(book.courseName || book.professor) && (
                    <div className="mb-4 space-y-1">
                        {book.courseName && (
                            <p className="text-[11px] text-gray-400 font-medium">
                                <span className="text-gray-500">강의:</span> {book.courseName}
                            </p>
                        )}
                        {book.professor && (
                            <p className="text-[11px] text-gray-400 font-medium">
                                <span className="text-gray-500">교수:</span> {book.professor}
                            </p>
                        )}
                    </div>
                )}

                {/* Price */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium mb-0.5">희망 가격</span>
                        <span className="text-lg font-black text-gray-900">
                            {book.price.toLocaleString()}<span className="text-xs font-bold ml-0.5">원</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400">
                        <div className="flex items-center text-[10px] font-medium">
                            <FiEye size={14} className="mr-1 text-gray-300" />
                            {book.viewCount}
                        </div>
                    </div>
                </div>

                {/* Seller & Location Mini info */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-1.5 overflow-hidden">
                            <FiUser className="text-blue-500" size={12} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-600">{book.sellerNickname}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                        <FiMapPin size={10} className="mr-1" />
                        <span className="text-[10px] font-medium">{book.locationName}</span>
                    </div>
                </div>

                <div className="mt-2 text-[10px] text-gray-400 font-medium flex items-center">
                    <FiClock size={10} className="mr-1" />
                    {timeSince(book.createdAt)}
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
