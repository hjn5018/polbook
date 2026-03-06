package com.polbook.api.controller;

import com.polbook.api.dto.EmailSendRequest;
import com.polbook.api.dto.EmailVerifyRequest;
import com.polbook.api.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmailService emailService;

    /**
     * 인증 메일 발송
     * POST /api/auth/email/send
     */
    @PostMapping("/email/send")
    public ResponseEntity<Map<String, String>> sendVerificationEmail(
            @Valid @RequestBody EmailSendRequest request) {

        emailService.sendVerificationEmail(request.getStudentId());
        return ResponseEntity.ok(Map.of("message", "인증 코드가 발송되었습니다."));
    }

    /**
     * 인증번호 확인
     * POST /api/auth/email/verify
     */
    @PostMapping("/email/verify")
    public ResponseEntity<Map<String, Object>> verifyEmail(
            @Valid @RequestBody EmailVerifyRequest request) {

        boolean verified = emailService.verifyCode(request.getStudentId(), request.getCode());
        return ResponseEntity.ok(Map.of(
                "verified", verified,
                "message", "이메일 인증이 완료되었습니다."));
    }
}
