package com.mosip.inji_usecase.service.validation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class AbstractValidationService implements ValidationService {

    private final VerifyFieldService verifyFieldService;
    private final String configFilePath;
    private final Logger logger;

    public AbstractValidationService(VerifyFieldService verifyFieldService, String configFilePath, Logger logger) {
        this.verifyFieldService = verifyFieldService;
        this.configFilePath = configFilePath;
        this.logger = logger;
    }

    private Set<String> requiredFields;

    private Map<String, Object> fields;

    private Map<String, Object> readConfig(InputStream in) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(in, new TypeReference<Map<String, Object>>() {
            });
        } catch (IOException e) {
            logger.error("Given file is empty or invalid");
            return Collections.emptyMap();
        }
    }

    private void loadConfig() {

        try {
            InputStream in = getClass().getClassLoader().getResourceAsStream(configFilePath);
            if (in == null) {
                throw new RuntimeException("Config file not found: " + configFilePath);
            }
            Map<String, Object> config = readConfig(in);

            requiredFields = new HashSet<>((List<String>) config.get("required"));

            fields = new HashMap<>();
            Map<String, Object> f = (Map<String, Object>) config.get("fields");
            for (Map.Entry<String, Object> entry : f.entrySet()) {
                fields.put(entry.getKey(), entry.getValue());
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to load config for ValidationService", e);
        }

    }

    @Override
    public void validate(Map<String, Object> data){

        loadConfig();

        verifyFieldService.verifyRequired(data, requiredFields);
        verifyFieldService.verify(data, fields);
    }


}
