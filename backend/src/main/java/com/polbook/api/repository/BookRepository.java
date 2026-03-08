package com.polbook.api.repository;

import com.polbook.api.entity.Book;
import com.polbook.api.entity.Category;
import com.polbook.api.entity.TradeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * 목록 조회 (필터 포함)
     * QueryDSL을 도입하면 더 깔끔하겠지만, 우선 기본적인 JPA로 작성
     */
    @Query("SELECT b FROM Book b " +
            "JOIN FETCH b.location " +
            "JOIN FETCH b.seller " +
            "WHERE (:category IS NULL OR b.category = :category) " +
            "AND (:status IS NULL OR b.tradeStatus = :status) " +
            "AND (:keyword IS NULL OR b.title LIKE %:keyword% OR b.courseName LIKE %:keyword% OR b.professor LIKE %:keyword%)")
    Page<Book> findAllWithFilters(
            @Param("category") Category category,
            @Param("status") TradeStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("SELECT b FROM Book b " +
            "JOIN FETCH b.location " +
            "JOIN FETCH b.seller " +
            "LEFT JOIN FETCH b.images " +
            "WHERE b.bookId = :id")
    Optional<Book> findByIdWithDetails(@Param("id") Long id);
}
