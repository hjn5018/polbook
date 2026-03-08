import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type LoginRequest, type AuthResponse } from '../services/authService';

interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 앱 로드 시 인증 상태 확인
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                // 실제 서비스에서는 현재 사용자 정보를 가져오는 API를 호출해야 함
                // 여기서는 간단히 로컬 스토리지에 토큰이 있으면 인증된 것으로 간주 (임시)
                setIsAuthenticated(true);
                // 임시 사용자 정보 세팅 (나중에 /api/users/me 같은 엔드포인트로 대체 필요)
                setUser({ id: 0, email: '', name: 'User' });
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);
            const authData: AuthResponse = response.data;

            localStorage.setItem('accessToken', authData.accessToken);
            setIsAuthenticated(true);
            setUser({
                id: authData.id,
                email: authData.email,
                name: authData.name
            });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
