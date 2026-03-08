package com.polbook.api.entity;

/**
 * 거래 상태 (판매중/예약중/판매완료)
 */
public enum TradeStatus {
    SELLING, // 판매중
    RESERVED, // 예약중
    SOLD // 판매완료
}
