package com.polbook.api.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "student_id", unique = true, nullable = false, length = 10, columnDefinition = "CHAR(10)")
    private String studentId;

    @Column(unique = true, nullable = false, length = 30)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(unique = true, nullable = false, length = 30)
    private String nickname;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "manner_score", precision = 3, scale = 1)
    private BigDecimal mannerScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_suspended", nullable = false)
    private Boolean isSuspended;

    @Column(name = "suspended_until")
    private LocalDateTime suspendedUntil;

    @Builder
    public User(String studentId, String email, String password, String nickname, String profileImage) {
        this.studentId = studentId;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.mannerScore = new BigDecimal("36.5");
        this.role = Role.USER;
        this.isSuspended = false;
    }
}
