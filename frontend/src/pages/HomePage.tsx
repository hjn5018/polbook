import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiBookOpen, FiPlus, FiArrowRight } from 'react-icons/fi';

const HomePage: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div className="flex flex-col min-h-[calc(100vh-2rem)] py-8">
            {/* Header / Nav Section */}
            <div className="flex justify-between items-center mb-12 bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-100">
                        <span className="text-xl font-bold text-white">P</span>
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">Polbook</span>
                </div>

                <div className="flex items-center space-x-3">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-xs font-bold text-gray-900">{user?.name}님</span>
                                <span className="text-[10px] text-gray-400 font-medium">환영합니다</span>
                            </div>
                            <Link to="/mypage" className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all border border-gray-100">
                                <FiUser size={20} />
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-100"
                                title="로그아웃"
                            >
                                <FiLogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                            로그인
                        </Link>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            <div className="mb-12 text-center sm:text-left">
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
                    당신의 책에 <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">새로운 가치</span>를 더하세요
                </h2>
                <p className="text-gray-500 font-medium mb-8 max-w-xs sm:max-w-none">
                    폴북은 학생과 독자들을 위한 가장 스마트하고 <br className="hidden sm:block" />
                    안전한 중고책 거래 플랫폼입니다.
                </p>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link to="/books/new" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group">
                        책 판매하기 <FiPlus className="ml-2 group-hover:rotate-90 transition-transform" />
                    </Link>
                    <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                        가입하고 둘러보기 <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>

            {/* Quick Stats/Features */}
            <div className="grid grid-cols-1 gap-4 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100/50">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm text-blue-600">
                        <FiBookOpen size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">다양한 서적</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">전공 서적부터 소설까지, 원하는 책을 합리적인 가격에 찾아보세요.</p>
                </div>
            </div>

            {/* Footer section (placeholder for visual completeness) */}
            <div className="mt-auto pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">© 2026 Polbook Project · Built with Passion</p>
            </div>
        </div>
    );
};

export default HomePage;

