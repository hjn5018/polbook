import api from '../utils/api';
import type { Book } from './bookService';

export interface UserResponse {
    userId: number;
    studentId: string;
    email: string;
    nickname: string;
    profileImage: string | null;
    mannerScore: number;
    role: string;
}

interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const userService = {
    // 내 프로필 조회
    getMyProfile: async () => {
        const response = await api.get<UserResponse>('/users/me');
        return response.data;
    },

    // 프로필 수정
    updateProfile: async (nickname: string, profileImage?: File) => {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify({ nickname })], { type: 'application/json' }));
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        const response = await api.patch<UserResponse>('/users/me', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // 내 판매 도서 조회
    getMyBooks: async (page = 0, size = 12) => {
        const response = await api.get<PageResponse<Book>>('/users/me/books', {
            params: { page, size }
        });
        return response.data;
    }
};
