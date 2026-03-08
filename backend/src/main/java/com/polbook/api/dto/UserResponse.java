package com.polbook.api.dto;

import com.polbook.api.entity.Role;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class UserResponse {
    private Long userId;
    private String studentId;
    private String email;
    private String nickname;
    private String profileImage;
    private BigDecimal mannerScore;
    private Role role;
}
