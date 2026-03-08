package com.polbook.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.access-token-validity-in-seconds}")
    private long accessTokenValidityInSeconds;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;

    private Key secretKey;
    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostConstruct
    protected void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidityInSeconds = this.accessTokenValidityInSeconds * 1000; // 밀리초로 변환
        this.refreshTokenValidityInSeconds = this.refreshTokenValidityInSeconds * 1000;
    }

    // Access Token 생성
    public String createToken(String studentId, String role) {
        return createTokenInternal(studentId, role, accessTokenValidityInSeconds);
    }

    // Refresh Token 생성
    public String createRefreshToken(String studentId, String role) {
        return createTokenInternal(studentId, role, refreshTokenValidityInSeconds);
    }

    // 내부 공통 토큰 생성 메서드
    private String createTokenInternal(String studentId, String role, long validityInMilliseconds) {
        Claims claims = Jwts.claims().setSubject(studentId);
        claims.put("role", role);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 파싱 및 인증 정보 추출
    public Authentication getAuthentication(String token) {
        String studentId = getStudentId(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(studentId);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // 토큰에서 학번(studentId) 추출
    public String getStudentId(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody().getSubject();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // 유효하지 않거나 만료된 토큰
            return false;
        }
    }
}
