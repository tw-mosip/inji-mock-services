package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.entity.data.EntityData;
import com.mosip.inji_usecase.entity.data.EntityMetadataService;
import com.mosip.inji_usecase.service.validation.VerifyFieldService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class DataServiceTest {
    @Mock
    private EntityManager entityManager;
    @Mock
    private EntityMetadataService entityMetadataService;
    @Mock
    private VerifyFieldService verifyFieldService;

    @InjectMocks
    private DataService dataService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dataService = new DataService(entityManager, entityMetadataService, verifyFieldService);
    }

    @Test
    @DisplayName("create: valid data with id")
    void testCreateWithId() {
        Map<String, Object> data = new HashMap<>();
        data.put("id", "123");
        when(entityMetadataService.validate(anyString(), anyMap())).thenReturn(true);
        doNothing().when(entityManager).persist(any(EntityData.class));
        assertDoesNotThrow(() -> dataService.create("entity", data));
        verify(entityManager).persist(any(EntityData.class));
    }

    @Test
    @DisplayName("create: valid data without id")
    void testCreateWithoutId() {
        Map<String, Object> data = new HashMap<>();
        when(entityMetadataService.validate(anyString(), anyMap())).thenReturn(true);
        doNothing().when(entityManager).persist(any(EntityData.class));
        assertDoesNotThrow(() -> dataService.create("entity", data));
        verify(entityManager).persist(any(EntityData.class));
    }

    @Test
    @DisplayName("create: invalid data throws exception")
    void testCreateInvalidData() {
        Map<String, Object> data = new HashMap<>();
        when(entityMetadataService.validate(anyString(), anyMap())).thenReturn(false);
        assertThrows(IllegalArgumentException.class, () -> dataService.create("entity", data));
    }

    @Test
    @DisplayName("readAll: found")
    void testReadAllFound() {
        List<EntityData> entities = List.of(mock(EntityData.class));
        TypedQuery<EntityData> query = mock(TypedQuery.class);
        when(entityManager.createQuery(anyString(), eq(EntityData.class))).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getResultList()).thenReturn(entities);
        when(entities.get(0).getData()).thenReturn(Map.of("id", "1"));
        List<Map<String, Object>> result = dataService.readAll("entity");
        assertNotNull(result);
        assertEquals("1", result.get(0).get("id"));
    }

    @Test
    @DisplayName("readAll: not found")
    void testReadAllNotFound() {
        TypedQuery<EntityData> query = mock(TypedQuery.class);
        when(entityManager.createQuery(anyString(), eq(EntityData.class))).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getResultList()).thenReturn(Collections.emptyList());
        List<Map<String, Object>> result = dataService.readAll("entity");
        assertNull(result);
    }

    @Test
    @DisplayName("read: found")
    void testReadFound() {
        TypedQuery<EntityData> query = mock(TypedQuery.class);
        EntityData entity = mock(EntityData.class);
        when(entityManager.createQuery(anyString(), eq(EntityData.class))).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(entity);
        EntityData result = dataService.read("entity", "1");
        assertEquals(entity, result);
    }

    @Test
    @DisplayName("read: not found")
    void testReadNotFound() {
        TypedQuery<EntityData> query = mock(TypedQuery.class);
        when(entityManager.createQuery(anyString(), eq(EntityData.class))).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenThrow(new NoResultException());
        EntityData result = dataService.read("entity", "1");
        assertNull(result);
    }

    @Test
    @DisplayName("update: success")
    void testUpdateSuccess() {
        Map<String, Object> data = Map.of("key", "value");
        EntityData entity = mock(EntityData.class);
        when(entityMetadataService.validate(anyString(), anyMap())).thenReturn(true);
        when(entityManager.find(EntityData.class, "1")).thenReturn(entity);
        when(entity.getEntityType()).thenReturn("entity");
        boolean result = dataService.update("entity", "1", data);
        assertTrue(result);
        verify(entityManager).merge(entity);
    }

    @Test
    @DisplayName("update: not found")
    void testUpdateNotFound() {
        Map<String, Object> data = Map.of("key", "value");
        when(entityMetadataService.validate(anyString(), anyMap())).thenReturn(true);
        when(entityManager.find(EntityData.class, "1")).thenReturn(null);
        boolean result = dataService.update("entity", "1", data);
        assertFalse(result);
    }

    @Test
    @DisplayName("delete: success")
    void testDeleteSuccess() {
        EntityData entity = mock(EntityData.class);
        when(entityManager.find(EntityData.class, "1")).thenReturn(entity);
        when(entity.getEntityType()).thenReturn("entity");
        boolean result = dataService.delete("entity", "1");
        assertTrue(result);
        verify(entityManager).remove(entity);
    }

    @Test
    @DisplayName("delete: not found")
    void testDeleteNotFound() {
        when(entityManager.find(EntityData.class, "1")).thenReturn(null);
        boolean result = dataService.delete("entity", "1");
        assertFalse(result);
    }

    @Test
    @DisplayName("search: returns result")
    void testSearchReturnsResult() {
        List filterKey = List.of("key");
        List operation = List.of("eq");
        List value = List.of("val");
        String dataOption = null;
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<EntityData> cq = mock(CriteriaQuery.class);
        Root<EntityData> root = mock(Root.class);
        Predicate predicate = mock(Predicate.class);
        TypedQuery<EntityData> typedQuery = mock(TypedQuery.class);
        EntityData entity = mock(EntityData.class);
        when(entityManager.getCriteriaBuilder()).thenReturn(cb);
        when(cb.createQuery(EntityData.class)).thenReturn(cq);
        when(cq.from(EntityData.class)).thenReturn(root);
        when(typedQuery.getResultList()).thenReturn(List.of(entity));
        when(entityManager.createQuery(cq)).thenReturn(typedQuery);
        when(entity.getData()).thenReturn(Map.of("id", "1"));
        // Specification is used inside search, so we mock toPredicate
        // But since it's constructed inside, we can't mock it directly, so just let it run
        List<Map<String, Object>> result = dataService.search(filterKey, operation, value, dataOption);
        assertNotNull(result);
    }

    @Test
    @DisplayName("search: returns empty on exception")
    void testSearchReturnsEmptyOnException() {
        List filterKey = List.of("key");
        List operation = List.of("eq");
        List value = List.of("val");
        String dataOption = null;
        when(entityManager.getCriteriaBuilder()).thenThrow(new RuntimeException("fail"));
        List<Map<String, Object>> result = dataService.search(filterKey, operation, value, dataOption);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}

