import api from '../utils/api';

export interface LoginRequest {
    studentId: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    id: number;
    email: string;
    name: string;
}

/** 인증 메일 발송 요청 */
export const sendVerificationEmail = (studentId: string) => {
    return api.post('/auth/email/send', { studentId });
};

/** 인증 코드 확인 요청 */
export const verifyEmailCode = (studentId: string, code: string) => {
    return api.post('/auth/email/verify', { studentId, code });
};

/** 회원가입 요청 */
export const signup = (data: any) => {
    return api.post('/auth/signup', data);
};

/** 로그인 요청 */
export const login = (data: LoginRequest) => {
    return api.post<AuthResponse>('/auth/login', data);
};

/** 토큰 재발급 요청 */
export const refreshToken = async () => {
    return api.post('/auth/refresh');
};

/** 로그아웃 요청 */
export const logout = async () => {
    return api.post('/auth/logout');
};

export const authService = {
    sendVerificationEmail,
    verifyEmailCode,
    signup,
    login,
    refreshToken,
    logout
};

