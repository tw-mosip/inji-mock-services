package com.mosip.inji_usecase.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "mosip.inji-usecase")
public class EmailTemplateProperties {

    private Map<String, String> templates = new HashMap<>();

    private Map<String, String> subjects = new HashMap<>();

    private Map<String, Map<String, String>> products = new HashMap<>();

    private Map<String, Map<String, String>> placeholderDefaults = new HashMap<>();

    /**
     * Helper to fetch a specific product config key (safe lookup).
     * 
     * @param productKey normalized product name
     * @param key        the key to look up (like "emailField" or "template")
     * @return value if found, else null
     */
    public String getProductConfigValue(String productKey, String key) {
        if (productKey == null || key == null)
            return null;
        Map<String, String> productConfig = products.get(productKey);
        if (productConfig == null)
            return null;
        return productConfig.get(key);
    }
}
