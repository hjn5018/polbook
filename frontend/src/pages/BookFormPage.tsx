import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiX, FiCheck, FiInfo } from 'react-icons/fi';
import { bookService, type BookRequest, type Category, type BookCondition, type LocationInfo } from '../services/bookService';

const BookFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [locations, setLocations] = useState<LocationInfo[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState<BookRequest>({
        title: '',
        category: 'MAJOR',
        department: '',
        grade: 1,
        semester: 1,
        courseName: '',
        professor: '',
        price: 0,
        description: '',
        condition: 'A',
        hasNotes: false,
        locationId: 1
    });

    const fetchLocations = useCallback(async () => {
        try {
            const response = await bookService.getLocations();
            setLocations(response.data);
            if (response.data.length > 0 && !isEdit) {
                setFormData(prev => ({ ...prev, locationId: response.data[0].locationId }));
            }
        } catch (error) {
            console.error('Failed to fetch locations:', error);
        }
    }, [isEdit]);

    const fetchBookForEdit = useCallback(async () => {
        if (!id) return;
        try {
            const response = await bookService.getBook(id);
            const book = response.data;
            setFormData({
                title: book.title,
                category: book.category,
                department: book.department || '',
                grade: book.grade || 1,
                semester: book.semester || 1,
                courseName: book.courseName || '',
                professor: book.professor || '',
                price: book.price,
                description: book.description || '',
                condition: book.condition,
                hasNotes: book.hasNotes,
                locationId: book.locationId
            });
            // Note: In a real app, you might want to show existing images and allow deleting them.
            // For now, we'll simplify and only allow new uploads for edit or keep existing (on backend side logic if implemented).
        } catch (error) {
            console.error('Failed to fetch book for edit:', error);
            navigate('/');
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchLocations();
        if (isEdit) fetchBookForEdit();
    }, [fetchLocations, fetchBookForEdit, isEdit]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0 && !isEdit) {
            alert('최소 한 장의 이미지를 등록해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            if (isEdit) {
                // Update logic... (Backend update not fully implemented in service yet, let's assume it works or we use create for now)
                // For simplicity in this demo, we'll just handle create.
                alert('수정 기능은 현재 구현 중입니다.');
            } else {
                await bookService.createBook(formData, images);
                alert('도서가 성공적으로 등록되었습니다.');
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to submit book:', error);
            alert('등록에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-400 hover:text-gray-900 font-bold mb-8 transition-colors group"
            >
                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 뒤로 가기
            </button>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50 p-10">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        {isEdit ? '게시글 수정하기' : '소중한 책 등록하기'}
                    </h1>
                    <p className="text-gray-400 font-medium">상세한 정보를 입력할수록 더 빨리 거래될 확률이 높아요!</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">상품 이미지 (최대 5장)</label>
                        <div className="flex flex-wrap gap-4">
                            <label className="w-24 h-24 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500">
                                <FiCamera size={24} className="mb-1" />
                                <span className="text-[10px] font-bold">{images.length}/5</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>

                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-3xl overflow-hidden border border-gray-100 group">
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">게시글 제목</label>
                            <input
                                type="text"
                                required
                                placeholder="예: [컴공] 자바의 정석 3판 팝니다 (깨끗함)"
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">카테고리</label>
                            <select
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900 appearance-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                            >
                                <option value="MAJOR">전공 서적</option>
                                <option value="LIBERAL">교양 서적</option>
                                <option value="CERT">자격증 / 수험서</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">판매 가격 (원)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="100"
                                placeholder="0"
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Detail Info (Optional but recommended) */}
                    <div className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 space-y-6">
                        <div className="flex items-center space-x-2 text-blue-600 mb-2">
                            <FiInfo />
                            <span className="text-xs font-black uppercase tracking-widest">도서 상세 정보</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">학과/학부</label>
                                <input
                                    type="text"
                                    placeholder="예: 컴퓨터공학과"
                                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 outline-none font-bold text-sm"
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">강의명</label>
                                <input
                                    type="text"
                                    placeholder="예: 객체지향프로그래밍"
                                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 outline-none font-bold text-sm"
                                    value={formData.courseName}
                                    onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">교수명</label>
                                <input
                                    type="text"
                                    placeholder="예: 김철수 교수님"
                                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 outline-none font-bold text-sm"
                                    value={formData.professor}
                                    onChange={e => setFormData({ ...formData, professor: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">희망 거래 장소</label>
                                <select
                                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-100 focus:border-blue-500 outline-none font-bold text-sm appearance-none"
                                    value={formData.locationId}
                                    onChange={e => setFormData({ ...formData, locationId: parseInt(e.target.value) })}
                                >
                                    {locations.map(loc => (
                                        <option key={loc.locationId} value={loc.locationId}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Condition & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">책 상태</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { v: 'S', l: '최상 (새것 같음)' },
                                    { v: 'A', l: '상 (깨끗함)' },
                                    { v: 'B', l: '중 (사용감 있음)' },
                                    { v: 'C', l: '하 (낡음)' }
                                ].map(item => (
                                    <button
                                        key={item.v}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, condition: item.v as BookCondition })}
                                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${formData.condition === item.v
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                                : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'
                                            }`}
                                    >
                                        {item.l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">필기 흔적</label>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, hasNotes: !formData.hasNotes })}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${formData.hasNotes
                                        ? 'bg-orange-50 border-orange-200 text-orange-600'
                                        : 'bg-white border-gray-100 text-gray-400'
                                    }`}
                            >
                                <span className={`text-sm font-bold ${formData.hasNotes ? 'text-orange-600' : 'text-gray-600'}`}>필기 흔적이 있습니다</span>
                                {formData.hasNotes && <FiCheck />}
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">상세 내용</label>
                        <textarea
                            rows={6}
                            placeholder="책의 낙서 상태, 모서리 파손 여부 등 상세한 상태를 적어주세요."
                            className="w-full px-6 py-5 rounded-[2rem] bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-gray-600 leading-relaxed resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg hover:bg-black transition-all shadow-2xl shadow-gray-200 disabled:bg-gray-400 disabled:shadow-none"
                    >
                        {isLoading ? '등록 중...' : isEdit ? '수정 완료하기' : '게시글 등록하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookFormPage;
