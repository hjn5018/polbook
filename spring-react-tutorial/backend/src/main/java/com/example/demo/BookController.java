package com.example.demo;

// Spring Web 관련 어노테이션 import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 🌐 BookController - REST API 요청을 받아들이는 "창구(접수처)" 클래스
 *
 * - Django의 urls.py + views.py(응답 부분) 역할을 합니다.
 * - 클라이언트(React 화면)가 보낸 HTTP 요청(GET, POST 등)을 여기서 받고,
 * Service에게 처리를 위임한 뒤, 결과를 JSON 형태로 클라이언트에게 돌려줍니다.
 *
 * @RestController = @Controller + @ResponseBody
 *                 → 이 클래스의 모든 메서드 반환값을 자동으로 JSON으로 변환해서 응답합니다.
 *                 → Django에서 JsonResponse() 를 매번 쓰던 것을 자동화한 것과 같습니다.
 */
@RestController
@RequestMapping("/api") // 이 컨트롤러의 모든 URL 앞에 "/api"가 자동으로 붙습니다.
public class BookController {

    /**
     * Service 계층을 주입받습니다.
     * Controller는 절대로 Repository(DB)에 직접 접근하지 않습니다.
     * 반드시 Service를 거쳐서 데이터를 처리합니다. (Controller → Service → Repository)
     */
    @Autowired
    private BookService bookService;

    /**
     * ✅ GET /api/books - 모든 책 목록 조회 API
     *
     * React의 useEffect에서 fetch('http://localhost:8080/api/books') 로 호출됩니다.
     * Service를 통해 DB에서 모든 Book 데이터를 가져와서 JSON 배열로 반환합니다.
     *
     * 응답 예시: [{"id":1,"title":"스프링 부트 입문","price":18000}, ...]
     */
    @GetMapping("/books") // HTTP GET 요청이 /api/books 로 들어오면 이 메서드가 실행됨
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    /**
     * ✅ POST /api/books - 새 책 등록 API
     *
     * React에서 fetch(url, { method: 'POST', body: JSON.stringify({title, price}) })
     * 로 보낸 JSON 데이터가 이 메서드의 매개변수 book 에 자동으로 변환되어 들어옵니다.
     *
     * @RequestBody : HTTP 요청 본문(body)에 담긴 JSON을 Book 자바 객체로 자동 변환해줍니다.
     *              → Django DRF의 serializer.is_valid() + serializer.save() 를 한 줄로
     *              처리한 것과 비슷합니다.
     *
     *              요청 예시: {"title": "스프링 부트 입문", "price": 18000}
     *              응답 예시: {"id": 1, "title": "스프링 부트 입문", "price": 18000}
     */
    @PostMapping("/books") // HTTP POST 요청이 /api/books 로 들어오면 이 메서드가 실행됨
    public Book createBook(@RequestBody Book book) {
        return bookService.createBook(book);
    }
}
