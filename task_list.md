# Polbook 프로젝트 Task List

이 문서는 교내 중고 책 거래 서비스 `Polbook`의 전체적인 개발 진행 상황을 추적하기 위한 체크리스트입니다.

---

## 1. 📝 기획 및 설계 (Planning & Design)
- [x] 서비스 핵심 요구사항 정의 (`README.md` 작성)
- [x] 인증 방식 및 기술 스택 선정
- [x] 사용자(판매자, 구매자) 및 관리자 핵심 이용 시나리오 작성 (`user_scenarios.md`)
- [/] 데이터베이스 ERD (Entity Relationship Diagram) 상세 설계 (`erd_design.md` 초안 작성 완료, 리뷰 중)
  - [x] Users, Books, BookImages, Locations, Reviews, Reports 테이블 스키마 구체화
  - [x] Wishlists(찜), ChatRooms/ChatMessages(채팅), Payments(결제), Settlements(정산) 테이블 스키마 구체화
  - [x] 테이블 간의 관계 (1:N, N:M 등) 매핑 + Mermaid 다이어그램
- [ ] UI/UX 디자인 및 화면 설계 (Wireframing 예상)
  - [ ] 로그인 / 회원가입 화면
  - [ ] 메인 홈 화면 (책 목록, 검색/필터, 판매 책 등록 직행 버튼)
  - [ ] 책 상세 조회 및 상태 변경 화면
  - [ ] 새로운 책 등록 화면
  - [ ] 채팅 및 거래 장소 약속 화면
  - [ ] 마이페이지 (내 정보, 평점, 찜목록)
- [ ] API 명세서 작성 (RESTful API Endpoint 기획)

## 2. ⚙️ 프로젝트 초기 세팅 (Project Setup)
- [ ] 깃허브 레포지토리(Repository) 생성 및 폴더 구조 세팅
- [ ] Frontend (React.js / React Native) 초기 보일러플레이트 세팅
  - [ ] 폴더 아키텍처 (components, pages, utils, hooks 등) 구성
  - [ ] 라우팅(React Router) 세팅
  - [ ] 전역 상태 관리(Redux, Zustand 등) 또는 라이브러리 설치
- [ ] Backend (Spring Boot) 초기 프로젝트 생성
  - [ ] Spring Web, Spring Data JPA, MySQL Driver 등 의존성 추가
  - [ ] 디렉터리 구조(Controller, Service, Repository, Entity 등) 세팅
- [ ] Database (MySQL) 로컬 환경 설치 및 스키마 초기화 테스트

## 3. 🖥️ 핵심 기능(API 및 화면) 개발 (Execution)
- [ ] 이메일 인증 기능 (교내 웹메일 연동)
- [ ] JWT 기반 회원가입 및 로그인 (Access / Refresh Token) 로직
- [ ] 중고 서적 CRUD (사진 업로드 포함 - AWS S3 혹은 자체 서버 스토어)
- [ ] 도서 검색 및 필터링 기능 (전공/교양, 상태별, 학과별 조회)
- [ ] 에스크로 결제 연동 및 거래 상태 변경 로직 구현
- [ ] 1:1 실시간 채팅 기능 (WebSocket / Stomp 등 활용)
- [ ] 매너 온도(평점) 및 리뷰 작성 기능
- [ ] 악성 유저 신고 접수 및 알림 기능

## 4. 🚀 인프라 배포 및 테스트 (Verification & Deployment)
- [ ] AWS EC2 서버에 Spring Boot 애플리케이션 배포
- [ ] AWS RDS(MySQL) 연결 및 데이터 마이그레이션 적용
- [ ] Frontend 빌드 및 호스팅 (Vercel, Netlify, 혹은 S3+CloudFront)
- [ ] 실사용 테스트 및 QA (모의 거래 및 알림 수신 테스트)
- [ ] 최종 런칭 준비
