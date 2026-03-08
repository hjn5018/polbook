package com.polbook.api.dto;

import com.polbook.api.entity.BookCondition;
import com.polbook.api.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotNull(message = "카테고리를 선택해주세요.")
    private Category category;

    private String department;

    private Integer grade;

    private Integer semester;

    private String courseName;

    private String professor;

    @NotNull(message = "가격을 입력해주세요.")
    private Integer price;

    private String description;

    @NotNull(message = "책 상태를 선택해주세요.")
    private BookCondition condition;

    private boolean hasNotes;

    @NotNull(message = "거래 장소를 선택해주세요.")
    private Long locationId;
}
