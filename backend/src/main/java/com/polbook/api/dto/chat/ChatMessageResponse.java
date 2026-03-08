package com.polbook.api.dto.chat;

import com.polbook.api.entity.ChatMessage;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageResponse {
    private Long messageId;
    private Long roomId;
    private Long senderId;
    private String senderNickname;
    private String content;
    private ChatMessage.MessageType messageType;
    private LocalDateTime createdAt;
    private boolean isRead;
}
