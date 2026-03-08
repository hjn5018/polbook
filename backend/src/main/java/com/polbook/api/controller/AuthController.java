package com.polbook.api.controller;

import com.polbook.api.dto.EmailSendRequest;
import com.polbook.api.dto.EmailVerifyRequest;
import com.polbook.api.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import com.polbook.api.entity.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmailService emailService;
    private final com.polbook.api.service.AuthService authService;

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

    /**
     * 회원가입
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody com.polbook.api.dto.SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.status(201).body(Map.of("message", "회원가입이 완료되었습니다."));
    }

    /**
     * 로그인
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<com.polbook.api.dto.TokenResponse> login(
            @Valid @RequestBody com.polbook.api.dto.LoginRequest request) {
        com.polbook.api.service.AuthService.LoginResult result = authService.login(request);

        // Refresh Token을 HttpOnly Cookie로 설정
        ResponseCookie cookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                .httpOnly(true)
                .secure(false) // HTTPS에서는 true로 설정해야 함 (현재는 로컬 개발을 가정해 false)
                .path("/")
                .maxAge(Duration.ofDays(14)) // 14일
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.getTokenResponse());
    }

    /**
     * 토큰 재발급
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<com.polbook.api.dto.TokenResponse> refresh(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(401).body(null);
        }

        try {
            com.polbook.api.dto.TokenResponse tokenResponse = authService.refresh(refreshToken);
            return ResponseEntity.ok(tokenResponse);
        } catch (IllegalArgumentException e) {
            // refreshToken이 유효하지 않은 경우
            return ResponseEntity.status(401).body(null);
        }
    }

    /**
     * 모든 회원 조회 (디버그용)
     * GET /api/auth/users
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}
