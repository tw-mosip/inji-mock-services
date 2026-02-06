package com.mosip.inji_usecase.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.mosip.inji_usecase.dto.truckpass.UserInfoRequestDto;
import com.mosip.inji_usecase.dto.truckpass.TokenResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.http.*;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.lang.reflect.Field;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class OAuthServiceImplTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private OAuthServiceImpl oAuthService;

    @BeforeEach
    void setUp() throws Exception {
        // Generate RSA key for testing
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.generateKeyPair();

        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        setField(oAuthService, "rsaPrivateKey", privateKey);
        setField(oAuthService, "baseUrl", "https://test.esignet.io");
        setField(oAuthService, "clientAssertionType",
                "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
    }

    public static void setField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @Nested
    class GetTokenTests {
        @Test
        void getToken_success() {

            UserInfoRequestDto request = new UserInfoRequestDto();
            request.setClientId("client-123");
            request.setGrantType("authorization_code");
            request.setCode("auth-code");
            request.setRedirectUri("https://callback");

            TokenResponseDto responseDto = new TokenResponseDto();
            responseDto.setAccessToken("access-token");

            when(restTemplate.postForEntity(
                    anyString(),
                    any(HttpEntity.class),
                    eq(TokenResponseDto.class)
            )).thenReturn(new ResponseEntity<>(responseDto, HttpStatus.OK));

            TokenResponseDto response = oAuthService.getToken(request);

            assertNotNull(response);
            assertEquals("access-token", response.getAccessToken());
            verify(restTemplate, times(1))
                    .postForEntity(anyString(), any(), eq(TokenResponseDto.class));
        }

        @Test
        void getToken_restTemplateThrowsException() {

            UserInfoRequestDto request = new UserInfoRequestDto();
            request.setClientId("client-123");

            when(restTemplate.postForEntity(
                    anyString(),
                    any(HttpEntity.class),
                    eq(TokenResponseDto.class)
            )).thenThrow(new RuntimeException("Token endpoint down"));

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> oAuthService.getToken(request));

            assertEquals("Token endpoint down", ex.getMessage());
        }

        @Test
        void getToken_nullResponseBody() {

            UserInfoRequestDto request = new UserInfoRequestDto();
            request.setClientId("client-123");

            when(restTemplate.postForEntity(
                    anyString(),
                    any(HttpEntity.class),
                    eq(TokenResponseDto.class)
            )).thenReturn(new ResponseEntity<>(null, HttpStatus.OK));

            TokenResponseDto response = oAuthService.getToken(request);

            assertNull(response);
        }

        @Test
        void getToken_sendsCorrectHeadersAndBody() {

            UserInfoRequestDto request = new UserInfoRequestDto();
            request.setClientId("client-123");
            request.setGrantType("authorization_code");
            request.setCode("auth-code");
            request.setRedirectUri("https://callback");

            ArgumentCaptor<HttpEntity<MultiValueMap<String, String>>> captor =
                    ArgumentCaptor.forClass(HttpEntity.class);

            when(restTemplate.postForEntity(
                    anyString(),
                    captor.capture(),
                    eq(TokenResponseDto.class)
            )).thenReturn(new ResponseEntity<>(new TokenResponseDto(), HttpStatus.OK));

            oAuthService.getToken(request);

            HttpEntity<MultiValueMap<String, String>> entity = captor.getValue();

            // Header assertion
            assertEquals(
                    MediaType.APPLICATION_FORM_URLENCODED,
                    entity.getHeaders().getContentType()
            );

            // Body assertions
            MultiValueMap<String, String> body = entity.getBody();
            assertEquals("authorization_code", body.getFirst("grant_type"));
            assertEquals("auth-code", body.getFirst("code"));
            assertEquals("client-123", body.getFirst("client_id"));
            assertNotNull(body.getFirst("client_assertion"));
            assertNotNull(body.getFirst("client_assertion_type"));
        }
    }

    @Nested
    class GetUserInfoTests {
        @Test
        void getUserInfo_success() {

            String jwt = JWT.create()
                    .withIssuer("issuer")
                    .withClaim("name", "mock")
                    .withClaim("email", "mock@test.com")
                    .withIssuedAt(Date.from(Instant.now()))
                    .sign(Algorithm.none());

            String accessToken = JWT.create()
                    .withClaim("sub", "123456789")
                    .sign(Algorithm.none());

            ResponseEntity<String> response =
                    new ResponseEntity<>(jwt, HttpStatus.OK);

            when(restTemplate.exchange(
                    anyString(),
                    eq(HttpMethod.GET),
                    any(HttpEntity.class),
                    eq(String.class)
            )).thenReturn(response);



            Map<String, Object> claims =
                    oAuthService.getUserInfo(accessToken, "client-123");

            assertEquals("mock", claims.get("name"));
            assertEquals("mock@test.com", claims.get("email"));
            assertEquals("123456789", claims.get("uin"));
        }

        @Test
        void getUserInfo_invalidJwt_throwsException() {

            when(restTemplate.exchange(
                    anyString(),
                    eq(HttpMethod.GET),
                    any(HttpEntity.class),
                    eq(String.class)
            )).thenReturn(new ResponseEntity<>("invalid.jwt.value", HttpStatus.OK));

            assertThrows(Exception.class, () ->
                    oAuthService.getUserInfo("access-token", "client-123"));
        }

        @Test
        void getUserInfo_setsCorrectHeaders() {

            String jwt = JWT.create()
                    .withClaim("sub", "123")
                    .sign(Algorithm.none());

            String accessToken = JWT.create()
                    .withClaim("sub", "123456789")
                    .sign(Algorithm.none());

            ArgumentCaptor<HttpEntity<?>> captor =
                    ArgumentCaptor.forClass(HttpEntity.class);

            when(restTemplate.exchange(
                    anyString(),
                    eq(HttpMethod.GET),
                    captor.capture(),
                    eq(String.class)
            )).thenReturn(new ResponseEntity<>(jwt, HttpStatus.OK));

            oAuthService.getUserInfo(accessToken, "client-123");

            HttpHeaders headers = captor.getValue().getHeaders();

            assertTrue(headers.getAccept()
                    .contains(MediaType.valueOf("application/jwt")));
        }

        @Test
        void getUserInfo_extractsAllClaimTypes() {

            String jwt = JWT.create()
                    .withClaim("active", true)
                    .withClaim("age", 25L)
                    .withClaim("score", 99L)
                    .sign(Algorithm.none());

            String accessToken = JWT.create()
                    .withClaim("sub", "123456789")
                    .sign(Algorithm.none());

            when(restTemplate.exchange(
                    anyString(),
                    eq(HttpMethod.GET),
                    any(HttpEntity.class),
                    eq(String.class)
            )).thenReturn(new ResponseEntity<>(jwt, HttpStatus.OK));

            Map<String, Object> claims =
                    oAuthService.getUserInfo(accessToken, "client-123");

            assertEquals(true, claims.get("active"));
            assertEquals(25L, claims.get("age"));
            assertEquals(99L, claims.get("score"));
            assertEquals("123456789", claims.get("uin"));
        }
    }






}
