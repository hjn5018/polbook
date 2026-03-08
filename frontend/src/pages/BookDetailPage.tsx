import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMapPin, FiClock, FiEye, FiCheckCircle, FiEdit, FiTrash2, FiMessageCircle, FiHeart } from 'react-icons/fi';
import { bookService, type Book } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    const fetchBook = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await bookService.getBook(id);
            setBook(response.data);
        } catch (error) {
            console.error('Failed to fetch book detail:', error);
            alert('도서 정보를 불러오는데 실패했습니다.');
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const handleDelete = async () => {
        if (!book || !window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await bookService.deleteBook(book.bookId);
            alert('삭제되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('Failed to delete book:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!book) return null;

    const isSeller = user?.id === book.sellerId;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Navigation & Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gray-900 font-bold transition-colors group"
                >
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mr-3 group-hover:border-blue-100 group-hover:shadow-sm transition-all">
                        <FiArrowLeft size={18} />
                    </div>
                    목록으로 돌아가기
                </button>

                {isSeller && (
                    <div className="flex items-center space-x-2">
                        <Link
                            to={`/books/${book.bookId}/edit`}
                            className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-100 transition-all text-sm"
                        >
                            <FiEdit className="mr-2" /> 수정
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm"
                        >
                            <FiTrash2 className="mr-2" /> 삭제
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-[4/5] rounded-[2.5rem] bg-gray-50 border border-gray-100 overflow-hidden shadow-sm relative group">
                        {book.imageUrls && book.imageUrls.length > 0 ? (
                            <img
                                src={book.imageUrls[activeImage]}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                <span className="text-6xl mb-4 opacity-20">📖</span>
                                <span className="text-sm font-bold uppercase tracking-widest">No Image available</span>
                            </div>
                        )}

                        {/* Status Label Overlay */}
                        <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-black tracking-tight shadow-xl ${book.tradeStatus === 'SELLING' ? 'bg-green-500 text-white' :
                            book.tradeStatus === 'RESERVED' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'
                            }`}>
                            {book.tradeStatus === 'SELLING' ? '판매중' : book.tradeStatus === 'RESERVED' ? '예약중' : '판매완료'}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {book.imageUrls && book.imageUrls.length > 1 && (
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                            {book.imageUrls.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-500 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-500 text-xs font-black uppercase tracking-widest">
                            {book.category === 'MAJOR' ? '전공 서적' : book.category === 'LIBERAL' ? '교양 서적' : '자격증/수험서'}
                        </span>
                        <div className="flex items-center text-gray-400 text-xs font-bold">
                            <FiClock className="mr-1.5" />
                            {new Date(book.createdAt).toLocaleDateString()} 등록
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 leading-snug mb-6">
                        {book.title}
                    </h1>

                    <div className="flex items-center space-x-6 mb-8 text-sm font-bold">
                        <div className="flex items-center text-gray-600">
                            <FiEye className="mr-2 text-blue-500" />
                            <span className="text-gray-400 mr-1">조회</span> {book.viewCount}
                        </div>
                        <div className="flex items-center text-gray-600 font-bold">
                            <FiCheckCircle className={`mr-2 ${book.hasNotes ? 'text-orange-500' : 'text-gray-300'}`} />
                            <span className="text-gray-400 mr-1">필기정보</span> {book.hasNotes ? '필기 있음' : '없음'}
                        </div>
                    </div>

                    {/* Price & Primary Action */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 mb-10">
                        <div className="flex flex-col mb-8">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">희망 거래 가격</span>
                            <div className="text-4xl font-black text-gray-900">
                                {book.price.toLocaleString()}<span className="text-xl ml-1 text-gray-400">원</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="flex-1 flex items-center justify-center py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 hover:shadow-2xl hover:translate-y-[-2px] transition-all shadow-xl shadow-blue-100 group">
                                <FiMessageCircle className="mr-2" size={20} /> 판매자와 채팅하기
                            </button>
                            <button className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-white hover:text-red-500 hover:border-red-100 border border-transparent transition-all">
                                <FiHeart size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Meta Info Tabs/List */}
                    <div className="space-y-6 flex-grow">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
                                <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">도서 상태</span>
                                <span className="text-sm font-bold text-gray-900">
                                    {book.condition === 'S' ? '최상 (거의 새것)' :
                                        book.condition === 'A' ? '상 (깨끗함)' :
                                            book.condition === 'B' ? '중 (사용감 있음)' : '하 (낡음)'}
                                </span>
                            </div>
                            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
                                <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">거래 선호 위치</span>
                                <span className="flex items-center text-sm font-bold text-gray-900">
                                    <FiMapPin className="mr-1.5 text-blue-500" /> {book.locationName}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-6">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center">
                                <div className="w-1 h-4 bg-blue-600 rounded-full mr-3" />
                                상품 상세 설명
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                {book.description || '상세 설명이 등록되지 않았습니다.'}
                            </p>
                        </div>
                    </div>

                    {/* Seller Side Profile Card */}
                    <div className="mt-10 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mr-4">
                                <FiUser className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-1">판매자 정보</span>
                                <h4 className="font-black text-gray-900">{book.sellerNickname}</h4>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">매너 점수</span>
                            <div className="flex items-center font-black text-blue-600">
                                <span className="text-lg mr-1">{book.sellerMannerScore.toFixed(1)}</span>
                                <span className="text-xs">점</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
