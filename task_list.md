# Polbook 프로젝트 Task List

이 문서는 교내 중고 책 거래 서비스 `Polbook`의 전체적인 개발 진행 상황을 추적하기 위한 체크리스트입니다.

---

## 1. 📝 기획 및 설계 (Planning & Design)
- [x] 서비스 핵심 요구사항 정의 (`README.md` 작성)
- [x] 인증 방식 및 기술 스택 선정
- [x] 사용자(판매자, 구매자) 및 관리자 핵심 이용 시나리오 작성 (`user_scenarios.md`)
- [x] 데이터베이스 ERD (Entity Relationship Diagram) 상세 설계 (`erd_design.md` 초안 작성 완료, 리뷰 중)
  - [x] Users, Books, BookImages, Locations, Reviews, Reports 테이블 스키마 구체화
  - [x] Wishlists(찜), ChatRooms/ChatMessages(채팅), Payments(결제), Settlements(정산) 테이블 스키마 구체화
  - [x] 테이블 간의 관계 (1:N, N:M 등) 매핑 + Mermaid 다이어그램
- [x] UI/UX 디자인 및 화면 설계 (`ui_ux_design.md` 와이어프레임 작성 완료)
  - [x] 로그인 / 회원가입 화면
  - [x] 메인 홈 화면 (책 목록, 검색/필터, 판매 책 등록 직행 버튼)
  - [x] 책 상세 조회 및 상태 변경 화면
  - [x] 새로운 책 등록 화면
  - [x] 채팅 및 거래 장소 약속 화면
  - [x] 마이페이지 (내 정보, 평점, 찜목록)
- [x] API 명세서 작성 (`api_spec.md` RESTful Endpoint 기획 완료)

## 2. ⚙️ 프로젝트 초기 세팅 (Project Setup)
- [x] 깃허브 레포지토리(Repository) 생성 및 폴더 구조 세팅
- [x] Frontend (React.js / React Native) 초기 보일러플레이트 세팅
  - [x] 폴더 아키텍처 (components, pages, utils, hooks 등) 구성
  - [x] 라우팅(React Router) 세팅
  - [x] 전역 상태 관리(Redux, Zustand 등) 또는 라이브러리 설치
- [x] Backend (Spring Boot) 초기 프로젝트 생성
  - [x] Spring Web, Spring Data JPA, MySQL Driver 등 의존성 추가
  - [x] 디렉터리 구조(Controller, Service, Repository, Entity 등) 세팅
- [x] Database (MySQL) 로컬 환경 설치 및 스키마 초기화 테스트

## 3. 🖥️ 핵심 기능(API 및 화면) 개발 (Execution)

### 3-1. 이메일 인증 기능 (교내 웹메일 연동)
- [x] 백엔드: `EmailVerification` 엔티티 및 `email_verifications` 테이블 설계
- [x] 백엔드: `EmailService` — Mock 모드 인증 코드 생성/검증 로직 구현
- [x] 백엔드: `AuthController` — `POST /api/auth/email/send`, `/api/auth/email/verify` API 구현
- [x] 백엔드: API 테스트 완료 (curl 기반 정상 동작 확인)
- [x] 프론트엔드: 회원가입 화면에 학번 입력 → "인증 메일 전송" 버튼 UI 구현
- [x] 프론트엔드: 인증 코드 6자리 입력 필드 + "인증 확인" 버튼 연동
- [ ] 추후: Mock → AWS SES 실제 이메일 발송으로 전환

### 3-2. JWT 기반 회원가입 및 로그인 (Access / Refresh Token)
- [x] 백엔드: `User` 엔티티 및 `Users` 테이블 생성 (ERD 기반)
- [x] 백엔드: Spring Security + JWT 의존성 추가 및 설정
- [x] 백엔드: `JwtTokenProvider` — Access Token / Refresh Token 발급/검증 유틸 구현
- [x] 백엔드: `AuthController` — `POST /api/auth/signup`, `POST /api/auth/login` API 구현
- [x] 백엔드: Refresh Token 저장소(`RefreshToken` 엔티티) 및 로직 구현
- [ ] 백엔드: 비밀번호 재설정 `POST /api/auth/password/reset` API 구현
- [x] 백엔드: JWT 인증 필터(Filter) 적용 — 보호된 엔드포인트 접근 제어
- [x] 프론트엔드: 회원가입 폼 (학번, 비밀번호, 닉네임, 이메일 인증 토큰) 연동
- [x] 프론트엔드: 로그인 폼 및 토큰 저장 (LocalStorage / Cookie) 처리
- [x] 프론트엔드: 자동 로그인 및 Access Token 만료 시 Refresh Token 갱신 로직 (Axios Interceptor)

### 3-3. 중고 서적 CRUD (사진 업로드 포함)
- [ ] 백엔드: `Book`, `BookImage` 엔티티 생성 (ERD 기반)
- [ ] 백엔드: `BookController` — 목록 조회, 상세 조회, 등록, 수정, 삭제 API 구현
- [ ] 백엔드: 이미지 업로드 처리 (개발 단계: 로컬 파일 저장 / 운영 단계: AWS S3)
- [ ] 백엔드: 거래 상태 변경 `PATCH /api/books/{bookId}/status` API 구현
- [ ] 프론트엔드: 책 목록(홈) 화면 — 카드형 리스트 UI 및 페이지네이션
- [ ] 프론트엔드: 책 상세 조회 화면 — 이미지 슬라이더, 판매자 정보, 상태 표시
- [ ] 프론트엔드: 새 책 등록 화면 — 폼 입력 + 다중 이미지 업로드 UI
- [ ] 프론트엔드: 책 수정/삭제 기능 연동

### 3-4. 도서 검색 및 필터링 기능
- [ ] 백엔드: 검색 쿼리 파라미터 처리 — 제목/강의명/교수명 검색
- [ ] 백엔드: 필터링 — 카테고리(전공/교양/자격증), 거래 상태, 학과별 조회
- [ ] 백엔드: 정렬 옵션 — 최신순, 가격순, 조회수순
- [ ] 프론트엔드: 검색바 + 필터 드롭다운 UI 구현
- [ ] 프론트엔드: 검색 결과 목록 화면 연동

### 3-5. 에스크로 결제 연동 및 거래 상태 변경
- [ ] 백엔드: `Payment`, `Settlement` 엔티티 생성 (ERD 기반)
- [ ] 백엔드: `POST /api/payments/ready` — 결제 준비 (주문 UID 생성) API
- [ ] 백엔드: `POST /api/payments/complete` — PG사 결제 완료 웹훅 처리
- [ ] 백엔드: `POST /api/payments/settle` — 구매 확정 (에스크로 정산) API
- [ ] 백엔드: PG사 연동 (PortOne / Toss Payments 등) 설정
- [ ] 프론트엔드: 결제 버튼 → PG 결제창 호출 → 결과 처리 흐름
- [ ] 프론트엔드: 구매 확정 버튼 UI 및 상태 반영

### 3-6. 1:1 실시간 채팅 기능 (WebSocket / STOMP)
- [ ] 백엔드: `ChatRoom`, `ChatMessage` 엔티티 생성 (ERD 기반)
- [ ] 백엔드: WebSocket(STOMP) 설정 — `/ws/chat` 엔드포인트
- [ ] 백엔드: `POST /api/chats` — 채팅방 생성 REST API
- [ ] 백엔드: `GET /api/chats` — 내 채팅방 목록 조회 API
- [ ] 백엔드: `GET /api/chats/{roomId}/messages` — 이전 메시지 조회 API
- [ ] 백엔드: 읽음 처리 로직 구현 (`chat_read_logic.md` 참고)
- [ ] 프론트엔드: 채팅방 목록 화면 — 최근 메시지, 읽지 않은 개수 표시
- [ ] 프론트엔드: 채팅방 화면 — 실시간 메시지 송수신 UI
- [ ] 프론트엔드: WebSocket 연결 관리 (연결/재연결/해제)

### 3-7. 매너 온도(평점) 및 리뷰 작성 기능
- [ ] 백엔드: `Review` 엔티티 생성 (ERD 기반)
- [ ] 백엔드: `POST /api/reviews` — 리뷰 작성 API (거래 완료 후 작성 가능)
- [ ] 백엔드: 매너 온도 자동 계산 로직 (리뷰 점수 기반 Users.manner_score 갱신)
- [ ] 프론트엔드: 거래 완료 후 리뷰 작성 모달/화면 UI
- [ ] 프론트엔드: 마이페이지 — 받은 리뷰 목록 및 매너 온도 표시

### 3-8. 악성 유저 신고 접수 및 알림 기능
- [ ] 백엔드: `Report` 엔티티 생성 (ERD 기반)
- [ ] 백엔드: `POST /api/reports` — 신고 접수 API (사유 ENUM 처리)
- [ ] 백엔드: 관리자(ADMIN) 신고 조회/처리 API
- [ ] 백엔드: 이용 정지 처리 로직 (Users.is_suspended, suspended_until 갱신)
- [ ] 프론트엔드: 게시글/사용자 신고 버튼 및 사유 선택 모달 UI
- [ ] 프론트엔드: 관리자 페이지 — 신고 목록 조회 및 처리 기능

### 3-9. 찜하기 기능
- [ ] 백엔드: `Wishlist` 엔티티 생성 (ERD 기반)
- [ ] 백엔드: `POST /api/books/{bookId}/wish` — 찜 토글 API
- [ ] 백엔드: `GET /api/users/me/wishlists` — 내 찜 목록 조회 API
- [ ] 프론트엔드: 책 상세/목록 화면에 ❤️ 찜 버튼 토글 UI
- [ ] 프론트엔드: 마이페이지 — 찜 목록 화면 연동

### 3-10. 사용자 프로필 (마이페이지)
- [ ] 백엔드: `GET /api/users/me`, `PUT /api/users/me` — 내 프로필 조회/수정 API
- [ ] 백엔드: `GET /api/users/{userId}` — 타인 프로필 조회 API
- [ ] 프론트엔드: 마이페이지 종합 화면 (프로필, 매너 온도, 판매 내역, 찜 목록)
- [ ] 프론트엔드: 프로필 수정 화면 (닉네임, 프로필 사진 변경)

## 4. 🚀 인프라 배포 및 테스트 (Verification & Deployment)
- [ ] AWS EC2 서버에 Spring Boot 애플리케이션 배포
  - [ ] EC2 인스턴스 생성 및 보안 그룹 설정
  - [ ] Docker 기반 또는 JAR 직접 배포 방식 결정 및 적용
- [ ] AWS RDS(MySQL) 연결 및 데이터 마이그레이션 적용
  - [ ] RDS 인스턴스 생성 및 로컬 스키마 마이그레이션
  - [ ] `application.yml` 운영 환경 프로필 분리 (dev / prod)
- [ ] Mock 이메일 → AWS SES 실제 발송 전환
  - [ ] SES 도메인 인증 및 샌드박스 해제
  - [ ] `polbook.mail.mock=false` 설정 전환
- [ ] Frontend 빌드 및 호스팅 (Vercel, Netlify, 혹은 S3+CloudFront)
  - [ ] 빌드 스크립트 최적화 및 환경 변수 설정
  - [ ] API Base URL 운영 환경용으로 전환
- [ ] 실사용 테스트 및 QA (모의 거래 및 알림 수신 테스트)
  - [ ] 전체 사용자 시나리오 기반 E2E 테스트
  - [ ] 성능 테스트 및 에러 핸들링 점검
- [ ] 최종 런칭 준비
  - [ ] HTTPS(SSL 인증서) 적용
  - [ ] 도메인 연결 (`polbook.kopo.ac.kr`)
  - [ ] 운영 모니터링 (로그 수집, 에러 알림) 세팅
