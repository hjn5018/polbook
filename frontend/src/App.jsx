import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookDetailPage from './pages/BookDetailPage';
import BookFormPage from './pages/BookFormPage';
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import MyPage from './pages/MyPage';

function App() {
    return (
        <BrowserRouter>
            {/* 여기에 네비게이션(헤더) 컴포넌트가 공통으로 들어갈 수 있습니다. */}
            <div className="container mx-auto p-4 max-w-md bg-gray-50 min-h-screen">
                <Routes>
                    {/* 공통 화면 */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* 인증이 필요한 화면 (추후 PrivateRoute 등으로 감쌀 예정) */}
                    <Route path="/books/new" element={<BookFormPage />} />
                    <Route path="/books/:id" element={<BookDetailPage />} />

                    <Route path="/chat" element={<ChatListPage />} />
                    <Route path="/chat/:roomId" element={<ChatRoomPage />} />

                    <Route path="/mypage" element={<MyPage />} />

                    {/* 잘못된 경로 처리 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
