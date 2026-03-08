package com.polbook.api.service;

import com.polbook.api.entity.EmailVerification;
import com.polbook.api.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final JavaMailSender mailSender;

    /** 이메일 도메인 (기본값: office.kopo.ac.kr) */
    @Value("${polbook.mail.domain:office.kopo.ac.kr}")
    private String mailDomain;

    /** Mock 모드 여부 (true면 실제 메일 발송 없이 콘솔 출력) */
    @Value("${polbook.mail.mock:true}")
    private boolean mockMode;

    /** 인증 코드 유효 시간(분) */
    @Value("${polbook.mail.expiry-minutes:5}")
    private int expiryMinutes;

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * 인증 메일 발송 (또는 Mock 모드에서는 콘솔에 코드 출력)
     *
     * @param studentId 학번 (10자리)
     */
    @Transactional
    public void sendVerificationEmail(String studentId) {
        // 6자리 인증 코드 생성
        String code = generateCode();

        // DB에 인증 정보 저장
        EmailVerification verification = EmailVerification.builder()
                .studentId(studentId)
                .code(code)
                .expiryDate(LocalDateTime.now().plusMinutes(expiryMinutes))
                .verified(false)
                .build();
        emailVerificationRepository.save(verification);

        String toEmail = studentId + "@" + mailDomain;

        if (mockMode) {
            // ========== Mock 모드: 콘솔 및 파일에 인증 코드 출력 ==========
            log.info("============================================");
            log.info("[MOCK 이메일 발송]");
            log.info("  수신자: {}", toEmail);
            log.info("  인증 코드: {}", code);
            log.info("  유효 기간: {}분", expiryMinutes);
            log.info("============================================");

            try {
                java.nio.file.Files.writeString(java.nio.file.Path.of("C:/tmp/verification_code.txt"), code);
            } catch (java.io.IOException e) {
                log.error("Failed to write verification code to file", e);
            }
        } else {
            // ========== 실제 이메일 발송 (추후 AWS SES 연동 시 사용) ==========
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[Polbook] 이메일 인증 코드");
            message.setText(
                    "안녕하세요, Polbook입니다.\n\n"
                            + "아래의 인증 코드를 입력해주세요.\n\n"
                            + "인증 코드: " + code + "\n\n"
                            + "이 코드는 " + expiryMinutes + "분간 유효합니다.\n"
                            + "본인이 요청하지 않은 경우 이 메일을 무시해주세요.");
            mailSender.send(message);
            log.info("인증 메일 발송 완료: {}", toEmail);
        }
    }

    /**
     * 인증 코드 검증
     *
     * @param studentId 학번
     * @param code      사용자가 입력한 인증 코드
     * @return 인증 성공 여부
     */
    @Transactional
    public boolean verifyCode(String studentId, String code) {
        EmailVerification verification = emailVerificationRepository
                .findTopByStudentIdAndVerifiedFalseOrderByCreatedAtDesc(studentId)
                .orElseThrow(() -> new IllegalArgumentException("인증 요청 내역이 존재하지 않습니다. 인증 메일을 먼저 발송해주세요."));

        // 만료 여부 확인
        if (verification.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("인증 코드가 만료되었습니다. 인증 메일을 다시 발송해주세요.");
        }

        // 코드 일치 여부 확인
        if (!verification.getCode().equals(code)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        // 인증 완료 처리
        verification.setVerified(true);
        emailVerificationRepository.save(verification);

        log.info("이메일 인증 성공: studentId={}", studentId);
        return true;
    }

    /**
     * 6자리 숫자 인증 코드 생성
     */
    private String generateCode() {
        int code = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(code);
    }
}
