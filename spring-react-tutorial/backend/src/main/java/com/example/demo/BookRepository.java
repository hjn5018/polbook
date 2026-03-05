package com.example.demo;

// Spring Data JPA의 핵심 인터페이스 import
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 📦 BookRepository - 데이터베이스 쿼리 담당 인터페이스
 *
 * - Django의 `Book.objects` (QuerySet API)와 동일한 역할을 합니다.
 * - JpaRepository<Book, Long>을 상속하는 것만으로 아래 메서드들이 "공짜로" 생깁니다:
 *
 * ✅ bookRepository.save(book) → INSERT 또는 UPDATE
 * ✅ bookRepository.findAll() → SELECT * FROM book
 * ✅ bookRepository.findById(id) → SELECT * FROM book WHERE id = ?
 * ✅ bookRepository.deleteById(id) → DELETE FROM book WHERE id = ?
 * ✅ bookRepository.count() → SELECT COUNT(*) FROM book
 *
 * JpaRepository<T, ID>의 두 타입 파라미터:
 * - T = 어떤 엔티티를 다루는가? → Book
 * - ID = 기본키(PK)의 타입은? → Long (Book.id의 타입)
 *
 * 심화:
 * 메서드 이름 규칙만 잘 지키면 커스텀 쿼리도 자동 생성됩니다.
 * 예) findByTitle(String title) → SELECT * FROM book WHERE title = ?
 */
public interface BookRepository extends JpaRepository<Book, Long> {
    // 이 프로젝트에서는 추가 쿼리 메서드가 필요 없으므로 비워 둡니다.
    // JpaRepository 상속만으로 기본 CRUD가 모두 제공됩니다.
}
