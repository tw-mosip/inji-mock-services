package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.dto.truckpass.UserInfoRequestDto;
import com.mosip.inji_usecase.dto.truckpass.TokenResponseDto;

import java.util.Map;

public interface OAuthService {
    TokenResponseDto getToken(UserInfoRequestDto request) throws Exception;

    Map<String, Object> getUserInfo(
            String accessToken,
            String clientId
    ) throws Exception;
}
