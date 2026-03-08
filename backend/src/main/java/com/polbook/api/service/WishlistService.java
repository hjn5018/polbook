package com.polbook.api.service;

import com.polbook.api.dto.BookResponse;
import com.polbook.api.entity.Book;
import com.polbook.api.entity.User;
import com.polbook.api.entity.Wishlist;
import com.polbook.api.repository.BookRepository;
import com.polbook.api.repository.UserRepository;
import com.polbook.api.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    /**
     * 찜 토글 (찜하기 / 찜 취소)
     */
    @Transactional
    public boolean toggleWishlist(Long bookId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("책을 찾을 수 없습니다."));

        return wishlistRepository.findByUserAndBook(user, book)
                .map(wish -> {
                    wishlistRepository.delete(wish);
                    return false; // 찜 취소됨
                })
                .orElseGet(() -> {
                    wishlistRepository.save(Wishlist.builder()
                            .user(user)
                            .book(book)
                            .build());
                    return true; // 찜 등록됨
                });
    }

    /**
     * 내가 찜한 목록 조회
     */
    public Page<BookResponse> getMyWishlist(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return wishlistRepository.findAllByUserWithBook(user, pageable)
                .map(wish -> BookService.convertToResponse(wish.getBook()));
    }

    /**
     * 특정 책 찜 여부 확인
     */
    public boolean isWished(Long bookId, Long userId) {
        if (userId == null)
            return false;
        User user = userRepository.getReferenceById(userId);
        Book book = bookRepository.getReferenceById(bookId);
        return wishlistRepository.existsByUserAndBook(user, book);
    }
}
