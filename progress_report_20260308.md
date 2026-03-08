# 📋 Polbook 개발 진행 리포트 (2026-03-08)

이 문서는 2026년 3월 8일 진행된 작업 내용과 다음 단계의 가이드를 포함합니다.

## ✅ 오늘 완료된 작업

### 1. 찜하기(Wishlist) 및 사용자 프로필(MyPage) 완성
- **백엔드**: `Wishlist` 엔티티 및 토글 API, 상태 조회 API 구현. `User` 엔티티 수정 및 프로필 업데이트 API 구현.
- **프론트엔드**: `BookDetailPage` 내 하트 아이콘 연동, `MyPage` 통합 화면(내 판매글/찜목록 탭, 매너 점수, 프로필 수정) 구현.

### 2. 실시간 채팅(1:1 Chat) 백엔드 구현
- **엔티티 설계**: `ChatRoom`(방 관리), `ChatMessage`(메시지 기록) 엔티티 및 JPA Repository 생성.
- **인프라 설정**: Spring Boot WebSocket 및 STOMP 메시지 브로커 설정 (`/ws/chat` 엔드포인트).
- **API 연동**: 채팅방 생성/목록 조회/이전 메시지 조회 REST API와 실시간 메시지 수신 핸들러 구현.

### 3. 개발 편의성 개선
- **자동 실행 화이트리스트**: `.agent/rules/command_whitelist.md`를 생성하여 `git status` 등 안전한 명령어를 승인 없이 실행 가능하도록 설정.
- **저장소 동기화**: `task_list.md` 최신화 및 모든 소스 코드 `main` 브랜치에 Push 완료.

---

## 🚀 다음 작업 예정 (Next Step)

### 3-7. 실시간 채팅 프론트엔드 연동 (핵심)
1. **라이브러리 설치**: `npm install @stomp/stompjs sockjs-client`
2. **서비스 개발**: `chatService.ts` 작성 (채팅방 API 및 소켓 연결 관리)
3. **UI 구현**: 
   - `ChatListPage`: 참여 중인 채팅방 목록 (상대방 닉네임, 마지막 메시지 요약 표시)
   - `ChatRoomPage`: 실시간 메시지 송수신 레이아웃 및 스크롤 관리

### 3-8. 에스크로 결제 연동
- PortOne 등 PG사 연동 및 결제 상태(READY, PAID, SETTLED) 관리 시스템 구축.

---

## 🛠️ 기술적 참고 사항 (Current State)
- **Backend Port**: 8080 (H2 Database 사용 중)
- **Frontend Port**: 5173 (Vite)
- **핵심 엔드포인트**:
  - `POST /api/chats/rooms`: 채팅방 시작
  - `GET /api/chats/rooms`: 대화 목록
  - `WS /ws/chat`: 실시간 소켓 연결

---
*보고서 작성 일자: 2026-03-08*
