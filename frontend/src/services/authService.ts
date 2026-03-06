import api from '../utils/api';

/** 인증 메일 발송 요청 */
export const sendVerificationEmail = (studentId: string) => {
    return api.post('/auth/email/send', { studentId });
};

/** 인증 코드 확인 요청 */
export const verifyEmailCode = (studentId: string, code: string) => {
    return api.post('/auth/email/verify', { studentId, code });
};
