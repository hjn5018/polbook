package com.polbook.api.repository;

import com.polbook.api.entity.Book;
import com.polbook.api.entity.User;
import com.polbook.api.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByUserAndBook(User user, Book book);

    boolean existsByUserAndBook(User user, Book book);

    @Query("SELECT w FROM Wishlist w JOIN FETCH w.book b JOIN FETCH b.location JOIN FETCH b.seller WHERE w.user = :user")
    Page<Wishlist> findAllByUserWithBook(@Param("user") User user, Pageable pageable);

    void deleteByUserAndBook(User user, Book book);
}
