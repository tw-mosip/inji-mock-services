package com.mosip.inji_usecase.dto.truckpass;

import lombok.Data;

@Data
public class UserInfoRequestDto {
    private String code;
    private String grantType;
    private String redirectUri;
    private String clientId;
}
