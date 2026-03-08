package com.polbook.api.dto;

import com.polbook.api.entity.BookCondition;
import com.polbook.api.entity.Category;
import com.polbook.api.entity.TradeStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class BookResponse {
    private Long bookId;
    private String title;
    private Category category;
    private String department;
    private Integer grade;
    private Integer semester;
    private String courseName;
    private String professor;
    private Integer price;
    private String description;
    private BookCondition condition;
    private boolean hasNotes;
    private TradeStatus tradeStatus;
    private Integer viewCount;
    private LocalDateTime createdAt;

    private Long sellerId;
    private String sellerNickname;
    private Double sellerMannerScore;

    private Long locationId;
    private String locationName;

    private List<String> imageUrls;
}
