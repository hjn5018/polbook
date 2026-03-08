package com.polbook.api.dto.chat;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomResponse {
    private Long roomId;
    private Long bookId;
    private String bookTitle;
    private String bookImageUrl;

    // 상대방 정보
    private Long partnerId;
    private String partnerNickname;
    private String partnerProfileImage;
    private Double partnerMannerScore;

    // 마지막 메시지 요약
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private int unreadCount; // 안 읽은 메시지 수
}
