package com.polbook.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polbook.api.dto.LoginRequest;
import com.polbook.api.dto.TokenResponse;
import com.polbook.api.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.polbook.api.service.EmailService emailService;

    @MockBean
    private com.polbook.api.security.JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    @DisplayName("로그인 성공 시 AccessToken을 body로, RefreshToken을 HttpOnly Cookie로 반환한다.")
    void login_Success() throws Exception {
        // given
        LoginRequest request = new LoginRequest("testId", "testPassword");
        TokenResponse tokenResponse = TokenResponse.of("mock-access-token");
        String mockRefreshToken = "mock-refresh-token";

        AuthService.LoginResult loginResult = new AuthService.LoginResult(tokenResponse, mockRefreshToken);

        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(loginResult);

        // when & then
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"))
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(cookie().value("refreshToken", mockRefreshToken))
                .andExpect(cookie().httpOnly("refreshToken", true))
                .andExpect(cookie().path("refreshToken", "/"))
                .andExpect(cookie().maxAge("refreshToken", 14 * 24 * 60 * 60)); // 14일
    }

    @Test
    @WithMockUser
    @DisplayName("refreshToken 쿠키를 통해 토큰 재발급(refresh)을 요청하면, 새로운 AccessToken을 반환한다.")
    void refresh_Success() throws Exception {
        // given
        String validRefreshToken = "valid-refresh-token";
        TokenResponse newTokenResponse = TokenResponse.of("new-access-token");

        Mockito.when(authService.refresh(validRefreshToken)).thenReturn(newTokenResponse);

        Cookie refreshTokenCookie = new Cookie("refreshToken", validRefreshToken);

        // when & then
        mockMvc.perform(post("/api/auth/refresh")
                .with(csrf())
                .cookie(refreshTokenCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"));
    }

    @Test
    @WithMockUser
    @DisplayName("refreshToken 쿠키 없이 재발급 요청 시 401 에러를 반환한다.")
    void refresh_NoCookie_Unauthorized() throws Exception {
        // when & then
        mockMvc.perform(post("/api/auth/refresh")
                .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    @DisplayName("유효하지 않은 refreshToken으로 재발급 요청 시 401 에러를 반환한다.")
    void refresh_InvalidToken_Unauthorized() throws Exception {
        // given
        String invalidRefreshToken = "invalid-refresh-token";
        Mockito.when(authService.refresh(invalidRefreshToken)).thenThrow(new IllegalArgumentException("Invalid token"));

        Cookie refreshTokenCookie = new Cookie("refreshToken", invalidRefreshToken);

        // when & then
        mockMvc.perform(post("/api/auth/refresh")
                .with(csrf())
                .cookie(refreshTokenCookie))
                .andExpect(status().isUnauthorized());
    }
}
