package com.polbook.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {

    private String grantType;
    private String accessToken;

    public static TokenResponse of(String accessToken) {
        return new TokenResponse("Bearer", accessToken);
    }
}
