import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookDetailPage from './pages/BookDetailPage';
import BookFormPage from './pages/BookFormPage';
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import MyPage from './pages/MyPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* 여기에 네비게이션(헤더) 컴포넌트가 공통으로 들어갈 수 있습니다. */}
                <div className="min-h-screen bg-[#FDFDFF] selection:bg-blue-100 selection:text-blue-900">
                    <Routes>
                        {/* 공통 화면 */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* 인증이 필요한 화면 */}
                        <Route path="/books/new" element={
                            <ProtectedRoute>
                                <BookFormPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/books/:id" element={
                            <ProtectedRoute>
                                <BookDetailPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/chat" element={
                            <ProtectedRoute>
                                <ChatListPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/chat/:roomId" element={
                            <ProtectedRoute>
                                <ChatRoomPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/mypage" element={
                            <ProtectedRoute>
                                <MyPage />
                            </ProtectedRoute>
                        } />

                        {/* 잘못된 경로 처리 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
