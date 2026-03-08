import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const LoginPage: React.FC = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login({ studentId, password });
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || '학번 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-[calc(100vh-2rem)] py-12">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-200 mb-6 group transition-transform hover:scale-105">
                        <span className="text-3xl font-bold text-white tracking-tighter">P.</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">다시 만나요</h1>
                    <p className="mt-2 text-gray-500 font-medium">폴북에서 스마트하게 중고책을 거래하세요</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">학번</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <FiMail size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="학번 10자리 입력"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700">비밀번호</label>
                                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">비밀번호 찾기</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <FiLock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full py-4 bg-gray-900 text-white font-bold rounded-2xl overflow-hidden group hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className={`inline-flex items-center justify-center transition-all ${isLoading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                                로그인 <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-500">
                            계정이 없으신가요?{' '}
                            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 decoration-2 transition-all">
                                지금 가입하세요
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-6 text-gray-400">
                    <div className="flex items-center text-xs">
                        <FiCheckCircle className="mr-1.5 text-blue-500" /> 안전한 거래
                    </div>
                    <div className="flex items-center text-xs">
                        <FiCheckCircle className="mr-1.5 text-blue-500" /> 간편한 채팅
                    </div>
                    <div className="flex items-center text-xs">
                        <FiCheckCircle className="mr-1.5 text-blue-500" /> 신뢰도 시스템
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

