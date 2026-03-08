package com.polbook.api.service;

import com.polbook.api.dto.BookResponse;
import com.polbook.api.dto.UserResponse;
import com.polbook.api.dto.UserUpdateRequest;
import com.polbook.api.entity.Book;
import com.polbook.api.entity.User;
import com.polbook.api.repository.BookRepository;
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
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Value("${polbook.upload.path:./uploads}")
    private String uploadPath;

    public UserResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return convertToResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UserUpdateRequest request, MultipartFile profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 닉네임 중복 체크 (본인 닉네임이 아닌 경우에만)
        if (!user.getNickname().equals(request.getNickname())
                && userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        String imagePath = user.getProfileImage();
        if (profileImage != null && !profileImage.isEmpty()) {
            imagePath = "/api/images/" + saveFile(profileImage);
        }

        user.updateProfile(request.getNickname(), imagePath);
        return convertToResponse(user);
    }

    public Page<BookResponse> getMyBooks(Long userId, Pageable pageable) {
        User user = userRepository.getReferenceById(userId);
        Page<Book> books = bookRepository.findBySeller(user, pageable);
        return books.map(BookService::convertToResponse);
    }

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

    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .studentId(user.getStudentId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .mannerScore(user.getMannerScore())
                .role(user.getRole())
                .build();
    }
}
