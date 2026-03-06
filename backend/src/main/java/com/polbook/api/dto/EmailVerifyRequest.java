package com.polbook.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerifyRequest {

    @NotBlank(message = "학번은 필수 입력 항목입니다.")
    @Pattern(regexp = "^[0-9]{10}$", message = "학번은 10자리 숫자여야 합니다.")
    private String studentId;

    @NotBlank(message = "인증 코드는 필수 입력 항목입니다.")
    @Pattern(regexp = "^[0-9]{6}$", message = "인증 코드는 6자리 숫자여야 합니다.")
    private String code;
}
