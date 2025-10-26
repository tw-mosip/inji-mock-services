package com.mosip.inji_usecase.service.query;

import com.mosip.inji_usecase.entity.EntityData;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.Objects;

public class EntityDataSpecification implements Specification<EntityData> {

    private SearchCriteria criteria;

    public EntityDataSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<EntityData> root, CriteriaQuery<?> query, CriteriaBuilder cb) {

        String filterKey = criteria.getFilterKey();
        String operation = criteria.getOperation();
        Object searchValue = criteria.getValue();

        // Try to get the path - if it fails, assume it's a JSONB field
        boolean isRegularField = isRegularEntityField(root, filterKey);

        if (isRegularField) {
            // Your existing logic for regular columns
            return handleRegularFiltering(root, cb, filterKey, operation, searchValue);
        } else {
            // Handle as JSONB field
            return handleJsonbFiltering(root, cb, filterKey, operation, searchValue);
        }
    }

    /**
     * Check if the field is a regular entity field (not JSONB)
     */
    private boolean isRegularEntityField(Root<EntityData> root, String filterKey) {
        try {
            root.get(filterKey);
            return true;
        } catch (IllegalArgumentException e) {
            // Field doesn't exist in entity, assume it's a JSONB key
            return false;
        }
    }

    /**
     * Handle filtering on JSONB columns
     */
    private Predicate handleJsonbFiltering(Root<EntityData> root, CriteriaBuilder cb,
                                           String jsonKey, String operation, Object searchValue) {

        String value = searchValue != null ? searchValue.toString() : null;

        // Create JSONB path expression: data->>'key'
        Expression<String> jsonField = cb.function(
                "jsonb_extract_path_text",
                String.class,
                root.get("data"),
                cb.literal(jsonKey)
        );

        SearchOperation op = SearchOperation.getSimpleOperation(operation);
        if (op == null) {
            return cb.conjunction();
        }

        switch (op) {
            case CONTAINS:
                return cb.like(cb.lower(jsonField), "%" + value.toLowerCase() + "%");

            case DOES_NOT_CONTAIN:
                return cb.notLike(cb.lower(jsonField), "%" + value.toLowerCase() + "%");

            case BEGINS_WITH:
                return cb.like(cb.lower(jsonField), value.toLowerCase() + "%");

            case DOES_NOT_BEGIN_WITH:
                return cb.notLike(cb.lower(jsonField), value.toLowerCase() + "%");

            case ENDS_WITH:
                return cb.like(cb.lower(jsonField), "%" + value.toLowerCase());

            case DOES_NOT_END_WITH:
                return cb.notLike(cb.lower(jsonField), "%" + value.toLowerCase());

            case EQUAL:
                return cb.equal(jsonField, value);

            case NOT_EQUAL:
                return cb.notEqual(jsonField, value);

            case GREATER_THAN:
                return cb.greaterThan(jsonField, value);

            case LESS_THAN:
                return cb.lessThan(jsonField, value);

            case GREATER_THAN_EQUAL:
                return cb.greaterThanOrEqualTo(jsonField, value);

            case LESS_THAN_EQUAL:
                return cb.lessThanOrEqualTo(jsonField, value);

            case NUL:
                return cb.isNull(jsonField);

            case NOT_NULL:
                return cb.isNotNull(jsonField);

            default:
                return cb.conjunction();
        }
    }

    /**
     * Your existing logic for regular (non-JSONB) columns
     */
    private Predicate handleRegularFiltering(Root<EntityData> root, CriteriaBuilder cb,
                                             String filterKey, String operation, Object searchValue) {

        Path<?> path = root.get(filterKey);
        Class<?> fieldType = path.getJavaType();
        Object castedValue = null;

        if (searchValue != null) {
            castedValue = castToFieldType(fieldType, searchValue.toString());
        }

        switch (Objects.requireNonNull(SearchOperation.getSimpleOperation(operation))) {
            case CONTAINS:
                if (fieldType.equals(String.class)) {
                    return cb.like(cb.lower(root.get(filterKey)), "%" + castedValue + "%");
                }
                break;

            case DOES_NOT_CONTAIN:
                if (fieldType.equals(String.class)) {
                    return cb.notLike(cb.lower(root.get(filterKey)), "%" + castedValue + "%");
                }
                break;

            case BEGINS_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.like(cb.lower(root.get(filterKey)), castedValue + "%");
                }
                break;

            case DOES_NOT_BEGIN_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.notLike(cb.lower(root.get(filterKey)), castedValue + "%");
                }
                break;

            case ENDS_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.like(cb.lower(root.get(filterKey)), "%" + castedValue);
                }
                break;

            case DOES_NOT_END_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.notLike(cb.lower(root.get(filterKey)), "%" + castedValue);
                }
                break;

            case EQUAL:
                return cb.equal(root.get(filterKey), castedValue);

            case NOT_EQUAL:
                return cb.notEqual(root.get(filterKey), castedValue);

            case GREATER_THAN:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.greaterThan(root.get(filterKey), (Comparable) castedValue);
                }
                break;

            case LESS_THAN:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.lessThan(root.get(filterKey), (Comparable) castedValue);
                }
                break;

            case GREATER_THAN_EQUAL:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.greaterThanOrEqualTo(root.get(filterKey), (Comparable) castedValue);
                }
                break;

            case LESS_THAN_EQUAL:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.lessThanOrEqualTo(root.get(filterKey), (Comparable) castedValue);
                }
                break;

            case NUL:
                return cb.isNull(root.get(filterKey));

            case NOT_NULL:
                return cb.isNotNull(root.get(filterKey));

            default:
                return cb.conjunction();
        }

        return cb.conjunction();
    }

    private Object castToFieldType(Class<?> fieldType, String value) {
        if (fieldType.equals(Integer.class)) {
            return Integer.valueOf(value);
        } else if (fieldType.equals(Long.class)) {
            return Long.valueOf(value);
        } else if (fieldType.equals(Float.class)) {
            return Float.valueOf(value);
        } else if (fieldType.equals(Double.class)) {
            return Double.valueOf(value);
        } else if (fieldType.equals(Boolean.class)) {
            return Boolean.valueOf(value);
        } else {
            return value.toLowerCase();
        }
    }
}