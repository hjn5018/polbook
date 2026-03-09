package com.polbook.api.service;

import com.polbook.api.dto.chat.ChatMessageResponse;
import com.polbook.api.dto.chat.ChatRoomResponse;
import com.polbook.api.entity.Book;
import com.polbook.api.entity.ChatMessage;
import com.polbook.api.entity.ChatRoom;
import com.polbook.api.entity.User;
import com.polbook.api.repository.BookRepository;
import com.polbook.api.repository.ChatMessageRepository;
import com.polbook.api.repository.ChatRoomRepository;
import com.polbook.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

        private final ChatRoomRepository chatRoomRepository;
        private final ChatMessageRepository chatMessageRepository;
        private final BookRepository bookRepository;
        private final UserRepository userRepository;
        private final SimpMessageSendingOperations messagingTemplate;

        // 채팅방 생성 또는 기존 방 조회
        @Transactional
        public Long getOrCreateRoom(Long bookId, Long buyerId) {
                Book book = bookRepository.findById(bookId)
                                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));
                User buyer = userRepository.findById(buyerId)
                                .orElseThrow(() -> new IllegalArgumentException("구매자를 찾을 수 없습니다."));
                User seller = book.getSeller();

                if (buyer.getUserId().equals(seller.getUserId())) {
                        throw new IllegalArgumentException("자신의 상품에는 채팅을 할 수 없습니다.");
                }

                // 이미 생성된 방이 있는지 확인
                return chatRoomRepository.findByBookAndBuyerAndSeller(book, buyer, seller)
                                .map(ChatRoom::getRoomId)
                                .orElseGet(() -> {
                                        ChatRoom newRoom = ChatRoom.builder()
                                                        .book(book)
                                                        .buyer(buyer)
                                                        .seller(seller)
                                                        .lastMessage("새 대화가 시작되었습니다.")
                                                        .build();
                                        return chatRoomRepository.save(newRoom).getRoomId();
                                });
        }

        // 내 채팅방 목록 조회
        public List<ChatRoomResponse> getMyRooms(User user) {
                return chatRoomRepository.findAllMyChatRooms(user).stream()
                                .map(room -> convertToRoomResponse(room, user))
                                .collect(Collectors.toList());
        }

        // 실시간 메시지 처리
        @Transactional
        public void sendMessage(Long roomId, Long senderId, String content, ChatMessage.MessageType type) {
                ChatRoom room = chatRoomRepository.findById(roomId)
                                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));
                User sender = userRepository.findById(senderId)
                                .orElseThrow(() -> new IllegalArgumentException("발신자를 찾을 수 없습니다."));

                ChatMessage message = ChatMessage.builder()
                                .chatRoom(room)
                                .sender(sender)
                                .content(content)
                                .messageType(type)
                                .build();

                chatMessageRepository.save(message);

                // 마지막 메시지 업데이트
                room.setLastMessage(content);
                room.setLastMessageAt(LocalDateTime.now());

                // 실시간 브로드캐스팅 (STOMP) - /topic/chat/{roomId} 를 구독 중인 리스너에게 전달
                messagingTemplate.convertAndSend("/topic/chat/" + roomId, convertToMessageResponse(message));
        }

        // 이전 메시지 내역 조회 (최신 순으로 가져옴)
        public Page<ChatMessageResponse> getMessages(Long roomId, int page, int size) {
                ChatRoom room = chatRoomRepository.findById(roomId)
                                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));
                return chatMessageRepository.findByChatRoomOrderByCreatedAtDesc(room, PageRequest.of(page, size))
                                .map(this::convertToMessageResponse);
        }

        // 채팅방 입장 시 읽음 처리
        @Transactional
        public void markAsRead(Long roomId, User currentUser) {
                ChatRoom room = chatRoomRepository.findById(roomId)
                                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

                int updatedCount = chatMessageRepository.markAllAsRead(room, currentUser);

                // 읽음 처리된 메시지가 있으면 상대방에게 WebSocket으로 알림
                if (updatedCount > 0) {
                        messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/read",
                                        Map.of("roomId", roomId, "readBy", currentUser.getUserId()));
                }
        }

        private ChatRoomResponse convertToRoomResponse(ChatRoom room, User me) {
                // 상대방 찾기
                User partner = room.getBuyer().getUserId().equals(me.getUserId()) ? room.getSeller() : room.getBuyer();

                return ChatRoomResponse.builder()
                                .roomId(room.getRoomId())
                                .bookId(room.getBook().getBookId())
                                .bookTitle(room.getBook().getTitle())
                                .bookImageUrl(
                                                room.getBook().getImages().isEmpty() ? null
                                                                : room.getBook().getImages().get(0).getImageUrl())
                                .partnerId(partner.getUserId())
                                .partnerNickname(partner.getNickname())
                                .partnerProfileImage(partner.getProfileImage())
                                .partnerMannerScore(partner.getMannerScore().doubleValue())
                                .lastMessage(room.getLastMessage())
                                .lastMessageAt(room.getLastMessageAt())
                                .unreadCount(chatMessageRepository.countUnreadMessages(room, me))
                                .build();
        }

        private ChatMessageResponse convertToMessageResponse(ChatMessage m) {
                return ChatMessageResponse.builder()
                                .messageId(m.getMessageId())
                                .roomId(m.getChatRoom().getRoomId())
                                .senderId(m.getSender().getUserId())
                                .senderNickname(m.getSender().getNickname())
                                .content(m.getContent())
                                .messageType(m.getMessageType())
                                .createdAt(m.getCreatedAt())
                                .isRead(m.isRead())
                                .build();
        }
}
