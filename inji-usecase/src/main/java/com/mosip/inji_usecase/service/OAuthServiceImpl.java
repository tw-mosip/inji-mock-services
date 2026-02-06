package com.mosip.inji_usecase.service;


import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.mosip.inji_usecase.dto.truckpass.UserInfoRequestDto;
import com.mosip.inji_usecase.dto.truckpass.TokenResponseDto;
import com.nimbusds.jose.jwk.RSAKey;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.auth0.jwt.algorithms.Algorithm;

import java.security.interfaces.RSAPrivateKey;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OAuthServiceImpl implements OAuthService {

    private final RestTemplate restTemplate;

    @Value("${mosip.inji-usecase.esignet.privateKey}")
    private String privateKeyValue;

    @Value("${mosip.inji-usecase.client.assertion.type}")
    private String clientAssertionType;

    @Value("${mosip.inji-usecase.esignet.base-url}")
    private String baseUrl;

    private RSAPrivateKey rsaPrivateKey;

    private static final String TOKEN_ENDPOINT = "/oauth/v2/token";
    private static final String USERINFO_ENDPOINT = "/oidc/userinfo";
    private static final String ALG_RS256 = "RS256";

    @PostConstruct
    public void init() {
        try {
            String jwkJson = new String(Base64.getDecoder().decode(privateKeyValue));
            RSAKey rsaKey = RSAKey.parse(jwkJson);
            this.rsaPrivateKey = rsaKey.toRSAPrivateKey();
        } catch (Exception e) {
            throw new IllegalStateException("Invalid eSignet private key", e);
        }
    }

    @Override
    public TokenResponseDto getToken(UserInfoRequestDto request) {

        String endpoint = baseUrl + TOKEN_ENDPOINT;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String clientAssertion = buildClientAssertion(
                request.getClientId(),
                endpoint
        );

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", request.getGrantType());
        body.add("code", request.getCode());
        body.add("redirect_uri", request.getRedirectUri());
        body.add("client_id", request.getClientId());
        body.add("client_assertion", clientAssertion);
        body.add("client_assertion_type", clientAssertionType);

        HttpEntity<MultiValueMap<String, String>> entity =
                new HttpEntity<>(body, headers);

        return restTemplate
                .postForEntity(endpoint, entity, TokenResponseDto.class)
                .getBody();
    }

    @Override
    public Map<String, Object> getUserInfo(String accessToken, String clientId) {

        String endpoint = baseUrl + USERINFO_ENDPOINT;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(Collections.singletonList(
                MediaType.valueOf("application/jwt"))
        );

        ResponseEntity<String> response = restTemplate.exchange(
                endpoint,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class
        );

        Map<String, Object> claims = extractClaims(response.getBody());

        DecodedJWT accessTokenJwt = JWT.decode(accessToken);
        String uin = accessTokenJwt.getSubject();

        if (uin != null) {
            claims.put("uin", uin);
        }

        return claims;
    }


    private String buildClientAssertion(String clientId, String audience) {

        Instant now = Instant.now();

        return JWT.create()
                .withHeader(Map.of("alg", ALG_RS256, "typ", "JWT"))
                .withIssuer(clientId)
                .withSubject(clientId)
                .withAudience(audience)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plusSeconds(120)))
                .withJWTId(UUID.randomUUID().toString())
                .sign(Algorithm.RSA256(null, rsaPrivateKey));
    }

    private Map<String, Object> extractClaims(String jwt) {

        DecodedJWT decodedJWT = JWT.decode(jwt);
        Map<String, Object> claims = new HashMap<>();

        decodedJWT.getClaims().forEach((key, claim) -> {
            if (claim.asBoolean() != null) claims.put(key, claim.asBoolean());
            else if (claim.asLong() != null) claims.put(key, claim.asLong());
            else if (claim.asString() != null) claims.put(key, claim.asString());
            else if (claim.asList(String.class) != null)
                claims.put(key, claim.asList(String.class));
            else
                claims.put(key, claim.asMap());
        });

        return claims;
    }
}
