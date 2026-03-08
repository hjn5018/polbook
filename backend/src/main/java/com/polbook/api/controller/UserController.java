package com.polbook.api.controller;

import com.polbook.api.dto.BookResponse;
import com.polbook.api.dto.UserResponse;
import com.polbook.api.dto.UserUpdateRequest;
import com.polbook.api.security.CustomUserDetails;
import com.polbook.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 내 프로필 정보 조회
     * GET /api/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.getMyProfile(userDetails.getUser().getUserId()));
    }

    /**
     * 내 프로필 정보 수정
     * PATCH /api/users/me
     */
    @PatchMapping(value = "/me", consumes = { "multipart/form-data" })
    public ResponseEntity<UserResponse> updateProfile(
            @RequestPart("request") @Valid UserUpdateRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(userService.updateProfile(userDetails.getUser().getUserId(), request, profileImage));
    }

    /**
     * 내가 등록한 책 목록 조회
     * GET /api/users/me/books
     */
    @GetMapping("/me/books")
    public ResponseEntity<Page<BookResponse>> getMyBooks(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(userService.getMyBooks(userDetails.getUser().getUserId(), pageable));
    }
}
