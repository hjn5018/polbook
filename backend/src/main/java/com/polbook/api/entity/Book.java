package com.polbook.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 중고 책 판매 게시글
 */
@Entity
@Table(name = "books")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Book extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(length = 50)
    private String department;

    private Integer grade;

    private Integer semester;

    @Column(length = 100)
    private String courseName;

    @Column(length = 50)
    private String professor;

    @Column(nullable = false)
    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "book_condition", nullable = false)
    private BookCondition condition;

    @Builder.Default
    @Column(nullable = false)
    private boolean hasNotes = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "trade_status", nullable = false)
    private TradeStatus tradeStatus = TradeStatus.SELLING;

    @Builder.Default
    @Column(nullable = false)
    private Integer viewCount = 0;

    @Builder.Default
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookImage> images = new ArrayList<>();

    // -- 편의 메서드 --
    public void addImage(BookImage image) {
        images.add(image);
        image.setBook(this);
    }

    public void updateStatus(TradeStatus status) {
        this.tradeStatus = status;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    // 수정 메서드
    public void update(String title, Category category, String department, Integer grade, Integer semester,
            String courseName, String professor, Integer price, String description,
            BookCondition condition, boolean hasNotes, Location location) {
        this.title = title;
        this.category = category;
        this.department = department;
        this.grade = grade;
        this.semester = semester;
        this.courseName = courseName;
        this.professor = professor;
        this.price = price;
        this.description = description;
        this.condition = condition;
        this.hasNotes = hasNotes;
        this.location = location;
    }
}
