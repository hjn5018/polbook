# 🚀 미니 게시판 (Spring Boot + React) 튜토리얼 기획안

본 프로젝트는 본격적인 교내 중고 책 거래 서비스(`Polbook`) 개발에 앞서, **Spring Boot(백엔드)와 React(프론트엔드)의 연동 로직을 실습하고 검증하기 위한 초소형 미니 게시판 튜토리얼**입니다.

---

## 1. 프로젝트 목적
*   **프론트엔드 ↔ 백엔드 통신(API 연동) 흐름 파악:** React 컴포넌트에서 입력한 데이터가 Spring Boot 서버를 거쳐 MySQL 데이터베이스에 어떻게 저장되고, 다시 화면으로 어떻게 불려 나오는지(Life Cycle)를 직접 구현하며 완벽히 이해합니다.
*   **기술 스택 워밍업:** 향후 Polbook 본 프로젝트에서 다루게 될 폴더 구조, 어노테이션(`@RestController`, `@Service`, `@Entity`), JSX 문법 등에 익숙해지는 것을 목표로 합니다.

## 2. 핵심 기능 요구사항 (초소형 명세)
본 튜토리얼은 회원가입, 로그인 등의 복잡한 인증 절차 없이 **누구나 익명으로 게시글을 쓰고 볼 수 있는 가장 원초적인 형태**로 제한합니다.

1.  **게시글(책) 목록 조회 (GET)**
    *   화면에 접속하면 DB에 저장되어 있는 모든 책 제목과 가격 목록을 리스트 형태로 최신순 혹은 등록순으로 나열하여 보여줍니다.
2.  **새로운 게시글(책) 등록 (POST)**
    *   화면 폼에 `책 제목(title)`과 `가격(price)`을 입력하고 [등록하기] 버튼을 누르면 서버로 데이터가 전송되어 DB에 새 객체가 추가됩니다.
    *   등록 성공 시 화면이 새로고침되거나 동적으로 목록이 갱신되어, 방금 등록한 책이 목록에 즉시 나타납니다.

## 3. 화면(UI) 설계 초안
- 한 화면(`App.js`) 안에서 모든 동작이 이루어지는 원페이지 웹 애플리케이션(SPA)
- **[상단] 책 등록 영역:** 
  - 텍스트 입력 칸 2개 (책 제목, 가격)
  - [등록하기] 버튼
- **[하단] 책 목록 영역:** 
  - 등록된 책들이 줄무늬 리스트업 된 게시판 뷰 (예: `- [책 제목] / [가격]원`)

## 4. 데이터베이스(테이블) 모델링
본 프로젝트는 단 한 개의 아주 심플한 테이블만 유지합니다.

* `Book` 테이블
  - `id` (Primary Key, 자동 증가 정수)
  - `title` (문자열, 책 제목)
  - `price` (정수형, 책 가격)

---

## 5. 사전 요구사항 (Prerequisites)
아래 프로그램들이 PC에 설치되어 있어야 합니다.

| 도구 | 버전 | 다운로드 |
|---|---|---|
| **JDK** | 17 이상 | [Adoptium Temurin 17](https://adoptium.net) |
| **Node.js** | 18 이상 (LTS) | [Node.js 공식](https://nodejs.org) |
| **Git** | 최신 | [Git 공식](https://git-scm.com) |

## 6. 프로젝트 구성에 사용한 명령어

### Backend (Spring Boot)
```bash
# Spring Initializr에서 프로젝트 뼈대를 다운로드 (의존성: Web, JPA, MySQL, H2)
mkdir -p backend && cd backend
curl -s https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,mysql,h2 \
  -d name=backend \
  -d type=gradle-project \
  -d javaVersion=17 \
  -o backend.zip && unzip backend.zip && rm backend.zip
```

### Frontend (React + Vite)
```bash
# Vite 기반 React 프로젝트 생성
npx -y create-vite@5 frontend --template react

# 생성된 프로젝트의 의존성(라이브러리) 설치
cd frontend
npm install
```

## 7. 실행 방법

### Backend 서버 실행 (포트 8080)
```bash
cd backend
./gradlew.bat bootRun     # Windows
# ./gradlew bootRun       # Mac/Linux
```
> 실행 후 `http://localhost:8080/api/books` 에 접속하면 JSON 응답 확인 가능

### Frontend 개발 서버 실행 (포트 5173)
```bash
cd frontend
npm run dev
```
> 실행 후 `http://localhost:5173` 에 접속하면 미니 게시판 화면 확인 가능

### ⚠️ 주의사항
- **두 서버를 동시에 실행**해야 프론트-백 통신이 정상 작동합니다.
- 각각 별도의 터미널 창에서 실행하세요.

## 8. 테스트 방법

### Backend 자동화 테스트 실행
```bash
cd backend
./gradlew.bat test        # Windows
# ./gradlew test          # Mac/Linux
```

### 테스트 항목 (총 6개)

| 테스트 클래스 | 테스트 내용 | 검증 대상 |
|---|---|---|
| `BackendApplicationTests` | 앱 정상 구동 확인 | Spring Boot 전체 |
| `BookRepositoryTest` | 새 책 DB 저장 및 조회 | Repository 계층 |
| `BookRepositoryTest` | 여러 권 저장 후 전체 조회 | Repository 계층 |
| `BookControllerTest` | POST /api/books 등록 API | Controller 전체 흐름 |
| `BookControllerTest` | GET /api/books 목록 조회 | Controller 전체 흐름 |
| `BookControllerTest` | 빈 DB일 때 빈 배열 반환 | Controller 전체 흐름 |

### H2 DB 콘솔 접속 (개발 중 DB 직접 확인)
백엔드 서버 실행 중 `http://localhost:8080/h2-console` 접속 후:
- JDBC URL: `jdbc:h2:mem:polbook_tutorial`
- User: `sa` / Password: (빈칸)

## 9. 기술 스택

| 구분 | 기술 | 버전 |
|---|---|---|
| Backend | Spring Boot | 4.0.3 |
| Backend ORM | Spring Data JPA (Hibernate) | - |
| Backend DB | H2 Database (메모리) | - |
| Backend Build | Gradle | 9.3.1 |
| Frontend | React | 18.x |
| Frontend Build | Vite | 5.x |
| 언어 | Java 17, JavaScript (ES6+) | - |
