package com.mosip.inji_usecase.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.service.EmailService;
import com.mosip.inji_usecase.config.EmailTemplateProperties;
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

                Map<String, RepositoryService> repoMap = Map.of("farmerRepo", mockFarmerRepositoryService);

                when(repositoryServices.entrySet()).thenReturn(repoMap.entrySet());

                when(mockFarmerRepositoryService.getBySearchCriteria(any(Specification.class)))
                                .thenReturn(List.of(searchResult));

                mockMvc.perform(get("/api/data")
                                .param("filterKey", "name")
                                .param("operation", "eq")
                                .param("value", "Jane Doe"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(1)))
                                .andExpect(jsonPath("$[0].name", is("Jane Doe")));
        }

        @Test
        void retrieveDataByQuery_WhenDataNotFound() throws Exception {
                Map<String, RepositoryService> repoMap = Map.of("farmerRepo", mockFarmerRepositoryService);

                when(repositoryServices.entrySet()).thenReturn(repoMap.entrySet());

                when(mockFarmerRepositoryService.getBySearchCriteria(any(Specification.class)))
                                .thenReturn(Collections.emptyList());

                mockMvc.perform(get("/api/data")
                                .param("filterKey", "name")
                                .param("operation", "eq")
                                .param("value", "NonExistent"))
                                .andExpect(status().isNotFound())
                                .andExpect(content().string("No data found for the given query criteria"));
        }
}
