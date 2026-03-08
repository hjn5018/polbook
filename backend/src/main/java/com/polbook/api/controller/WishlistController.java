package com.polbook.api.controller;

import com.polbook.api.dto.BookResponse;
import com.polbook.api.security.CustomUserDetails;
import com.polbook.api.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * 찜 토글 (찜하기 / 찜 취소)
     * POST /api/books/{bookId}/wish
     */
    @PostMapping("/books/{bookId}/wish")
    public ResponseEntity<Map<String, Boolean>> toggleWish(
            @PathVariable Long bookId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        boolean isWished = wishlistService.toggleWishlist(bookId, userDetails.getUser().getUserId());
        return ResponseEntity.ok(Map.of("isWished", isWished));
    }

    /**
     * 특정 책 찜 여부 확인
     * GET /api/books/{bookId}/wish/status
     */
    @GetMapping("/books/{bookId}/wish/status")
    public ResponseEntity<Map<String, Boolean>> getWishStatus(
            @PathVariable Long bookId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = (userDetails != null) ? userDetails.getUser().getUserId() : null;
        boolean isWished = wishlistService.isWished(bookId, userId);
        return ResponseEntity.ok(Map.of("isWished", isWished));
    }

    /**
     * 내가 찜한 목록 조회
     * GET /api/users/me/wishlists
     */
    @GetMapping("/users/me/wishlists")
    public ResponseEntity<Page<BookResponse>> getMyWishlists(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(wishlistService.getMyWishlist(userDetails.getUser().getUserId(), pageable));
    }
}
