import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type LoginRequest, type AuthResponse } from '../services/authService';
import { userService, type UserResponse } from '../services/userService';

// User 인터페이스를 backend DTO(UserResponse) 형식과 맞춤
interface User {
    id: number;
    email: string;
    nickname: string;
    studentId: string;
    profileImage: string | null;
    mannerScore: number;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 유효한 UserResponse를 User 인터페이스로 변환
    const mapUser = (data: UserResponse): User => ({
        id: data.userId,
        email: data.email,
        nickname: data.nickname,
        studentId: data.studentId,
        profileImage: data.profileImage,
        mannerScore: data.mannerScore,
        role: data.role
    });

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                // 실제 사용자 정보 가져오기
                const profile = await userService.getMyProfile();
                setUser(mapUser(profile));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
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

    // 앱 로드 시 인증 상태 확인
    useEffect(() => {
        checkAuth();
    }, []);

    const refreshUser = async () => {
        try {
            const profile = await userService.getMyProfile();
            setUser(mapUser(profile));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const login = async (data: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);
            const authData: AuthResponse = response.data;

            localStorage.setItem('accessToken', authData.accessToken);

            // 로그인 성공 후 상세 프로필 가져오기
            const profile = await userService.getMyProfile();
            setUser(mapUser(profile));
            setIsAuthenticated(true);
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
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, checkAuth, refreshUser }}>
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
