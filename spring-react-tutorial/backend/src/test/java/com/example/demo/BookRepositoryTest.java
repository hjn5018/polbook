package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 🧪 BookRepositoryTest - Book 엔티티의 DB 저장/조회 테스트
 *
 * 목적: BookRepository가 DB(H2)에 데이터를 제대로 저장하고 꺼내오는지 검증합니다.
 * Django로 치면 models.py의 모델이 DB에 제대로 저장되는지 테스트하는 것과 같습니다.
 *
 * 💡 H2 메모리 DB를 사용하므로 테스트가 끝나면 데이터가 자동으로 사라집니다.
 * 실제 MySQL 데이터에는 전혀 영향을 주지 않아 안심하고 테스트할 수 있습니다.
 */
@SpringBootTest
class BookRepositoryTest {

    // Spring이 자동으로 만들어둔 BookRepository 객체를 주입받습니다.
    @Autowired
    private BookRepository bookRepository;

    @Test
    @DisplayName("📖 새로운 책을 DB에 저장하고, 저장된 데이터를 정상적으로 조회할 수 있다")
    void saveAndFindBook() {
        // ── 1단계: 테스트용 Book 객체 준비 (Arrange) ──
        Book book = new Book();
        book.setTitle("스프링 부트 입문");
        book.setPrice(18000);

        // ── 2단계: DB에 저장 실행 (Act) ──
        // save() 호출 시 Hibernate가 INSERT SQL을 자동 생성하여 H2 DB에 넣습니다.
        Book savedBook = bookRepository.save(book);

        // ── 3단계: 결과 검증 (Assert) ──
        // assertNotNull: 값이 null이 아닌지 확인 (id가 자동 생성되었는지)
        assertNotNull(savedBook.getId(), "저장 후 ID가 자동으로 생성되어야 합니다");

        // assertEquals(기대값, 실제값): 두 값이 같은지 확인
        assertEquals("스프링 부트 입문", savedBook.getTitle(), "저장한 제목과 조회한 제목이 일치해야 합니다");
        assertEquals(18000, savedBook.getPrice(), "저장한 가격과 조회한 가격이 일치해야 합니다");
    }

    @Test
    @DisplayName("📚 여러 권의 책을 저장하고, findAll()로 전체 목록을 조회할 수 있다")
    void findAllBooks() {
        // 기존 데이터 정리 (다른 테스트에서 넣은 데이터가 남아있을 수 있으므로)
        bookRepository.deleteAll();

        // 책 2권 저장
        Book book1 = new Book();
        book1.setTitle("리액트를 다루는 기술");
        book1.setPrice(25000);
        bookRepository.save(book1);

        Book book2 = new Book();
        book2.setTitle("자바의 정석");
        book2.setPrice(30000);
        bookRepository.save(book2);

        // 전체 조회
        List<Book> books = bookRepository.findAll();

        // 2권이 정확히 조회되는지 확인
        assertEquals(2, books.size(), "저장한 2권의 책이 모두 조회되어야 합니다");
    }
}
