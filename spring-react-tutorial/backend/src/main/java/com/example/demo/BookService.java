package com.example.demo;

// Spring 프레임워크가 제공하는 어노테이션을 import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Java의 List 컬렉션 타입을 import (여러 개의 Book 객체를 담는 바구니)
import java.util.List;

/**
 * 📋 BookService - 비즈니스 로직(핵심 업무 처리) 담당 클래스
 *
 * - Django의 views.py 에서 실제 데이터를 가공하고 검증하던 "로직 부분"만 따로 뽑아낸 것입니다.
 * - Controller(요청 접수창구)와 Repository(DB 쿼리 도구) 사이에서 중간 다리 역할을 합니다.
 *
 * 왜 Service 계층을 따로 만드나요?
 * → Controller에 로직을 직접 짜면 코드가 뒤엉켜서 유지보수가 힘들어집니다.
 * → Service로 분리하면 "같은 로직을 여러 Controller에서 재사용" 할 수 있고,
 * 나중에 테스트 코드를 짤 때도 Service 단위로 독립적으로 테스트할 수 있습니다.
 */
@Service // "이 클래스는 비즈니스 로직을 담당하는 서비스 계층입니다"라고 Spring에게 알려줌
public class BookService {

    /**
     * @Autowired: 의존성 주입(DI - Dependency Injection)
     *
     *             파이썬이었다면 아래처럼 직접 객체를 생성했을 것입니다:
     *             book_repository = BookRepository()
     *
     *             Spring에서는 이렇게 하지 않고, Spring이 미리 만들어놓은 BookRepository 객체를
     *             "저한테 주입(연결)해주세요!"라고 요청합니다.
     *             Spring이 알아서 적합한 객체를 찾아서 이 변수에 넣어줍니다.
     */
    @Autowired
    private BookRepository bookRepository;

    /**
     * 모든 책 목록을 DB에서 조회하여 반환합니다.
     * 내부적으로 실행되는 SQL: SELECT * FROM book
     *
     * @return Book 객체들의 리스트 (비어있으면 빈 리스트 [])
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * 새로운 책 데이터를 DB에 저장합니다.
     * 내부적으로 실행되는 SQL: INSERT INTO book (title, price) VALUES (?, ?)
     *
     * @param book - React에서 JSON으로 보내온 데이터가 자동 변환된 Book 객체
     * @return 저장이 완료된 Book 객체 (id 값이 자동으로 채워져서 돌아옴)
     */
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }
}
