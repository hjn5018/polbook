import api from '../utils/api';
import type { Book } from './bookService';

interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const wishlistService = {
    // 찜 토글
    toggleWish: async (bookId: number) => {
        const response = await api.post<{ isWished: boolean }>(`/books/${bookId}/wish`);
        return response.data;
    },

    // 찜 여부 확인
    getWishStatus: async (bookId: number) => {
        const response = await api.get<{ isWished: boolean }>(`/books/${bookId}/wish/status`);
        return response.data;
    },

    // 내 찜 목록 조회
    getMyWishlist: async (page = 0, size = 12) => {
        const response = await api.get<PageResponse<Book>>('/users/me/wishlists', {
            params: { page, size }
        });
        return response.data;
    }
};
