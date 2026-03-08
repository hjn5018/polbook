package com.polbook.api.repository;

import com.polbook.api.entity.ChatRoom;
import com.polbook.api.entity.User;
import com.polbook.api.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // 내가 참여 중인 모든 채팅방 최신순 조회 (구매자 혹은 판매자로 참여)
    @Query("SELECT r FROM ChatRoom r WHERE r.buyer = :user OR r.seller = :user ORDER BY r.lastMessageAt DESC")
    List<ChatRoom> findAllMyChatRooms(@Param("user") User user);

    // 특정 도서에 대해 이미 구매자와 판매자 간의 채팅방이 존재하는지 확인
    Optional<ChatRoom> findByBookAndBuyerAndSeller(Book book, User buyer, User seller);
}
