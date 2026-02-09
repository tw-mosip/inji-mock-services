package com.mosip.inji_usecase.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.truckpass.UserInfoRequestDto;
import com.mosip.inji_usecase.dto.truckpass.TokenResponseDto;
import com.mosip.inji_usecase.service.EmailService;
import com.mosip.inji_usecase.config.EmailTemplateProperties;
import com.mosip.inji_usecase.service.OAuthService;
import com.mosip.inji_usecase.service.repository.RepositoryService;
import com.mosip.inji_usecase.service.validation.ValidationService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DataController.class)
class DataControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        // MANDATORY constructor dependencies
        @MockBean
        private EmailService emailService;

        @MockBean
        private EmailTemplateProperties emailTemplateProperties;

        // Existing mocks
        @MockBean
        private Map<String, ValidationService> validationServices;

        @MockBean
        private Map<String, RepositoryService> repositoryServices;

        @MockBean
        private OAuthService oAuthService;

        // Local mocks for specific behaviors
        private ValidationService mockFarmerValidationService;
        private RepositoryService mockFarmerRepositoryService;
        private RepositoryService mockOtherRepositoryService;

        @BeforeEach
        void setUp() {
                mockFarmerValidationService = mock(ValidationService.class);
                mockFarmerRepositoryService = mock(RepositoryService.class);
                mockOtherRepositoryService = mock(RepositoryService.class);
        }

        @Test
        void ingestData_Success() throws Exception {
                String dataSource = "farmer";
                Map<String, Object> requestBody = Map.of("name", "John Doe", "farmSize", 50);

                when(validationServices.get("farmerValidationService"))
                                .thenReturn(mockFarmerValidationService);
                when(repositoryServices.get("farmerRepositoryService"))
                                .thenReturn(mockFarmerRepositoryService);

                doNothing().when(mockFarmerValidationService).validate(requestBody);

                mockMvc.perform(post("/api/data")
                                .header("x-source", dataSource)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isOk());

                verify(mockFarmerValidationService).validate(requestBody);
                verify(mockFarmerRepositoryService).save(requestBody);
        }

        @Test
        void ingestData_ValidationFails() throws Exception {
                String dataSource = "farmer";
                Map<String, Object> requestBody = Map.of("name", "John Doe");
                String errorMessage = "Farm size is mandatory";

                when(validationServices.get("farmerValidationService"))
                                .thenReturn(mockFarmerValidationService);
                when(repositoryServices.get("farmerRepositoryService"))
                                .thenReturn(mockFarmerRepositoryService);

                doThrow(new IllegalArgumentException(errorMessage))
                                .when(mockFarmerValidationService).validate(requestBody);

                mockMvc.perform(post("/api/data")
                                .header("x-source", dataSource)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isBadRequest())
                                .andExpect(content()
                                                .string(containsString("VALIDATION ERROR:: '" + errorMessage + "'")));

                verify(mockFarmerRepositoryService, never()).save(anyMap());
        }

        @Test
        void ingestData_UnknownDataSource() throws Exception {
                String dataSource = "unknown";
                Map<String, Object> requestBody = Map.of("key", "value");

                when(validationServices.get("unknownValidationService")).thenReturn(null);

                mockMvc.perform(post("/api/data")
                                .header("x-source", dataSource)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestBody)))
                                .andExpect(status().isBadRequest())
                                .andExpect(content().string("Unknown data source: " + dataSource));
        }

        @Test
        void retrieveDataById_WhenDataFound() throws Exception {
                Long id = 123L;
                Map<String, Object> farmerData = Map.of("id", id, "type", "farmer");

                Map<String, RepositoryService> repoMap = Map.of(
                                "farmerRepo", mockFarmerRepositoryService,
                                "otherRepo", mockOtherRepositoryService);
                when(repositoryServices.entrySet()).thenReturn(repoMap.entrySet());

                when(mockFarmerRepositoryService.getById(id))
                                .thenReturn(Optional.of(farmerData));

                when(mockOtherRepositoryService.getById(id))
                                .thenReturn(Optional.empty());

                mockMvc.perform(get("/api/data/{id}", id))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(1)))
                                .andExpect(jsonPath("$[0].type", is("farmer")));
        }

        @Test
        void retrieveDataById_WhenDataNotFound() throws Exception {
                Long id = 404L;

                Map<String, RepositoryService> repoMap = Map.of(
                                "farmerRepo", mockFarmerRepositoryService,
                                "otherRepo", mockOtherRepositoryService);
                when(repositoryServices.entrySet()).thenReturn(repoMap.entrySet());

                when(mockFarmerRepositoryService.getById(id)).thenReturn(Optional.empty());
                when(mockOtherRepositoryService.getById(id)).thenReturn(Optional.empty());

                mockMvc.perform(get("/api/data/{id}", id))
                                .andExpect(status().isNotFound())
                                .andExpect(content().string("No data found for ID: " + id));
        }

        @Test
        void retrieveDataByQuery_WhenDataFound() throws Exception {

                Map<String, Object> searchResult = Map.of("name", "Jane Doe");

                when(repositoryServices.get("farmerRepositoryService"))
                        .thenReturn(mockFarmerRepositoryService);

                when(mockFarmerRepositoryService.getBySearchCriteria(any(Specification.class)))
                        .thenReturn(List.of(searchResult));

                mockMvc.perform(get("/api/data")
                                .header("x-source", "farmer")
                                .param("filterKey", "name")
                                .param("operation", "eq")
                                .param("value", "Jane Doe"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(1)))
                        .andExpect(jsonPath("$[0].name").value("Jane Doe"));
        }

        @Test
        void retrieveDataByQuery_WhenDataNotFound() throws Exception {

                when(repositoryServices.get("farmerRepositoryService"))
                        .thenReturn(mockFarmerRepositoryService);

                when(mockFarmerRepositoryService.getBySearchCriteria(any(Specification.class)))
                        .thenReturn(Collections.emptyList());

                mockMvc.perform(get("/api/data")
                                .header("x-source", "farmer")
                                .param("filterKey", "name")
                                .param("operation", "eq")
                                .param("value", "NonExistent"))
                        .andExpect(status().isNotFound())
                        .andExpect(content().string("No data found for the given query criteria"));
        }


        @Test
        void fetchUserInfo_success() throws Exception {

                UserInfoRequestDto request = new UserInfoRequestDto();
                request.setClientId("client-123");

                TokenResponseDto tokenResponse = new TokenResponseDto();
                tokenResponse.setAccessToken("access-token");

                Map<String, Object> userInfo = Map.of(
                        "name", "mock",
                        "email", "mock@test.com"
                );

                when(oAuthService.getToken(any(UserInfoRequestDto.class)))
                        .thenReturn(tokenResponse);

                when(oAuthService.getUserInfo("access-token", "client-123"))
                        .thenReturn(userInfo);

                mockMvc.perform(post("/api/fetchUserInfo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.name").value("mock"))
                        .andExpect(jsonPath("$.email").value("mock@test.com"));
        }

        @Test
        void fetchUserInfo_tokenFailure() throws Exception {

                UserInfoRequestDto request = new UserInfoRequestDto();
                request.setClientId("client-123");

                when(oAuthService.getToken(any(UserInfoRequestDto.class)))
                        .thenReturn(null);

                mockMvc.perform(post("/api/fetchUserInfo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isBadGateway())
                        .andExpect(jsonPath("$.message")
                                .value("Failed to fetch access token"));
        }

        @Test
        void fetchUserInfo_badRequest() throws Exception {

                UserInfoRequestDto request = new UserInfoRequestDto();

                when(oAuthService.getToken(any(UserInfoRequestDto.class)))
                        .thenThrow(new IllegalArgumentException("Invalid client"));

                mockMvc.perform(post("/api/fetchUserInfo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isBadRequest())
                        .andExpect(jsonPath("$.message")
                                .value("Invalid client"));
        }

        @Test
        void fetchUserInfo_internalServerError() throws Exception {

                UserInfoRequestDto request = new UserInfoRequestDto();

                when(oAuthService.getToken(any(UserInfoRequestDto.class)))
                        .thenThrow(new RuntimeException("Service down"));

                mockMvc.perform(post("/api/fetchUserInfo")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isInternalServerError())
                        .andExpect(jsonPath("$.message")
                                .value("Failed to fetch user info"))
                        .andExpect(jsonPath("$.error")
                                .value("Service down"));
        }

        @Test
        void fetchAllData_success() throws Exception {

                Map<String, Object> data = Map.of("name", "Truck Driver");

                when(repositoryServices.get("truckpassRepositoryService"))
                        .thenReturn(mockFarmerRepositoryService);

                when(mockFarmerRepositoryService.getBySearchCriteria(null))
                        .thenReturn(List.of(data));

                mockMvc.perform(get("/api/all")
                                .header("x-source", "truckpass"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(1)))
                        .andExpect(jsonPath("$[0].name").value("Truck Driver"));
        }

        @Test
        void fetchAllData_notFound() throws Exception {

                when(repositoryServices.get("truckpassRepositoryService"))
                        .thenReturn(mockFarmerRepositoryService);

                when(mockFarmerRepositoryService.getBySearchCriteria(null))
                        .thenReturn(Collections.emptyList());

                mockMvc.perform(get("/api/all")
                                .header("x-source", "truckpass"))
                        .andExpect(status().isNotFound())
                        .andExpect(content().string("No data found"));
        }

        @Test
        void fetchAllData_invalidSource() throws Exception {

                when(repositoryServices.get("invalidRepositoryService"))
                        .thenReturn(null);

                mockMvc.perform(get("/api/all")
                                .header("x-source", "invalid"))
                        .andExpect(status().isBadRequest())
                        .andExpect(content().string("Invalid data source"));
        }
}
