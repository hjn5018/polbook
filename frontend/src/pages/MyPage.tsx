import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiPackage, FiHeart, FiCamera, FiAlertCircle } from 'react-icons/fi';
import { userService, type UserResponse } from '../services/userService';
import { wishlistService } from '../services/wishlistService';
import type { Book } from '../services/bookService';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

type Tab = 'my-books' | 'wishlist';

const MyPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [profile, setProfile] = useState<UserResponse | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('my-books');
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [user, navigate]);

    useEffect(() => {
        if (profile) {
            fetchTabData();
        }
    }, [activeTab, profile]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getMyProfile();
            setProfile(data);
            setNewNickname(data.nickname);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const fetchTabData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'my-books') {
                const data = await userService.getMyBooks(0, 50);
                setBooks(data.content);
            } else {
                const data = await wishlistService.getMyWishlist(0, 50);
                setBooks(data.content);
            }
        } catch (error) {
            console.error('Failed to fetch tab data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.updateProfile(newNickname, selectedFile || undefined);
            alert('프로필이 수정되었습니다.');
            setIsEditing(false);
            fetchProfile();
            refreshUser(); // AuthContext 갱신
        } catch (error: any) {
            alert(error.response?.data?.message || '수정에 실패했습니다.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!profile) return null;

    // 매너 온도 색상 계산 (36.5 기본)
    const getMannerColor = (score: number) => {
        if (score >= 50) return 'text-orange-500 bg-orange-50';
        if (score >= 40) return 'text-green-500 bg-green-50';
        return 'text-blue-500 bg-blue-50';
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {/* Profile Header Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 p-8 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-gray-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                            {previewImage || profile.profileImage ? (
                                <img src={previewImage || profile.profileImage!} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser size={48} className="text-gray-300" />
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all scale-90 group-hover:scale-100">
                                <FiCamera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    className="text-2xl font-black bg-gray-50 border-2 border-blue-100 rounded-xl px-4 py-1 outline-none focus:border-blue-500"
                                />
                            ) : (
                                <h2 className="text-3xl font-black text-gray-900">{profile.nickname}</h2>
                            )}
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black tracking-widest uppercase rounded-lg w-fit mx-auto md:mx-0">
                                {profile.studentId}
                            </span>
                        </div>

                        <p className="text-gray-400 font-bold mb-6">{profile.email}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:translate-y-[-2px] transition-all"
                                >
                                    <FiSettings className="mr-2" /> 프로필 관리
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all"
                                    >
                                        저장하기
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setPreviewImage(null);
                                            setNewNickname(profile.nickname);
                                        }}
                                        className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                                    >
                                        취소
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Manner Score Section */}
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 w-full md:w-auto min-w-[200px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-400 font-black uppercase tracking-widest">매너 온도</span>
                            <FiAlertCircle className="text-gray-300" size={14} />
                        </div>
                        <div className="flex items-end gap-1 mb-3">
                            <span className={`text-3xl font-black ${getMannerColor(profile.mannerScore).split(' ')[0]}`}>
                                {profile.mannerScore.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400 font-bold mb-1.5">°C</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${getMannerColor(profile.mannerScore).split(' ')[0].replace('text', 'bg')}`}
                                style={{ width: `${Math.min(profile.mannerScore, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-2 text-center uppercase tracking-tighter">첫 온도 36.5°C</p>
                    </div>
                </div>
            </div>

            {/* Tabs System */}
            <div className="flex items-center space-x-2 mb-8 bg-gray-100 p-1.5 rounded-[1.5rem] w-fit">
                <button
                    onClick={() => setActiveTab('my-books')}
                    className={`flex items-center px-6 py-3 rounded-[1.2rem] font-black text-sm transition-all ${activeTab === 'my-books'
                        ? 'bg-white text-blue-600 shadow-md translate-y-[-1px]'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <FiPackage className="mr-2" size={18} /> 내 판매글
                </button>
                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex items-center px-6 py-3 rounded-[1.2rem] font-black text-sm transition-all ${activeTab === 'wishlist'
                        ? 'bg-white text-red-500 shadow-md translate-y-[-1px]'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <FiHeart className="mr-2" size={18} /> 찜한 목록
                </button>
            </div>

            {/* List Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[2rem]" />
                    ))}
                </div>
            ) : books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.bookId} book={book} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-200">
                        {activeTab === 'my-books' ? <FiPackage size={40} /> : <FiHeart size={40} />}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                        {activeTab === 'my-books' ? '등록한 상품이 없습니다' : '찜한 상품이 없습니다'}
                    </h3>
                    <p className="text-gray-400 font-bold mb-8">
                        {activeTab === 'my-books' ? '잠자고 있는 전공 서적을 판매해보세요!' : '마음에 드는 상품을 하트로 찜해보세요!'}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
                    >
                        둘러보기
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyPage;
