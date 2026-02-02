package com.mosip.inji_usecase.dto.truckpass;

import lombok.Data;

@Data
public class TokenRequestDto {
    private String code;
    private String grantType;
    private String redirectUri;
    private String clientId;
}
