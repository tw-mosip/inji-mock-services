package com.mosip.inji_usecase.entity;


import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EntityMetadata {
    private final Map<String, Map<String, Object>> entities = new HashMap<>();

    public EntityMetadata(List<Map<String, Object>> entityConfigs) {
        for (Map<String, Object> config : entityConfigs) {
            String entityName = (String) config.get("name");
            entities.put(entityName, config);
        }
    }

    public Map<String, Object> getEntityConfig(String entityName) {
        return entities.get(entityName);
    }

    public boolean validate(String entityName, Map<String, Object> data) {
        Map<String, Object> config = entities.get(entityName);
        if (config == null) {
            return false;
        }
        List<Map<String, String>> fields = (List<Map<String, String>>) config.get("fields");
        for (Map<String, String> field : fields) {
            String fieldName = field.get("name");
            String fieldType = field.get("type");
            boolean isPrimaryKey = Boolean.parseBoolean(String.valueOf(field.getOrDefault("primary_key", "false")));

            if (!isPrimaryKey && data.containsKey(fieldName)) {
                Object value = data.get(fieldName);
                if (!isValidType(value, fieldType)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isValidType(Object value, String type) {
        if (value == null) return true;
        return switch (type) {
            case "string" -> value instanceof String;
            case "long" -> value instanceof Long || value instanceof Integer;
            default -> true;
        };
    }
}
