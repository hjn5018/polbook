package com.polbook.api.entity;

/**
 * 책 상태 등급 (S/A/B/C)
 */
public enum BookCondition {
    S, // 최상 (미개봉, 새 상품 수준)
    A, // 상 (매우 깨끗함, 약간의 사용감)
    B, // 중 (보통, 헌책 느낌, 약간의 오염/낙서)
    C // 하 (상태 안 좋음, 심한 낙서/파손)
}
