package com.polbook.api.service;

import com.polbook.api.dto.BookRequest;
import com.polbook.api.dto.BookResponse;
import com.polbook.api.entity.*;
import com.polbook.api.repository.BookRepository;
import com.polbook.api.repository.LocationRepository;
import com.polbook.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    @Value("${polbook.upload.path:./uploads}")
    private String uploadPath;

    /**
     * 목록 조회 (검색 및 필터)
     */
    public Page<BookResponse> getBooks(Category category, TradeStatus status, String keyword, Pageable pageable) {
        Page<Book> books = bookRepository.findAllWithFilters(category, status, keyword, pageable);
        return books.map(this::convertToResponse);
    }

    /**
     * 상세 조회
     */
    @Transactional
    public BookResponse getBook(Long bookId) {
        Book book = bookRepository.findByIdWithDetails(bookId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + bookId));

        book.increaseViewCount(); // 조회수 증가
        return convertToResponse(book);
    }

    /**
     * 게시물 등록
     */
    @Transactional
    public Long createBook(BookRequest request, List<MultipartFile> imageFiles, Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + sellerId));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new IllegalArgumentException("거래 장소를 찾을 수 없습니다: " + request.getLocationId()));

        Book book = Book.builder()
                .seller(seller)
                .title(request.getTitle())
                .category(request.getCategory())
                .department(request.getDepartment())
                .grade(request.getGrade())
                .semester(request.getSemester())
                .courseName(request.getCourseName())
                .professor(request.getProfessor())
                .price(request.getPrice())
                .description(request.getDescription())
                .condition(request.getCondition())
                .hasNotes(request.isHasNotes())
                .location(location)
                .build();

        // 이미지 저장
        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (int i = 0; i < imageFiles.size(); i++) {
                MultipartFile file = imageFiles.get(i);
                if (!file.isEmpty()) {
                    String savedFileName = saveFile(file);
                    // 실제 접근 가능한 URL을 반환하도록 해야 하지만, 로컬 개발 시에는 파일명 보관
                    BookImage image = BookImage.builder()
                            .imageUrl("/api/images/" + savedFileName)
                            .displayOrder(i + 1)
                            .build();
                    book.addImage(image);
                }
            }
        }

        return bookRepository.save(book).getBookId();
    }

    /**
     * 거래 상태 변경
     */
    @Transactional
    public void updateStatus(Long bookId, TradeStatus status, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + bookId));

        if (!book.getSeller().getUserId().equals(userId)) {
            throw new IllegalStateException("본인의 게시글만 상태를 변경할 수 있습니다.");
        }

        book.updateStatus(status);
    }

    /**
     * 게시물 삭제
     */
    @Transactional
    public void deleteBook(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다: " + bookId));

        if (!book.getSeller().getUserId().equals(userId)) {
            throw new IllegalStateException("본인의 게시글만 삭제할 수 있습니다.");
        }

        bookRepository.delete(book);
    }

    // -- 파일 저장 로직 (로컬 보관) --
    private String saveFile(MultipartFile file) {
        try {
            File dir = new File(uploadPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + extension;
            Path path = Paths.get(uploadPath, fileName);
            Files.write(path, file.getBytes());

            return fileName;
        } catch (IOException e) {
            log.error("Failed to save file", e);
            throw new RuntimeException("이미지 저장 중 오류가 발생했습니다.");
        }
    }

    private BookResponse convertToResponse(Book book) {
        return BookResponse.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .category(book.getCategory())
                .department(book.getDepartment())
                .grade(book.getGrade())
                .semester(book.getSemester())
                .courseName(book.getCourseName())
                .professor(book.getProfessor())
                .price(book.getPrice())
                .description(book.getDescription())
                .condition(book.getCondition())
                .hasNotes(book.isHasNotes())
                .tradeStatus(book.getTradeStatus())
                .viewCount(book.getViewCount())
                .createdAt(book.getCreatedAt())
                .sellerId(book.getSeller().getUserId())
                .sellerNickname(book.getSeller().getNickname())
                .sellerMannerScore(book.getSeller().getMannerScore().doubleValue())
                .locationId(book.getLocation().getLocationId())
                .locationName(book.getLocation().getName())
                .imageUrls(book.getImages().stream().map(BookImage::getImageUrl).collect(Collectors.toList()))
                .build();
    }
}
