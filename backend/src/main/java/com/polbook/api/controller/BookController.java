package com.polbook.api.controller;

import com.polbook.api.dto.BookRequest;
import com.polbook.api.dto.BookResponse;
import com.polbook.api.dto.LocationResponse;
import com.polbook.api.entity.Category;
import com.polbook.api.entity.TradeStatus;
import com.polbook.api.security.CustomUserDetails;
import com.polbook.api.service.BookService;
import com.polbook.api.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final LocationService locationService;

    /**
     * 📖 책 목록 조회 (페이지네이션 + 필터)
     * GET
     * /api/books?category=MAJOR&status=SELLING&page=0&size=10&sort=createdAt,desc&keyword=자바
     */
    @GetMapping("/books")
    public ResponseEntity<Page<BookResponse>> getBooks(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) TradeStatus status,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(bookService.getBooks(category, status, keyword, pageable));
    }

    /**
     * 📖 책 상세 조회
     * GET /api/books/{bookId}
     */
    @GetMapping("/books/{bookId}")
    public ResponseEntity<BookResponse> getBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookService.getBook(bookId));
    }

    /**
     * 📖 새 책 등록
     * POST /api/books
     * MultipartFormData로 JSON과 File들을 함께 전송
     */
    @PostMapping(value = "/books", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String, Long>> createBook(
            @RequestPart("request") @Valid BookRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long bookId = bookService.createBook(request, images, userDetails.getUser().getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("bookId", bookId));
    }

    /**
     * 📖 책 거래 상태 변경 (SELLING, RESERVED, SOLD)
     * PATCH /api/books/{bookId}/status
     */
    @PatchMapping("/books/{bookId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long bookId,
            @RequestBody Map<String, TradeStatus> statusMap,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        bookService.updateStatus(bookId, statusMap.get("status"), userDetails.getUser().getUserId());
        return ResponseEntity.ok().build();
    }

    /**
     * 📖 책 삭제
     * DELETE /api/books/{bookId}
     */
    @DeleteMapping("/books/{bookId}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable Long bookId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        bookService.deleteBook(bookId, userDetails.getUser().getUserId());
        return ResponseEntity.noContent().build();
    }

    /**
     * 📍 활성화된 거래 장소 목록
     * GET /api/locations
     */
    @GetMapping("/locations")
    public ResponseEntity<List<LocationResponse>> getLocations() {
        return ResponseEntity.ok(locationService.getActiveLocations());
    }
}
