package com.polbook.api.repository;

import com.polbook.api.entity.ChatMessage;
import com.polbook.api.entity.ChatRoom;
import com.polbook.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // 특정 채팅방의 메시지 내역 최신순 조회 (페이징 지원)
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom, Pageable pageable);

    // 안 읽은 메시지 수 카운트 (내가 보내지 않은 메시지 중 isRead=false인 것)
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.chatRoom = :room AND m.sender != :user AND m.isRead = false")
    int countUnreadMessages(@Param("room") ChatRoom room, @Param("user") User user);

    // 채팅방 입장 시 상대방이 보낸 메시지 일괄 읽음 처리
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chatRoom = :room AND m.sender != :user AND m.isRead = false")
    int markAllAsRead(@Param("room") ChatRoom room, @Param("user") User user);
}
