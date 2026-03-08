import api from '../utils/api';

export type Category = 'MAJOR' | 'LIBERAL' | 'CERT';
export type TradeStatus = 'SELLING' | 'RESERVED' | 'SOLD';
export type BookCondition = 'S' | 'A' | 'B' | 'C';

export interface Book {
    bookId: number;
    title: string;
    category: Category;
    department?: string;
    grade?: number;
    semester?: number;
    courseName?: string;
    professor?: string;
    price: number;
    description?: string;
    condition: BookCondition;
    hasNotes: boolean;
    tradeStatus: TradeStatus;
    viewCount: number;
    createdAt: string;
    sellerId: number;
    sellerNickname: string;
    sellerMannerScore: number;
    locationId: number;
    locationName: string;
    imageUrls: string[];
}

export interface BookRequest {
    title: string;
    category: Category;
    department?: string;
    grade?: number;
    semester?: number;
    courseName?: string;
    professor?: string;
    price: number;
    description?: string;
    condition: BookCondition;
    hasNotes: boolean;
    locationId: number;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface LocationInfo {
    locationId: number;
    name: string;
}

/** 도서 목록 조회 (검색/필터) */
export const getBooks = (params: {
    category?: Category;
    status?: TradeStatus;
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
}) => {
    return api.get<PageResponse<Book>>('/books', { params });
};

/** 도서 상세 조회 */
export const getBook = (bookId: number | string) => {
    return api.get<Book>(`/books/${bookId}`);
};

/** 도서 등록 */
export const createBook = (data: BookRequest, images: File[]) => {
    const formData = new FormData();

    // JSON 데이터를 'request' 파트로 추가
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    // 이미지 파일들을 'images' 파트로 추가
    images.forEach(image => {
        formData.append('images', image);
    });

    return api.post<{ bookId: number }>('/books', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/** 도서 상태 변경 */
export const updateStatus = (bookId: number, status: TradeStatus) => {
    return api.patch(`/books/${bookId}/status`, { status });
};

/** 도서 삭제 */
export const deleteBook = (bookId: number) => {
    return api.delete(`/books/${bookId}`);
};

/** 거래 장소 조회 */
export const getLocations = () => {
    return api.get<LocationInfo[]>('/locations');
};

export const bookService = {
    getBooks,
    getBook,
    createBook,
    updateStatus,
    deleteBook,
    getLocations
};
