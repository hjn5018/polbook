import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiBookOpen, FiPlus, FiArrowRight, FiSearch, FiLayers, FiFilter } from 'react-icons/fi';
import { bookService, type Category } from '../services/bookService';
import type { Book } from '../services/bookService';
import BookCard from '../components/BookCard';

const HomePage: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
    const [keyword, setKeyword] = useState('');

    const categories: { label: string; value: Category | 'ALL' }[] = useMemo(() => [
        { label: '전체', value: 'ALL' },
        { label: '전공 서적', value: 'MAJOR' },
        { label: '교양 서적', value: 'LIBERAL' },
        { label: '자격증/수험서', value: 'CERT' },
    ], []);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await bookService.getBooks({
                category: selectedCategory === 'ALL' ? undefined : selectedCategory,
                keyword: keyword || undefined,
                size: 12
            });
            setBooks(response.data.content);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, keyword]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-2rem)] py-8 max-w-7xl mx-auto">
            {/* Header / Nav Section */}
            <div className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-md sticky top-4 z-50 p-4 rounded-3xl shadow-sm border border-gray-100 px-6">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-100">
                        <span className="text-xl font-bold text-white">P</span>
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">Polbook</span>
                </div>

                <div className="flex-1 max-w-md mx-6 hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="제목, 강의명, 교수명 검색..."
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium transition-all outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-xs font-bold text-gray-800">{user?.name}님</span>
                                <span className="text-[10px] text-gray-400 font-medium">환영합니다</span>
                            </div>
                            <Link to="/mypage" className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-lg transition-all border border-gray-50 hover:border-blue-100">
                                <FiUser size={20} />
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-50 hover:border-red-500"
                                title="로그아웃"
                            >
                                <FiLogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link to="/login" className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:text-gray-900 transition-all text-sm">
                                로그인
                            </Link>
                            <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                                시작하기
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            {!books.length && !isLoading && !keyword && (
                <div className="mb-16 mt-8 text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6">
                        당신의 지식이 담긴 <br />
                        책에 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">새로운 가치</span>를.
                    </h2>
                    <p className="text-gray-500 font-medium mb-10 max-w-sm sm:max-w-md leading-relaxed">
                        폴북은 우리 학교 학생들을 위한 가장 <br className="hidden sm:block" />
                        스마트하고 안전한 전공 중고 서적 거래 플랫폼입니다.
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <Link to="/books/new" className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all shadow-xl shadow-blue-100 group">
                            책 판매 시작하기 <FiPlus className="ml-2 group-hover:rotate-90 transition-transform" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidemenu / Filters */}
                <aside className="w-full md:w-64 flex flex-col space-y-8">
                    {/* Categories */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-50 overflow-hidden">
                        <div className="flex items-center space-x-2 mb-6">
                            <FiLayers size={18} className="text-blue-500" />
                            <h3 className="font-bold text-gray-900 tracking-tight">카테고리</h3>
                        </div>
                        <div className="space-y-1.5">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat.value
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Banner Card */}
                    <Link to="/books/new" className="hidden border border-gray-50 md:flex flex-col p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl shadow-gray-200 overflow-hidden relative group">
                        <div className="z-10">
                            <h4 className="font-bold text-lg mb-2">안 읽는 책이 <br />있나요?</h4>
                            <p className="text-gray-400 text-xs font-medium mb-6">지금 등록하고 <br />용돈을 챙겨보세요!</p>
                            <span className="flex items-center text-xs font-black uppercase tracking-widest text-blue-400 group-hover:translate-x-1 transition-transform">
                                등록하러 가기 <FiArrowRight className="ml-2" />
                            </span>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
                        <FiBookOpen size={60} className="absolute -bottom-2 -right-2 text-white/5 -rotate-12 group-hover:scale-110 transition-transform" />
                    </Link>
                </aside>

                {/* Listing Section */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl bg-orange-100 text-orange-500">
                                <FiFilter size={18} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {selectedCategory === 'ALL' ? '최근 등록된 도서' : categories.find(c => c.value === selectedCategory)?.label}
                            </h2>
                        </div>

                        <select className="bg-transparent border-none text-xs font-bold text-gray-400 focus:ring-0 cursor:pointer hover:text-gray-900 transition-colors">
                            <option>최신순</option>
                            <option>가격 낮은순</option>
                            <option>조회수순</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-5 animate-pulse">
                                    <div className="w-full aspect-[4/3] bg-gray-50 rounded-2xl mb-4" />
                                    <div className="h-4 bg-gray-50 rounded w-2/3 mb-4" />
                                    <div className="h-3 bg-gray-50 rounded w-full mb-2" />
                                    <div className="h-3 bg-gray-50 rounded w-1/2 mb-6" />
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="h-6 bg-gray-50 rounded w-16" />
                                        <div className="h-6 bg-gray-50 rounded w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : books.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {books.map((book) => (
                                <BookCard key={book.bookId} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <span className="text-4xl grayscale opacity-50">🔍</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                            <p className="text-sm text-gray-400 font-medium mb-8">다른 키워드나 필터로 다시 검색해보세요.</p>
                            <button
                                onClick={() => { setSelectedCategory('ALL'); setKeyword(''); }}
                                className="px-6 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-all"
                            >
                                초기화
                            </button>
                        </div>
                    )}

                    {/* Add Floating Action Button for Mobile */}
                    <Link to="/books/new" className="md:hidden fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-300 z-50 hover:scale-110 transition-transform">
                        <FiPlus size={28} />
                    </Link>
                </main>
            </div>

            {/* Footer */}
            <footer className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-400">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-gray-900 tracking-tight">Polbook</span>
                    <span className="text-[10px] font-medium tracking-widest uppercase">Project</span>
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-xs font-medium hover:text-blue-500">이용약관</a>
                    <a href="#" className="text-xs font-medium hover:text-blue-500">개인정보처리방침</a>
                    <a href="#" className="text-xs font-medium hover:text-blue-500">문의하기</a>
                </div>
                <p className="text-[10px] font-bold tracking-wider uppercase">© 2026 Developed with ❤️</p>
            </footer>
        </div>
    );
};

export default HomePage;
