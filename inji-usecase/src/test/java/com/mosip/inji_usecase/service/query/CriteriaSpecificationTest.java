package com.mosip.inji_usecase.service.query;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.test.util.ReflectionTestUtils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class CriteriaSpecificationTest {

    static class DummyEntity {
        private String name;
        private Integer age;
        private Boolean active;
    }

    @Test
    void testToPredicateEqualString() {
        SearchCriteria criteria = new SearchCriteria("name", "eq", "John");
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(criteria);

        Root<DummyEntity> root = mock(Root.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);

        @SuppressWarnings("unchecked")
        Path<Object> path = (Path<Object>) mock(Path.class);

        when(root.get("name")).thenReturn(path);
        when(path.getJavaType()).thenReturn((Class) String.class);

        Predicate predicate = mock(Predicate.class);
        // The implementation lowercases the value, so we test for "john"
        when(cb.equal(root.get("name"), "john")).thenReturn(predicate);

        Predicate result = spec.toPredicate(root, query, cb);
        assertEquals(predicate, result);
    }

    @Test
    void testToPredicateContainsString() {
        SearchCriteria criteria = new SearchCriteria("name", "cn", "John");
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(criteria);

        Root<DummyEntity> root = mock(Root.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);

        @SuppressWarnings("unchecked")
        Path<String> path = (Path<String>) mock(Path.class);
        
        when(root.<String>get("name")).thenReturn(path);
        when(path.getJavaType()).thenReturn((Class)String.class);

        Predicate predicate = mock(Predicate.class);
        // The implementation lowercases and adds wildcards
        when(cb.like(cb.lower(root.get("name")), "%john%")).thenReturn(predicate);

        Predicate result = spec.toPredicate(root, query, cb);
        assertEquals(predicate, result);
    }

    @Test
    void testToPredicateGreaterThanInteger() {
        SearchCriteria criteria = new SearchCriteria("age", "gt", "25");
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(criteria);

        Root<DummyEntity> root = mock(Root.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);

        @SuppressWarnings("unchecked")
        Path<Integer> path = (Path<Integer>) mock(Path.class);

        when(root.<Integer>get("age")).thenReturn(path);
        when(path.getJavaType()).thenReturn((Class)Integer.class);

        Predicate predicate = mock(Predicate.class);
        // The implementation casts "25" to Integer 25
        when(cb.greaterThan(root.get("age"), 25)).thenReturn(predicate);

        Predicate result = spec.toPredicate(root, query, cb);
        assertEquals(predicate, result);
    }

    @Test
    void testToPredicateIsNull() {
        SearchCriteria criteria = new SearchCriteria("active", "nu", null);
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(criteria);

        Root<DummyEntity> root = mock(Root.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);

        @SuppressWarnings("unchecked")
        Path<Boolean> path = (Path<Boolean>) mock(Path.class);

        when(root.<Boolean>get("active")).thenReturn(path);
        when(path.getJavaType()).thenReturn((Class)Boolean.class);

        Predicate predicate = mock(Predicate.class);
        when(cb.isNull(root.get("active"))).thenReturn(predicate);

        Predicate result = spec.toPredicate(root, query, cb);
        assertEquals(predicate, result);
    }

    @Test
    void testToPredicateNotEqualBoolean() {
        SearchCriteria criteria = new SearchCriteria("active", "ne", "true");
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(criteria);

        Root<DummyEntity> root = mock(Root.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);

        @SuppressWarnings("unchecked")
        Path<Boolean> path = (Path<Boolean>) mock(Path.class);

        when(root.<Boolean>get("active")).thenReturn(path);
        when(path.getJavaType()).thenReturn((Class)Boolean.class);

        Predicate predicate = mock(Predicate.class);
        when(cb.notEqual(root.get("active"), true)).thenReturn(predicate);

        Predicate result = spec.toPredicate(root, query, cb);
        assertEquals(predicate, result);
    }

    @Test
    void testCastToFieldTypeInteger() {
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(new SearchCriteria());
        Object result = ReflectionTestUtils.invokeMethod(spec, "castToFieldType", Integer.class, "42");
        assertEquals(42, result);
    }

    @Test
    void testCastToFieldTypeBoolean() {
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(new SearchCriteria());
        Object result = ReflectionTestUtils.invokeMethod(spec, "castToFieldType", Boolean.class, "true");
        assertEquals(true, result);
    }

    @Test
    void testCastToFieldTypeStringLowercase() {
        CriteriaSpecification<DummyEntity> spec = new CriteriaSpecification<>(new SearchCriteria());
        Object result = ReflectionTestUtils.invokeMethod(spec, "castToFieldType", String.class, "John");
        assertEquals("john", result);
    }
}