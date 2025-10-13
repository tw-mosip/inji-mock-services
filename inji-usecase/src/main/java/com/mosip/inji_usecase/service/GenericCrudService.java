package com.mosip.inji_usecase.service;

import com.mosip.inji_usecase.entity.EntityData;
import com.mosip.inji_usecase.entity.EntityMetadata;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class GenericCrudService {

    private final EntityManager entityManager;
    private final EntityMetadata entityMetadata;

    public GenericCrudService(EntityManager entityManager, EntityMetadata entityMetadata) {
        this.entityManager = entityManager;
        this.entityMetadata = entityMetadata;
    }

    @Transactional
    public void create(String entityName, Map<String, Object> data) {
        if (!entityMetadata.validate(entityName, data)) {
            throw new IllegalArgumentException("Invalid data for entity: " + entityName);
        }

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
    public List<EntityData> readAll(String entityName) {
        return entityManager.createQuery("SELECT e FROM GenericEntity e WHERE e.entityType = :entityType", EntityData.class)
                .setParameter("entityType", entityName)
                .getResultList();
    }

    @Transactional(readOnly = true)
    public EntityData read(String entityName, String id) {
        try {
            return entityManager.createQuery(
                            "SELECT e FROM GenericEntity e WHERE e.entityType = :entityType and e.id = :id",
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

}


