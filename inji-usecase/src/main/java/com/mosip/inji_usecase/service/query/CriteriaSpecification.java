package com.mosip.inji_usecase.service.query;

import java.util.Objects;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class CriteriaSpecification<T> implements Specification<T>{

    private final SearchCriteria searchCriteria;

    public CriteriaSpecification(SearchCriteria searchCriteria) {
        this.searchCriteria = searchCriteria;
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

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Path<?> path = root.get(searchCriteria.getFilterKey());
        Class<?> fieldType = path.getJavaType();
        String operation = searchCriteria.getOperation();
        Object castedValue = null;
        if (searchCriteria.getValue() != null) {
            castedValue = castToFieldType(fieldType, searchCriteria.getValue().toString());
        }

        switch (Objects.requireNonNull(SearchOperation.getSimpleOperation(operation))) {
            case CONTAINS:
                if (fieldType.equals(String.class)) {
                    return cb.like(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + castedValue + "%");
                }
                break;
            case DOES_NOT_CONTAIN:
                if (fieldType.equals(String.class)) {
                    return cb.notLike(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + castedValue + "%");
                }
                break;
            case BEGINS_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.like(cb.lower(root.get(searchCriteria.getFilterKey())), castedValue + "%");
                }
                break;
            case DOES_NOT_BEGIN_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.notLike(cb.lower(root.get(searchCriteria.getFilterKey())), castedValue + "%");
                }
                break;
            case ENDS_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.like(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + castedValue);
                }
                break;
            case DOES_NOT_END_WITH:
                if (fieldType.equals(String.class)) {
                    return cb.notLike(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + castedValue);
                }
                break;
            case EQUAL:
                return cb.equal(root.get(searchCriteria.getFilterKey()), castedValue);

            case NOT_EQUAL:
                return cb.notEqual(root.get(searchCriteria.getFilterKey()), castedValue);

            case GREATER_THAN:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.greaterThan(root.get(searchCriteria.getFilterKey()), (Comparable) castedValue);
                }
                break;

            case LESS_THAN:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.lessThan(root.get(searchCriteria.getFilterKey()), (Comparable) castedValue);
                }
                break;

            case GREATER_THAN_EQUAL:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.greaterThanOrEqualTo(root.get(searchCriteria.getFilterKey()), (Comparable) castedValue);
                }
                break;

            case LESS_THAN_EQUAL:
                if (Comparable.class.isAssignableFrom(fieldType)) {
                    return cb.lessThanOrEqualTo(root.get(searchCriteria.getFilterKey()), (Comparable) castedValue);
                }
                break;

            case NUL:
                return cb.isNull(root.get(searchCriteria.getFilterKey()));

            case NOT_NULL:
                return cb.isNotNull(root.get(searchCriteria.getFilterKey()));

            default:
                return cb.conjunction();
        }

        return cb.conjunction(); // fallback if unsupported
    }

}
