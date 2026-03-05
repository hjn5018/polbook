package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
// Spring Boot 4.0에서 변경된 패키지 경로!
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

// MockMvc의 정적 메서드 import (요청 만들기 + 응답 검증용)
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 🧪 BookControllerTest - REST API 엔드포인트 통합 테스트
 *
 * 목적: 실제 HTTP 요청(GET, POST)을 시뮬레이션하여
 * Controller → Service → Repository → DB 전체 흐름이 정상 동작하는지 검증합니다.
 *
 * ❓ MockMvc란?
 * 실제 브라우저나 Postman 없이도 코드로 HTTP 요청을 보내고
 * 응답 상태코드(200, 404 등)와 JSON 데이터를 자동으로 검증하는 도구입니다.
 * Django의 self.client.get('/api/books/') 과 동일한 역할입니다.
 *
 * @AutoConfigureMockMvc: MockMvc 객체를 자동으로 생성하여 주입받을 수 있게 합니다.
 */
@SpringBootTest
@AutoConfigureMockMvc
class BookControllerTest {

    // MockMvc: 가짜 HTTP 요청을 보내는 도구 (브라우저/Postman 역할)
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    /**
     * @BeforeEach: 각 테스트 메서드가 실행되기 "직전"에 매번 실행됩니다.
     *              테스트 간 데이터가 섞이지 않도록 DB를 깨끗하게 비웁니다.
     */
    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();
    }

    @Test
    @DisplayName("✅ POST /api/books - 새 책을 등록하면 저장된 데이터가 반환된다")
    void createBookTest() throws Exception {
        // JSON 형태의 요청 본문 (React에서 fetch로 보내는 것과 동일한 데이터)
        String requestJson = """
                {
                    "title": "테스트용 책 제목",
                    "price": 15000
                }
                """;

        // ── MockMvc로 POST 요청 시뮬레이션 ──
        mockMvc.perform(
                post("/api/books") // POST /api/books 요청
                        .contentType(MediaType.APPLICATION_JSON) // Content-Type: application/json
                        .content(requestJson) // 요청 본문에 JSON 데이터 담기
        )
                // ── 응답 검증 (Assert) ──
                .andExpect(status().isOk()) // HTTP 상태 코드가 200(OK)인지 확인
                .andExpect(jsonPath("$.title").value("테스트용 책 제목")) // 응답 JSON의 title 필드 값 확인
                .andExpect(jsonPath("$.price").value(15000)) // 응답 JSON의 price 필드 값 확인
                .andExpect(jsonPath("$.id").exists()); // id 값이 자동 생성되어 존재하는지 확인
    }

    @Test
    @DisplayName("✅ GET /api/books - 저장된 책 목록을 정상적으로 조회할 수 있다")
    void getAllBooksTest() throws Exception {
        // 테스트 데이터 미리 준비 (DB에 2권 저장)
        Book book1 = new Book();
        book1.setTitle("자바의 정석");
        book1.setPrice(30000);
        bookRepository.save(book1);

        Book book2 = new Book();
        book2.setTitle("이것이 자바다");
        book2.setPrice(28000);
        bookRepository.save(book2);

        // ── MockMvc로 GET 요청 시뮬레이션 ──
        mockMvc.perform(
                get("/api/books") // GET /api/books 요청
        )
                .andExpect(status().isOk()) // 200 OK
                .andExpect(jsonPath("$.length()").value(2)) // 응답 JSON 배열의 길이가 2인지
                .andExpect(jsonPath("$[0].title").value("자바의 정석")) // 첫 번째 요소의 title
                .andExpect(jsonPath("$[1].title").value("이것이 자바다")); // 두 번째 요소의 title
    }

    @Test
    @DisplayName("✅ GET /api/books - DB가 비어있으면 빈 배열 []을 반환한다")
    void getEmptyBooksTest() throws Exception {
        // DB에 아무 데이터도 없는 상태에서 조회
        mockMvc.perform(
                get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0)); // 빈 배열 → 길이 0
    }
}
