package com.mosip.inji_usecase.entity.data;

import com.mosip.inji_usecase.service.validation.VerifyFieldService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.lang.reflect.Field;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.*;

class EntityMetadataServiceTest {
    private EntityMetadataService service;
    private VerifyFieldService verifyFieldService;
    private Map<String, Object> entityConfig;

    @BeforeEach
    void setUp() throws Exception {
        entityConfig = new HashMap<>();
        entityConfig.put("name", "testEntity");
        entityConfig.put("fields", Map.of("id", Map.of("type", "string")));
        entityConfig.put("required", List.of("id"));
        entityConfig.put("emailSource", "email");
        List<Map<String, Object>> configs = List.of(entityConfig);
        service = new EntityMetadataService(configs);
        verifyFieldService = Mockito.mock(VerifyFieldService.class);
        // Inject mock using reflection
        Field field = EntityMetadataService.class.getDeclaredField("verifyFieldService");
        field.setAccessible(true);
        field.set(service, verifyFieldService);
    }

    @Test
    @DisplayName("getEntityConfig returns correct config")
    void testGetEntityConfig() {
        Map<String, Object> config = service.getEntityConfig("testEntity");
        assertNotNull(config);
        assertEquals("testEntity", config.get("name"));
    }

    @Test
    @DisplayName("getEntityConfig returns null for missing entity")
    void testGetEntityConfigMissing() {
        assertNull(service.getEntityConfig("missingEntity"));
    }

    @Test
    @DisplayName("getEmailSource returns correct value")
    void testGetEmailSource() {
        assertEquals("email", service.getEmailSource("testEntity"));
    }

    @Test
    @DisplayName("getEmailSource returns null if not present")
    void testGetEmailSourceNull() {
        Map<String, Object> config = new HashMap<>();
        config.put("name", "noEmailEntity");
        service = new EntityMetadataService(List.of(config));
        assertNull(service.getEmailSource("noEmailEntity"));
    }

    @Test
    @DisplayName("validate calls verify methods and returns true")
    void testValidate() {
        Map<String, Object> data = Map.of("id", "123");
        doNothing().when(verifyFieldService).verifyRequired(any(), anySet());
        doNothing().when(verifyFieldService).verify(any(), any());
        assertTrue(service.validate("testEntity", data));
        verify(verifyFieldService).verifyRequired(eq(data), anySet());
        verify(verifyFieldService).verify(eq(data), any());
    }

    @Test
    @DisplayName("validate throws if entity config missing")
    void testValidateMissingEntity() {
        Map<String, Object> data = Map.of("id", "123");
        assertThrows(NullPointerException.class, () -> service.validate("missingEntity", data));
    }
}

