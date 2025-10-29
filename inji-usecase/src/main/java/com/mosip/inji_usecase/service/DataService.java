package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.entity.data.EntityData;
import com.mosip.inji_usecase.entity.data.EntityMetadata;
import com.mosip.inji_usecase.service.query.EntityDataSpecification;
import com.mosip.inji_usecase.service.query.SearchCriteria;
import com.mosip.inji_usecase.service.validation.EntityDataValidationService;
import com.mosip.inji_usecase.service.validation.VerifyFieldService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DataService {

    private final EntityManager entityManager;
    private final EntityMetadata entityMetadata;
    private final VerifyFieldService verifyFieldService;

    public DataService(EntityManager entityManager, EntityMetadata entityMetadata, VerifyFieldService verifyFieldService) {
        this.entityManager = entityManager;
        this.entityMetadata = entityMetadata;
        this.verifyFieldService = verifyFieldService;
    }

    @Transactional
    public void create(String entityName, Map<String, Object> data) {
        if (!entityMetadata.validate(entityName, data)) {
            throw new IllegalArgumentException("Invalid data for entity: " + entityName);
        }

        EntityDataValidationService validationService = new EntityDataValidationService(verifyFieldService, entityName);
        validationService.validate(data);

        EntityData entity = new EntityData();
        entity.setEntityType(entityName);
        entity.setData(data);

        // Use ID from data if available, else generate one
        Object idValue = data.get("id");
        String id;
        if (idValue != null) {
            id = idValue.toString();
        } else {
            // Generate UUID if not provided
            id = java.util.UUID.randomUUID().toString();
        }
        entity.setId(id);

        // Optional: Remove 'id' from the data map to avoid duplication inside JSONB
        data.remove("id");

        entityManager.persist(entity);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> readAll(String entityName) {
        List<EntityData> result = entityManager.createQuery("SELECT e FROM EntityData e WHERE e.entityType = :entityType", EntityData.class)
                .setParameter("entityType", entityName)
                .getResultList();

        if (result == null || result.isEmpty()) {
            return null;
        }

        List<Map<String, Object>> data = result.stream().map(EntityData::getData).toList();

        return data;
    }

    @Transactional(readOnly = true)
    public EntityData read(String entityName, String id) {
        System.out.println("Reading entity: " + entityName + " with ID: " + id);
        try {
            return entityManager.createQuery(
                            "SELECT e FROM EntityData e WHERE e.id = :id and e.entityType= :entityType",
                            EntityData.class)
                    .setParameter("entityType", entityName)
                    .setParameter("id", id)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // Return null so the controller can handle 404
        }
    }

    @Transactional
    public boolean update(String entityName, String id, Map<String, Object> data) {
        if (!entityMetadata.validate(entityName, data)) {
            throw new IllegalArgumentException("Invalid data for entity: " + entityName);
        }
        EntityData entity = entityManager.find(EntityData.class, id);
        if (entity != null && entity.getEntityType().equals(entityName)) {
            entity.setData(data);
            entityManager.merge(entity);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean delete(String entityName, String id) {
        EntityData entity = entityManager.find(EntityData.class, id);
        if (entity != null && entity.getEntityType().equals(entityName)) {
            entityManager.remove(entity);
            return true;
        }
        return false;
    }

    public List<Map<String, Object>> search(List filterKey, List operation, List value, String dataOption) {
        try {
            List<SearchCriteria> criterias = new ArrayList<>();
            for(int i = 0; i < filterKey.size(); i++){
                SearchCriteria criteria = new SearchCriteria();
                criteria.setFilterKey(filterKey.get(i).toString());
                criteria.setOperation(operation.get(i).toString());
                criteria.setValue(value.get(i).toString());
                criteria.setDataOption(dataOption);
                criterias.add(criteria);
            }
            Specification<EntityData> spec = new EntityDataSpecification(criterias.get(0));
            for (int i = 1; i < criterias.size(); i++) {
                spec = spec.and(new EntityDataSpecification(criterias.get(i)));
            }

            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<EntityData> query = cb.createQuery(EntityData.class);
            Root<EntityData> root = query.from(EntityData.class);

            Predicate predicate = spec.toPredicate(root, query, cb);
            if (predicate != null) {
                query.where(predicate);
            }

            TypedQuery<EntityData> typedQuery = entityManager.createQuery(query);
            List<EntityData> result = typedQuery.getResultList();
            return result.stream().map(EntityData::getData).toList();
        } catch (Exception e) {
            System.out.println("Error during searchByJsonFields: " + e.getMessage());
            return List.of();
        }
    }
}


