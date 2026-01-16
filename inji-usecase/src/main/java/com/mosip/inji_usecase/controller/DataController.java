package com.mosip.inji_usecase.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.config.EmailTemplateProperties;
import com.mosip.inji_usecase.service.query.SearchCriteria;
import com.mosip.inji_usecase.service.query.SearchDto;
import com.mosip.inji_usecase.service.query.SpecificationBuilder;
import com.mosip.inji_usecase.service.repository.RepositoryService;
import com.mosip.inji_usecase.service.validation.ValidationService;
import com.mosip.inji_usecase.service.EmailService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class DataController {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataController.class);

    private final Map<String, ValidationService> validationServices;
    private final Map<String, RepositoryService> repositoryServices;
    private final EmailService emailService;
    private final EmailTemplateProperties templateProperties;

    @GetMapping("/api/data/{id}")
    public ResponseEntity<?> retrieveDataById(@PathVariable("id") Long id) {

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, RepositoryService> repository : repositoryServices.entrySet()) {

            Optional<Map<String, Object>> entity = repository.getValue().getById(id);
            entity.ifPresent(object -> result.addLast(object));
        }

        if (result.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for ID: " + id);
        else
            return ResponseEntity.ok(result);
    }

    @GetMapping("/api/data")
    public ResponseEntity<?> retrieveDataByQuery(@RequestParam List filterKey,
            @RequestParam List operation,
            @RequestParam List value,
            @RequestParam(required = false) String dataOption) {

        List<SearchCriteria> criterias = new ArrayList<>();
        for (int i = 0; i < filterKey.size(); i++) {
            SearchCriteria criteria = new SearchCriteria();
            criteria.setFilterKey(filterKey.get(i).toString());
            criteria.setOperation(operation.get(i).toString());
            criteria.setValue(value.get(i).toString());
            criteria.setDataOption(dataOption);
            criterias.add(criteria);
        }
        SearchDto params = new SearchDto(criterias, dataOption);
        List<Map<String, Object>> result = new ArrayList<>();
        SpecificationBuilder<?> builder = new SpecificationBuilder<>();
        List<SearchCriteria> criteriaList = params.getSearchCriteria();
        if (criteriaList != null) {
            criteriaList.forEach(x -> {
                x.setDataOption(params.getDataOption());
                builder.with(x);
            });
        }

        for (Map.Entry<String, RepositoryService> repo : repositoryServices.entrySet()) {
            try {
                result.addAll(repo.getValue().getBySearchCriteria(builder.build()));
            } catch (Exception e) {
                LOGGER.error("Search failed for repository {}: {}", repo.getKey(), e.getMessage(), e);
            }
        }

        if (result.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given query criteria");
        else
            return ResponseEntity.ok(result);

    }

    @PostMapping("/api/data")
    public ResponseEntity<?> ingestData(
            @RequestHeader(name = "x-source") String dataSource,
            @RequestParam(required = false) String notifyEmail,
            @RequestBody Map<String, Object> data) {

        ValidationService validationService = validationServices.get(dataSource + "ValidationService");
        RepositoryService repositoryService = repositoryServices.get(dataSource + "RepositoryService");

        if (validationService == null) {
            return ResponseEntity.badRequest().body("Unknown data source: " + dataSource);
        }

        try {
            validationService.validate(data);
            repositoryService.save(data);

            // ---------- PRODUCT-DRIVEN RECIPIENT RESOLUTION (NO HARDCODED PRODUCT NAMES)
            // ----------
            String productKey = normalizeKey(dataSource);

            // 1) notifyEmail query param has highest priority
            String recipient = (notifyEmail != null && !notifyEmail.trim().isEmpty()) ? notifyEmail.trim() : null;

            // 2) If notifyEmail not provided, try configured product emailField
            if (recipient == null) {
                String configuredEmailField = templateProperties.getProductConfigValue(productKey, "emailField");
                if (configuredEmailField != null && !configuredEmailField.isBlank()) {
                    Object emailObj = readFromPayload(configuredEmailField, data);
                    if (emailObj != null)
                        recipient = emailObj.toString().trim();
                }
            }

            // If no recipient found via config or query, skip sending (no hardcoded checks)
            if (recipient == null || recipient.isBlank()) {
                LOGGER.warn("No valid recipient found; skipping email trigger for product: {}", productKey);
                return ResponseEntity.ok().build();
            }

            // ---------- TEMPLATE SELECTION ----------
            // product-level template mapping
            String templateKey = templateProperties.getProductConfigValue(productKey, "template");
            if (templateKey == null || templateKey.isBlank()) {
                templateKey = productKey == null || productKey.isBlank() ? "generic" : productKey;
            }

            // subject: product-level inline subject takes precedence
            String inlineSubject = templateProperties.getProductConfigValue(productKey, "subject");
            String subjectTemplate;
            if (inlineSubject != null && !inlineSubject.isBlank()) {
                subjectTemplate = inlineSubject;
            } else {
                subjectTemplate = templateProperties.getSubjects()
                        .getOrDefault(templateKey,
                                templateProperties.getSubjects().getOrDefault("generic", "Data Received"));
            }

            // body template lookup
            String bodyTemplate = templateProperties.getTemplates()
                    .getOrDefault(templateKey, templateProperties.getTemplates().getOrDefault("generic",
                            "Hello,\n\nYour data has been recorded.\n\nRegards,\nTeam"));

            // placeholder defaults for this product (optional)
            Map<String, String> productDefaults = templateProperties.getPlaceholderDefaults().get(productKey);

            // fill placeholders in subject and body using payload + defaults
            String filledSubject = fillTemplate(subjectTemplate, data, productDefaults);
            String filledBody = fillTemplate(bodyTemplate, data, productDefaults);

            // Do NOT log recipient or filled templates (sensitive). Only generic info:
            LOGGER.info("Email triggered for product '{}' (sending)", productKey);

            // send async
            final String toFinal = recipient;
            final String subjectFinal = filledSubject;
            final String bodyFinal = filledBody;

            java.util.concurrent.CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendEmail(toFinal, subjectFinal, bodyFinal);
                } catch (Exception e) {
                    LOGGER.error("Failed to send notification email (non-sensitive error).", e);
                }
            });

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("VALIDATION ERROR:: '" + e.getMessage() + "'");
        }
    }

    // ---------- Utilities ----------

    /**
     * Normalize header / product key: keep only letters/digits/underscore/hyphen,
     * lower-case.
     */
    private String normalizeKey(String raw) {
        if (raw == null)
            return "";
        return raw.trim().replaceAll("[^a-zA-Z0-9_\\-]", "").toLowerCase();
    }

    /**
     * Read a (possibly nested) property from the payload map.
     * Supports keys like "driver.email" to traverse nested maps.
     */
    @SuppressWarnings("unchecked")
    private Object readFromPayload(String key, Map<String, Object> payload) {
        if (key == null || key.isBlank() || payload == null)
            return null;
        if (!key.contains(".")) {
            return payload.get(key);
        }
        String[] parts = key.split("\\.");
        Object cur = payload;
        for (String part : parts) {
            if (!(cur instanceof Map))
                return null;
            Map<String, Object> curMap = (Map<String, Object>) cur;
            cur = curMap.get(part);
            if (cur == null)
                return null;
        }
        return cur;
    }

    /**
     * Fill template placeholders using payload and optional defaults map.
     * Placeholders are {{key}} where key may be nested like driver.email
     */
    @SuppressWarnings("unchecked")
    private String fillTemplate(String template, Map<String, Object> payload, Map<String, String> defaults) {
        if (template == null)
            return "";
        Pattern p = Pattern.compile("\\{\\{\\s*([a-zA-Z0-9_\\.\\-]+)\\s*\\}\\}");
        Matcher m = p.matcher(template);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            String key = m.group(1);
            String replacement = "";

            // product-level default map
            if (defaults != null && defaults.containsKey(key)) {
                replacement = defaults.get(key);
            } else {
                Object val = readFromPayload(key, payload);
                if (val != null)
                    replacement = val.toString();
            }

            // escape for regex replacement
            replacement = replacement.replace("\\", "\\\\").replace("$", "\\$");
            m.appendReplacement(sb, replacement);
        }
        m.appendTail(sb);
        return sb.toString();
    }
}
