package com.mosip.inji_usecase.dto.truckpass;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TokenResponseDto {

    /**
     * OpenID Connect ID Token
     */
    @JsonProperty("id_token")
    private String idToken;

    /**
     * Access token type (Bearer / DPoP / N_A)
     */
    @JsonProperty("token_type")
    private String tokenType;

    /**
     * Access token
     */
    @JsonProperty("access_token")
    private String accessToken;

    /**
     * Lifetime of the access token in seconds
     */
    @JsonProperty("expires_in")
    private int expiresIn;

    /**
     * Nonce used for credential issuance (optional)
     */
    @JsonProperty("c_nonce")
    private String cNonce;

    /**
     * Lifetime of c_nonce in seconds (optional)
     */
    @JsonProperty("c_nonce_expires_in")
    private Integer cNonceExpiresIn;
}


