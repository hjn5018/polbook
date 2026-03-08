import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerificationEmail, verifyEmailCode, signup } from '../services/authService';
import './SignupPage.css';

export default function SignupPage() {
    const navigate = useNavigate();

    // 학번 및 이메일 인증 상태
    const [studentId, setStudentId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    // 타이머 상태
    const [timeLeft, setTimeLeft] = useState(0);

    // 회원가입 폼 상태
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickname, setNickname] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    // 로딩 상태
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    // 타이머 카운트다운
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // 타이머 포맷 (mm:ss)
    const formatTime = (seconds: number) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s} `;
    };

    // 학번 유효성 검사
    const isStudentIdValid = /^[0-9]{10}$/.test(studentId);

    // 인증 메일 발송
    const handleSendEmail = async () => {
        if (!isStudentIdValid) {
            setEmailError('학번은 10자리 숫자여야 합니다.');
            return;
        }

        setIsSending(true);
        setEmailError('');
        setEmailMessage('');

        try {
            await sendVerificationEmail(studentId);
            setIsEmailSent(true);
            setIsEmailVerified(false);
            setVerificationCode('');
            setTimeLeft(300); // 5분 타이머
            setEmailMessage(`${studentId}@office.kopo.ac.kr 로 인증 코드가 발송되었습니다.`);
        } catch (err: any) {
            const msg = err.response?.data?.message || '인증 메일 발송에 실패했습니다.';
            setEmailError(msg);
        } finally {
            setIsSending(false);
        }
    };

    // 인증 코드 확인
    const handleVerifyCode = async () => {
        if (verificationCode.length !== 6) {
            setEmailError('인증 코드 6자리를 입력해주세요.');
            return;
        }

        setIsVerifying(true);
        setEmailError('');
        setEmailMessage('');

        try {
            const res = await verifyEmailCode(studentId, verificationCode);
            if (res.data.verified) {
                setIsEmailVerified(true);
                setTimeLeft(0);
                setEmailMessage('이메일 인증이 완료되었습니다!');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || '인증 코드 확인에 실패했습니다.';
            setEmailError(msg);
        } finally {
            setIsVerifying(false);
        }
    };

    // 회원가입 제출
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmailVerified) {
            setEmailError('이메일 인증을 먼저 완료해주세요.');
            return;
        }
        if (password !== passwordConfirm) {
            setEmailError('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (password.length < 8) {
            setEmailError('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        setIsSigningUp(true);
        setEmailError('');

        try {
            await signup({
                studentId,
                email: `${studentId}@office.kopo.ac.kr`,
                password,
                nickname
            });
            setSignupSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            const msg = err.response?.data?.message || '회원가입에 실패했습니다.';
            setEmailError(msg);
        } finally {
            setIsSigningUp(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1 className="signup-title">📚 Polbook</h1>
                    <p className="signup-subtitle">교내 중고 책 거래 서비스</p>
                </div>

                {signupSuccess && (
                    <div className="success-message-global">
                        <p>🎉 회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.</p>
                    </div>
                )}

                <form className="signup-form" onSubmit={handleSignup}>
                    {/* ===== 1단계: 이메일 인증 ===== */}
                    <div className="form-section">
                        <h2 className="section-title">
                            <span className={`step - badge ${isEmailVerified ? 'completed' : 'active'} `}>
                                {isEmailVerified ? '✓' : '1'}
                            </span>
                            이메일 인증
                        </h2>

                        {/* 학번 입력 + 전송 버튼 */}
                        <div className="input-row">
                            <div className="input-with-suffix">
                                <input
                                    id="studentId"
                                    type="text"
                                    maxLength={10}
                                    placeholder="학번 10자리 입력"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                                    disabled={isEmailVerified}
                                    className="input-field"
                                />
                                <span className="input-suffix">@office.kopo.ac.kr</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleSendEmail}
                                disabled={!isStudentIdValid || isSending || isEmailVerified}
                                className={`btn - send ${isEmailSent && !isEmailVerified ? 'btn-resend' : ''} `}
                            >
                                {isSending ? '발송 중...' : isEmailSent ? '재전송' : '인증 전송'}
                            </button>
                        </div>

                        {/* 인증 코드 입력 (메일 발송 후 표시) */}
                        {isEmailSent && !isEmailVerified && (
                            <div className="verification-section">
                                <div className="input-row">
                                    <div className="input-with-timer">
                                        <input
                                            id="verificationCode"
                                            type="text"
                                            maxLength={6}
                                            placeholder="인증 코드 6자리"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                            className="input-field code-input"
                                        />
                                        {timeLeft > 0 && (
                                            <span className={`timer ${timeLeft <= 60 ? 'timer-warning' : ''} `}>
                                                {formatTime(timeLeft)}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        disabled={verificationCode.length !== 6 || isVerifying || timeLeft <= 0}
                                        className="btn-verify"
                                    >
                                        {isVerifying ? '확인 중...' : '인증 확인'}
                                    </button>
                                </div>
                                {timeLeft <= 0 && isEmailSent && !isEmailVerified && (
                                    <p className="timer-expired">인증 시간이 만료되었습니다. 다시 전송해주세요.</p>
                                )}
                            </div>
                        )}

                        {/* 인증 완료 상태 */}
                        {isEmailVerified && (
                            <div className="verified-badge">
                                <span className="verified-icon">✅</span>
                                <span>인증 완료 ({studentId}@office.kopo.ac.kr)</span>
                            </div>
                        )}

                        {/* 메시지 영역 */}
                        {emailMessage && <p className="message success">{emailMessage}</p>}
                        {emailError && <p className="message error">{emailError}</p>}
                    </div>

                    {/* ===== 2단계: 회원 정보 입력 (이메일 인증 후 활성화) ===== */}
                    <div className={`form - section ${!isEmailVerified ? 'disabled-section' : ''} `}>
                        <h2 className="section-title">
                            <span className={`step - badge ${isEmailVerified ? 'active' : ''} `}>2</span>
                            회원 정보 입력
                        </h2>

                        <div className="form-group">
                            <label htmlFor="nickname">닉네임</label>
                            <input
                                id="nickname"
                                type="text"
                                placeholder="사용할 닉네임"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                disabled={!isEmailVerified}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">비밀번호</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={!isEmailVerified}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="passwordConfirm">비밀번호 확인</label>
                            <input
                                id="passwordConfirm"
                                type="password"
                                placeholder="비밀번호 확인"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                disabled={!isEmailVerified}
                                className="input-field"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!isEmailVerified || !nickname || !password || !passwordConfirm || isSigningUp}
                            className="btn-signup"
                        >
                            {isSigningUp ? '가입 중...' : '회원가입'}
                        </button>
                    </div>
                </form>

                <div className="signup-footer">
                    <p>
                        이미 계정이 있으신가요?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                            로그인
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
