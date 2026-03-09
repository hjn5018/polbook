package com.polbook.api.controller;

import com.polbook.api.dto.chat.ChatMessageResponse;
import com.polbook.api.dto.chat.ChatRoomResponse;
import com.polbook.api.entity.ChatMessage;
import com.polbook.api.security.CustomUserDetails;
import com.polbook.api.service.ChatService;
import com.polbook.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    // 1. 실시간 메시지 전송 (STOMP: /app/chat/{roomId})
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId, @Payload Map<String, Object> payload) {
        // 프론트엔드에서 senderId와 content를 payload로 보낸다고 가정
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        String content = (String) payload.get("content");
        ChatMessage.MessageType type = ChatMessage.MessageType.valueOf((String) payload.get("messageType"));

        chatService.sendMessage(roomId, senderId, content, type);
    }

    // 2. 채팅방 생성 (이미 있으면 해당 방 ID 반환)
    @PostMapping("/rooms")
    public ResponseEntity<Long> createRoom(
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long bookId = request.get("bookId");
        return ResponseEntity.ok(chatService.getOrCreateRoom(bookId, userDetails.getUser().getUserId()));
    }

    // 3. 내 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getMyRooms(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(chatService.getMyRooms(userDetails.getUser()));
    }

    // 4. 이전 메시지 내역 조회
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(chatService.getMessages(roomId, page, size));
    }

    // 5. 채팅방 읽음 처리 (입장 시 호출)
    @PostMapping("/rooms/{roomId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        chatService.markAsRead(roomId, userDetails.getUser());
        return ResponseEntity.ok().build();
    }
}
