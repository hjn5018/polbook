# 🗂️ Polbook 프로젝트 구조 가이드 (Project Structure Guide)

이 문서는 Polbook 프로젝트의 **Frontend(React)** 와 **Backend(Spring Boot)** 의 디렉토리 아키텍처와 각 폴더들이 수행하는 역할(Role)에 대해 설명합니다.

---

## 1. 🌐 Frontend (React + Vite) 구조 개요

React 프론트엔드 앱은 재사용성과 유지보수성을 극대화하기 위해 역할을 분리하여 폴더를 구성합니다.

```text
frontend/
└── src/
    ├── assets/       # 정적 리소스 (이미지, 폰트, 아이콘 등)
    ├── components/   # 재사용 가능한 UI 컴포넌트 (버튼, 입력창, 모달 등)
    ├── pages/        # 각 화면(라우트)별 최상위 컴포넌트 (Home, Login, Chat 등)
    ├── hooks/        # 커스텀 훅 (재사용 가능한 비즈니스/상태 로직)
    └── utils/        # 공통 유틸리티 함수 (날짜 포맷 변환, 토큰 파싱 등)
```

### 1-1. `components/` (컴포넌트)
- **역할:** 여러 페이지에서 공통으로 사용되는 혹은 특정 도메인에 종속된 UI 조각들을 모아둡니다.
- **예시:** `<Button />`, `<Navbar />`, `<BookItem />`, `<Modal />` 등.
- **특징:** 가능한 한 상태(State)보다는 UI 렌더링에 집중하는 '프리젠테이셔널 컴포넌트'로 설계합니다.

### 1-2. `pages/` (페이지)
- **역할:** 브라우저 주소(URL Route)와 1:1로 매칭되는 최상위 화면 컨테이너입니다.
- **예시:** `LoginPage.jsx`, `HomePage.jsx`, `BookDetailPage.jsx` 등.
- **특징:** 여러 `components/`를 조합하여 하나의 완벽한 화면을 구성합니다. 주로 API를 호출하거나 전역 상태를 관리하는 역할을 겸합니다.

### 1-3. `hooks/` (커스텀 훅)
- **역할:** React의 상태 관리(useState, useEffect)나 API 호출 로직 등을 분리하여 모듈화한 커스텀 함수들입니다.
- **예시:** `useAuth()`, `useFetchBooks()`, `useChat()` 등.
- **특징:** 컴포넌트 내부가 길고 복잡해지는 것을 막아주고, 로직 재사용성을 높여줍니다.

### 1-4. `utils/` (유틸리티)
- **역할:** 애플리케이션 전반에서 자주 쓰이는 순수 자바스크립트 함수(Helper)들을 모아둡니다.
- **예시:** `formatDate()`, `calculateMannerScore()`, `apiClient` (Axios 인스턴스) 등.

---

## 2. 🖥️ Backend (Spring Boot) 구조 개요

Spring Boot 백엔드는 도메인 중심 설계 혹은 계층형 설계를 혼합하여 유지보수가 쉽도록 구성합니다.

```text
backend/
└── src/main/java/com/polbook/api/
    ├── config/       # 전역 설정 파일 (보안, CORS, 웹소켓 등)
    ├── controller/   # 사용자(클라이언트)의 요청을 받고 응답하는 계층
    ├── service/      # 실제 핵심 비즈니스 로직이 실행되는 계층
    ├── repository/   # 데이터베이스와 직접 통신(CRUD)하는 계층 (JPA)
    ├── domain/       # (또는 entity/) 데이터베이스 테이블과 매핑되는 자바 객체
    ├── dto/          # 계층 간(특히 Controller <-> Client) 데이터 전송 전용 객체
    └── exception/    # 사용자 정의 예외 처리 및 글로벌 에러 핸들러
```

### 2-1. `config/` (설정)
- **역할:** Spring 프레임워크나 외부 라이브러리의 동작을 설정하는 클래스들이 위치합니다.
- **예시:** `SecurityConfig` (JWT 인증 및 인가 설정), `WebSocketConfig` (채팅용 소켓), `CorsConfig` 등.

### 2-2. `controller/` (컨트롤러)
- **역할:** 프론트엔드(React)로부터 들어오는 HTTP 요청(GET, POST 등)을 가장 먼저 맞이하는 문지기입니다.
- **특징:** 요청 데이터(DTO)를 검증하고, 알맞은 `service`를 호출한 뒤 결과를 포장해서 다시 프론트엔드로 내려줍니다. 가급적 비즈니스 로직은 작성하지 않습니다.

### 2-3. `service/` (서비스)
- **역할:** 애플리케이션의 뼈대가 되는 **가장 핵심적인 비즈니스 로직**을 수행합니다.
- **예시:** "에스크로 결제 완료 시 -> DB의 책 상태를 'RESERVED'로 변경하고 -> 판매자에게 알림 전송". 이런 일련의 복잡한 흐름을 제어합니다.

### 2-4. `domain/` (또는 `entity/`)
- **역할:** 데이터베이스(MySQL)의 테이블과 직접적으로 1:1 매핑되는 자바 클래스(Entity)들입니다.
- **예시:** `User.java`, `Book.java`, `Location.java` 등.
- **특징:** JPA 어노테이션(`@Entity`, `@Table`)을 사용하여 DB 컬럼과 제약조건을 정의합니다.

### 2-5. `repository/` (레포지토리)
- **역할:** `domain` 객체를 바탕으로 실제 데이터베이스에 접근하여 데이터를 저장, 수정, 삭제, 조회(CRUD)하는 통로(Interface)입니다.
- **특징:** 주로 `JpaRepository`를 상속받아 사용하며, 쿼리문 없이도 메서드 이름만으로 데이터를 조작할 수 있습니다. (예: `findByStudentId(String id)`).

### 2-6. `dto/` (Data Transfer Object)
- **역할:** 데이터를 다른 계층으로 실어 나르기 위한 **단순 데이터 운반용 택배 상자**입니다.
- **이유:** 왜 `domain` 객체를 직접 응답으로 주지 않을까요? `User` 엔티티에는 비밀번호 같은 민감한 정보가 포함되어 있고, 프론트엔드가 요구하는 데이터 형태와 다를 수 있기 때문입니다. 따라서 API 요청/응답 모양새에 딱 맞는 DTO 객체를 따로 만듭니다. 
- **예시 (사용자 로그인 시 응답 객체):**
  ```java
  public class LoginResponseDto {
      private String token;
      private String nickname;
  }
  ```

### 2-7. `exception/` (예외 처리)
- **역할:** 애플리케이션 안에서 발생하는 다양한 에러(예: "존재하지 않는 책입니다", "비밀번호가 틀렸습니다")를 한 곳에서 통일된 JSON 양식으로 포장하여 응답해주는 공간입니다.
- **특징:** 클라이언트가 "무엇이 잘못되었는지" 알기 쉽도록, 커스텀 예외 클래스와 이를 묶어 처리하는 글로벌 예외 핸들러(`@RestControllerAdvice`)를 구성합니다. 보통 **상태 코드와 에러 메시지를 하나로 묶어 관리하는 Enum 클래스(`ErrorCode`)**를 함께 활용하는 것이 실무적인 패턴입니다.
- **예시 (ErrorCode를 활용한 체계적인 에러 처리 구조):**
  
  ```java
  // 1️⃣ 에러 코드 모음 (ErrorCode.java)
  // HTTP 상태 코드와 서비스 고유 에러 메시지를 한 곳에서 관리합니다.
  public enum ErrorCode {
      USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다."),
      BOOK_NOT_FOUND(HttpStatus.NOT_FOUND, "요청하신 책 정보가 존재하지 않습니다."),
      INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다.");

      private final HttpStatus status;
      private final String message;
      // 생성자와 Getter 생략
  }

  // 2️⃣ 커스텀 예외 클래스 (CustomException.java)
  // 비즈니스 로직에서 에러를 던질 때(throw) 사용합니다.
  public class CustomException extends RuntimeException {
      private final ErrorCode errorCode;

      public CustomException(ErrorCode errorCode) {
          super(errorCode.getMessage());
          this.errorCode = errorCode;
      }
      public ErrorCode getErrorCode() { return errorCode; }
  }

  // 3️⃣ 글로벌 핸들러 (GlobalExceptionHandler.java)
  // 컨트롤러나 서비스에서 CustomException이 던져지면 이곳에서 낚아채어 JSON으로 반환합니다.
  @RestControllerAdvice
  public class GlobalExceptionHandler {
      @ExceptionHandler(CustomException.class)
      public ResponseEntity<ErrorResponseDto> handleCustomException(CustomException ex) {
          ErrorCode errorCode = ex.getErrorCode();
          
          return ResponseEntity.status(errorCode.getStatus())
                  .body(new ErrorResponseDto(errorCode.name(), errorCode.getMessage()));
      }
  }
  ```

