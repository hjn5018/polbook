package com.polbook.api.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LocationResponse {
    private Long locationId;
    private String name;
}
