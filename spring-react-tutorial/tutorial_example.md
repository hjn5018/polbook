# 🚀 Polbook 튜토리얼: 초소형 게시판 예시 프로젝트

이 문서는 Django 개발자와 React 초보자가 **"React 프론트엔드 ↔ Spring Boot 백엔드 ↔ MySQL Database"**가 파동처럼 어떻게 데이터를 주고받는지 한눈에 이해할 수 있도록 구성한 초미니(Mini) 게시판 구축 코드 조각입니다.

---

## 1. 🖥️ Spring Boot (Backend): 책 하나 등록하기

Django의 `models.py`, `serializers.py`, `views.py`, `urls.py`가 짬뽕되어 돌아가던 기능이 Spring Boot에서는 4개의 파일로 깔끔하게 나뉩니다.

### ① Domain / Entity (핵심 비즈니스 모델 및 DB 테이블 모양) - *Django `models.py` 역할*
> 💡 **도메인(Domain)이란?** 
> 소프트웨어가 해결하고자 하는 문제 영역의 '핵심 개념'을 의미합니다. Polbook 서비스에서는 **회원(User), 책(Book), 채팅(Chat)** 등이 도메인이 됩니다.
> Spring Boot에서는 보통 이 도메인의 데이터 구조를 담은 자바 객체를 `@Entity`로 만들어 DB 테이블과 1:1로 매핑시켜 사용합니다.
```java
// Book.java
@Entity
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;            // PK (자동 생성)
    private String title;       // 책 제목
    private int price;          // 가격
    
    // 기본 생성자, Getter, Setter 생략 (보통 @Data 어노테이션으로 퉁침)
}
```

### ② Repository (DB 쿼리) - *Django `Book.objects.xyz()` 역할*
```java
// BookRepository.java
// JpaRepository를 상속받으면 Insert, Select 쿼리를 짤 필요 없이 기본 제공됩니다.
public interface BookRepository extends JpaRepository<Book, Long> {
    // 끝! 아무것도 안 적어도 save(), findAll(), findById() 가 공짜로 생깁니다.
}
```

### ③ Service (비즈니스 핵심 로직) - *Django `views.py` 내부 로직 역할*
```java
// BookService.java
@Service // "나는 로직을 담당하는 녀석이야"
public class BookService {
    
    // (DI 창구) 의존성 주입: 저 쿼리 날리게 Repository 좀 빌려주세요!
    @Autowired  
    private BookRepository bookRepository;
    
    // 책 저장 로직
    public Book createBook(Book book) {
        // 여기서 가격이 0원 이하인지 등등 검사 가능
        return bookRepository.save(book); // DB에 INSERT
    }
}
```

### ④ Controller (API 입출구) - *Django `urls.py` + `views.py(응답)` 역할*
```java
// BookController.java
@RestController            // "나는 JSON만 응답하는 창구야"
@RequestMapping("/api")    // 내 밑에 있는 주소들은 무조건 /api 로 시작해
public class BookController {
    
    @Autowired
    private BookService bookService; // 로직 좀 빌려주세요!
    
    // POST /api/books 로 JSON(책 정보) 데이터가 요청으로 들어오면?
    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        // 비즈니스 로직(Service)에 책을 던져주고 완료된 결과를 리턴(JSON 변환)합니다.
        return bookService.createBook(book); 
    }
}
```

---

## 2. 🎨 React (Frontend): 화면 조립 및 백엔드에 전송하기

React는 텅 빈 도화지입니다. 사용자가 텍스트 창 안에 제목과 가격을 치고 [등록] 버튼을 누르면, 백엔드(`/api/books`)로 JSON 데이터를 쏘는 화면 컴포넌트입니다.

### ① 컴포넌트(구역) 나누기 및 State(상태) 선언
```jsx
// BookForm.jsx
import React, { useState } from 'react';

function BookForm() {
    // 1. 화면에 입력될 데이터를 담을 상태(State) 바구니를 만듭니다.
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);

    // 2. 가상의 화면(HTML)을 렌더링(return) 합니다.
    return (
        <div style={{ padding: '20px', border: '1px solid gray' }}>
            <h2>새로운 책 등록하기</h2>
            
            {/* 사용자가 글자를 칠 때마다 title 상태 바구니에 차곡차곡 담습니다. */}
            <input 
               type="text" 
               placeholder="책 제목" 
               onChange={(e) => setTitle(e.target.value)} 
            />
            
            <input 
               type="number" 
               placeholder="가격(원)" 
               onChange={(e) => setPrice(Number(e.target.value))} 
            />
            
            {/* 버튼을 누르면 아래 만들어둘 3번 액션(API 쏘기)을 실행합니다. */}
            <button onClick={handleSubmit}>백엔드로 전송!</button>
        </div>
    );
```

### ② API 쏘기 (백엔드와 연결)
방금 만든 `<button>`이 눌렸을 때 실행될 함수 `handleSubmit`을 위에 추가합니다. 파이썬의 `requests.post()` 역할을 자바스크립트에선 `fetch()` 또는 `axios.post()`가 합니다.

```jsx
    // 3. 폼 전송 함수
    const handleSubmit = async () => {
        // Spring Boot가 받을 수 있도록 JSON 덩어리로 만듭니다.
        const bookData = {
            title: title,
            price: price
        };

        // Spring Boot 서버(예: localhost:8080)로 전송!
        const response = await fetch('http://localhost:8080/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            alert("책이 성공적으로 등록되었습니다!");
        } else {
            alert("등록 실패...");
        }
    };
    
// (컴포넌트 끝부분 closing tag들 생략)
}

export default BookForm;
```

---

## 🚀 흐름 총정리 (Life Cycle)

1.  **[React]** `BookForm.jsx` 화면에서 사용자가 **"해리포터"**, **"15000"** 을 입력하고 전송 버튼을 누릅니다.
2.  **[React ➔ Spring Boot]** `fetch()` 함수가 `{ "title": "해리포터", "price": 15000 }` 라는 **JSON** 덩어리를 `POST /api/books` 주소로 쏩니다.
3.  **[Spring Boot Controller]** `BookController`가 이 JSON을 받아서 `Book` 클래스(자바 객체)로 자동 변환합니다.
4.  **[Spring Boot Service]** 컨트롤러가 `BookService`에게 "이 객체 좀 저장해줘"라고 넘깁니다.
5.  **[Spring Boot Repository]** 서비스가 검증을 끝낸 뒤 `BookRepository.save()`를 호출하면, **Hibernate(JPA)**가 뒤에서 몰래 `INSERT INTO book(title, price) VALUES ('해리포터', 15000)` 이라는 SQL 문을 작성하여 MySQL에 꽂아 넣습니다.
6.  **[응답 리턴]** 성공적으로 저장된 데이터를 다시 역순으로 타고 올라가 React에게 던져주면, React에서 `alert("성공!")` 팝업이 뜹니다.
