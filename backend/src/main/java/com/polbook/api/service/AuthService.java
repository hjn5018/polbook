package com.polbook.api.service;

import com.polbook.api.dto.LoginRequest;
import com.polbook.api.dto.SignupRequest;
import com.polbook.api.dto.TokenResponse;
import com.polbook.api.entity.User;
import com.polbook.api.repository.RefreshTokenRepository;
import com.polbook.api.repository.UserRepository;
import com.polbook.api.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("이미 가입된 학번입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        User user = User.builder()
                .studentId(request.getStudentId())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                // .profileImage(request.getProfileImage()) // 필요한 경우
                .build();

        userRepository.save(user);
    }

    @Transactional
    public LoginResult login(LoginRequest request) {
        User user = userRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("학번 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("학번 또는 비밀번호가 올바르지 않습니다.");
        }

        // 제재(Suspension) 확인
        if (user.getIsSuspended() && user.getSuspendedUntil() != null
                && user.getSuspendedUntil().isAfter(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("이용이 정지된 계정입니다. 정지 해제일: " + user.getSuspendedUntil());
        }

        String accessToken = jwtTokenProvider.createToken(user.getStudentId(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getStudentId(), user.getRole().name());

        // Refresh Token DB 저장 (기존 토큰이 있으면 덮어쓰기)
        java.util.Optional<com.polbook.api.entity.RefreshToken> existingToken = refreshTokenRepository
                .findByStudentId(user.getStudentId());
        if (existingToken.isPresent()) {
            existingToken.get().updateToken(refreshToken, java.time.LocalDateTime.now().plusDays(14)); // 14일
                                                                                                       // (application.yml
                                                                                                       // 설정과 맞춤, 하드코딩
                                                                                                       // 피하려면 프로퍼티로 빼도
                                                                                                       // 됨)
            // Save is not strictly needed because of @Transactional, but good for clarity.
            refreshTokenRepository.save(existingToken.get());
        } else {
            com.polbook.api.entity.RefreshToken newToken = com.polbook.api.entity.RefreshToken.builder()
                    .studentId(user.getStudentId())
                    .token(refreshToken)
                    .expiryDate(java.time.LocalDateTime.now().plusDays(14))
                    .build();
            refreshTokenRepository.save(newToken);
        }

        return new LoginResult(TokenResponse.of(accessToken), refreshToken);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않거나 만료된 Refresh Token입니다.");
        }

        com.polbook.api.entity.RefreshToken savedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Refresh Token입니다."));

        User user = userRepository.findByStudentId(savedToken.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String newAccessToken = jwtTokenProvider.createToken(user.getStudentId(), user.getRole().name());
        return TokenResponse.of(newAccessToken);
    }

    @Transactional(readOnly = true)
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @lombok.Getter
    @lombok.AllArgsConstructor
    public static class LoginResult {
        private TokenResponse tokenResponse;
        private String refreshToken;
    }
}
