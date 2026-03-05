# 💬 채팅 메시지 읽음 확인 로직

이 문서는 Polbook의 1:1 채팅(구매자 ↔ 판매자)에서 **메시지 읽음 여부(`is_read`)**가 어떻게 동작하는지 설명합니다.

---

## 기본 원리

채팅방은 구매자와 판매자 **2명만 참여**하는 1:1 구조이므로, `ChatMessages` 테이블의 `is_read` (BOOLEAN) 컬럼 하나로 읽음 상태를 관리할 수 있습니다.

- 메시지를 **보낸 사람** → 본인이 보냈으므로 읽음 확인 불필요
- 메시지를 **받는 사람** → 채팅방에 접속하면 읽음 처리

---

## 동작 흐름

### 1단계: 메시지 전송 시
메시지가 DB에 저장될 때 `is_read = FALSE` (기본값)로 들어갑니다.

```sql
INSERT INTO chat_messages (room_id, sender_id, content, is_read, sent_at)
VALUES (?, ?, '안녕하세요, 책 상태 어떤가요?', FALSE, NOW());
```

### 2단계: 상대방이 채팅방에 입장할 때
상대방이 해당 채팅방 화면을 열면, 백엔드에서 아래 쿼리가 자동 실행됩니다.

```sql
-- "이 채팅방에서 내가 보내지 않은 메시지 중 아직 안 읽은 것"을 모두 읽음 처리
UPDATE chat_messages 
SET is_read = TRUE 
WHERE room_id = :roomId 
  AND sender_id != :currentUserId
  AND is_read = FALSE;
```

### 3단계: 실시간 읽음 반영 (WebSocket)
상대방이 메시지를 읽는 순간, WebSocket을 통해 보낸 사람의 화면에도 **읽음 표시**가 실시간으로 반영됩니다.

> 카카오톡에서 전송한 메시지 옆의 숫자 `1`이 사라지는 것과 동일한 원리입니다.

---

## 안 읽은 메시지 개수 (배지 표시)

채팅 목록 화면에서 각 채팅방별 **안 읽은 메시지 수**를 배지로 표시할 때:

```sql
SELECT COUNT(*) 
FROM chat_messages 
WHERE room_id = :roomId 
  AND sender_id != :currentUserId 
  AND is_read = FALSE;
```

---

## 왜 `is_read` BOOLEAN 하나로 충분한가?

| 채팅 유형 | 참여자 수 | 읽음 관리 방식 |
|---|---|---|
| **1:1 채팅 (Polbook)** | 2명 | `is_read` BOOLEAN 1개로 충분 ✅ |
| 그룹 채팅 (3명 이상) | N명 | 별도 `MessageReadStatus` 테이블 필요 (누가 언제 읽었는지 N개 행) |

Polbook은 구매자-판매자 1:1 구조이므로, 현재 ERD 설계의 `is_read` BOOLEAN이 최적입니다.
