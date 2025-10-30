package com.mosip.inji_usecase.entity.data;


import com.mosip.inji_usecase.service.validation.VerifyFieldService;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class EntityMetadataService {
    private final Map<String, Map<String, Object>> entities = new HashMap<>();
    private final VerifyFieldService verifyFieldService;


    public EntityMetadataService(List<Map<String, Object>> entityConfigs) {
        for (Map<String, Object> config : entityConfigs) {
            String entityName = (String) config.get("name");
            entities.put(entityName, config);
        }
        this.verifyFieldService = new VerifyFieldService();
    }

    public Map<String, Object> getEntityConfig(String entityName) {
        return entities.get(entityName);
    }

    public String getEmailSource(String entityName) {
        Map<String, Object> config = getEntityConfig(entityName);
        if (config != null && config.containsKey("emailSource")) {
            return (String) config.get("emailSource");
        }
        return null;
    }

    public boolean validate(String entityName, Map<String, Object> data) {
        Map<String, Object> config = entities.get(entityName);
        verifyFieldService.verifyRequired(data, new HashSet<>((List<String>) config.get("required")));
        verifyFieldService.verify(data, (Map<String, Object>) config.get("fields"));

        return true;
    }
}
