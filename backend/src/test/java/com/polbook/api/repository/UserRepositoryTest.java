package com.polbook.api.repository;

import com.polbook.api.entity.Role;
import com.polbook.api.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("User 엔티티를 저장하고 조회할 수 있다.")
    void saveAndFindUser() {
        // given
        User user = User.builder()
                .studentId("2020123456")
                .email("2020123456@office.kopo.ac.kr")
                .password("encoded_password")
                .nickname("polbook_user")
                .profileImage("https://example.com/profile.jpg")
                .build();

        // when
        User savedUser = userRepository.save(user);

        // then
        assertThat(savedUser.getUserId()).isNotNull();
        assertThat(savedUser.getStudentId()).isEqualTo("2020123456");
        assertThat(savedUser.getMannerScore()).isEqualByComparingTo("36.5");
        assertThat(savedUser.getRole()).isEqualTo(Role.USER);
        assertThat(savedUser.getIsSuspended()).isFalse();
        assertThat(savedUser.getCreatedAt()).isNotNull();
        assertThat(savedUser.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("학번이 같은 유저를 저장하면 예외가 발생한다.")
    void duplicateStudentIdThrowsException() {
        // given
        User user1 = User.builder()
                .studentId("2020123456")
                .email("test1@office.kopo.ac.kr")
                .password("pass1")
                .nickname("user1")
                .build();
        userRepository.save(user1);

        User user2 = User.builder()
                .studentId("2020123456") // 중복 학번
                .email("test2@office.kopo.ac.kr")
                .password("pass2")
                .nickname("user2")
                .build();

        // when & then
        assertThatThrownBy(() -> userRepository.saveAndFlush(user2))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
