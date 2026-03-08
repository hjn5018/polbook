package com.polbook.api.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 교내 거래 장소
 */
@Entity
@Table(name = "locations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;
}
