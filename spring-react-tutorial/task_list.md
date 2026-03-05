# 🚀 미니 게시판 (Spring-React) 튜토리얼: Task List

이 문서는 기초적인 **Spring Boot ↔ React 통신 튜토리얼**을 완성하기 위해 필요한 개발 단계를 순서대로 정리한 체크리스트입니다.

---

## 1. ⚙️ 프로젝트 준비 및 세팅 (Setup)
- [ ] 튜토리얼용 임시 디렉터리(`spring-react-tutorial`) 준비 (완료)
- [x] Backend: Spring Boot 초기 프로젝트 생성 (Spring Initializr 활용)
  - [x] 의존성 추가: `Spring Web`, `Spring Data JPA`, `MySQL Driver`, `H2 Database` (테스트용)
- [x] Frontend: React 초기 프로젝트 생성 (Create React App 또는 Vite 사용)
  - [x] React 서버 실행 포트 설정 (예: `localhost:3000`)
- [x] Database: 로컬 환경 DB 구성 (튜토리얼은 `H2 Database` 메모리 DB로 대체 진행)

## 2. 🖥️ Backend (Spring Boot) 개발
- [x] `application.properties` (또는 `yml`)에 MySQL 접속 정보 및 JPA 설정 작성
- [x] `Book.java` (Entity) 클래스 작성 (id, title, price 속성)
- [x] `BookRepository.java` (인터페이스) 생성
- [x] `BookService.java` 비즈니스 로직(저장, 전체 조회) 구현
- [x] `BookController.java` REST API 설계
  - [x] `GET /api/books`: 모든 책 목록 반환 로직 연동
  - [x] `POST /api/books`: 새로운 책 데이터 DB 저장 로직 연동
- [x] CORS 설정 추가 (React `localhost:5173`에서 오는 요청 허용)
- [x] 포스트맨(Postman) 혹은 브라우저로 API 정상 작동 테스트

## 3. 🎨 Frontend (React) 개발
- [x] 기존 보일러플레이트 화면 걸어내기 (`App.jsx` 비우기)
- [x] 핵심 컴포넌트 구성: 입력 폼, 책 목록
- [x] `useState`를 이용해 입력 폼(제목, 가격) 및 책 목록(배열) 관리 상태 추가
- [x] `useEffect`를 활용하여 컴포넌트 마운트 시 최초 1회 `GET /api/books` 데이터 불러오기
- [x] 입력 폼의 [등록하기] 버튼 클릭 시 `POST /api/books`로 `fetch` 통신 함수 구현
- [x] 등록 통신 성공 직후, 화면 새로고침 없이 `GET` 함수를 재호출하여 목록 즉시 갱신 (Refetch) 로직 작성
- [ ] (선택) CSS 모듈이나 간단한 인라인 스타일로 화면 깔끔하게 다듬기

## 4. 🧩 최종 연동 및 확인
- [x] Spring Boot 서버(`8080` 포트)와 React 개발 서버(`5173` 포트) 동시 실행
- [ ] React 화면에서 직접 책 데이터를 입력하고 [등록] 버튼 클릭
- [ ] 하단 목록에 즉시 추가되는 컴포넌트 렌더링 확인
- [ ] 터미널 Hibernate 로그에서 실제 `INSERT` 쿼리가 MySQL로 날아가는지 확인
- [ ] MySQL Workbench(또는 터미널)에서 `SELECT * FROM book;`으로 데이터 적재 최종 확인
