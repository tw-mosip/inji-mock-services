package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.entity.data.EntityData;
import com.mosip.inji_usecase.service.DataService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyList;

@AllArgsConstructor
@RestController
public class DataController {
    private final DataService service;


    /**
     * Creates a new entity record.
     *
     * @param entityName
     * @param data
     * @param notifyUser -> query param to indicate if user notification is needed
     * @return
     */
    @PostMapping("api/data/{entityName}")
    public ResponseEntity<? extends Object> create(@PathVariable String entityName, @RequestBody Map<String, Object> data, @RequestParam(value = "notifyUser", required = false, defaultValue = "false") boolean notifyUser) {
        try {
            service.create(entityName, data);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("VALIDATION ERROR: " + e.getMessage());
        }
    }

    /**
     * Retrieves all records of a given entity type.
     *
     * @param entityName
     * @return
     */
    @GetMapping("api/data/{entityName:[a-zA-Z]+}")
    public ResponseEntity<List<Map<String, Object>>> readAll(@PathVariable String entityName) {
        List<Map<String, Object>> result = service.readAll(entityName);

        if (result == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(emptyList());

        return ResponseEntity.ok(result);
    }

    /**
     * Retrieves record of a given entity type.
     *
     * @param entityName
     * @return
     */
    @GetMapping("api/data/{entityName}/{id}")
    public ResponseEntity<Object> read(@PathVariable String entityName, @PathVariable String id) {
        EntityData entity = service.read(entityName, id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entity.getData());
    }

    @PutMapping("api/data/{entityName}/{id}")
    public ResponseEntity<String> update(@PathVariable String entityName, @PathVariable String id, @RequestBody Map<String, Object> data) {
        try {
            boolean updated = service.update(entityName, id, data);
            return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("VALIDATION ERROR: " + e.getMessage());
        }
    }

    @DeleteMapping("api/data/{entityName}/{id}")
    public ResponseEntity<Void> delete(@PathVariable String entityName, @PathVariable String id) {
        boolean deleted = service.delete(entityName, id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /**
     * @param filterKey
     * @param operation
     * @param value
     * @param dataOption - ALL : all conditions are matched (or) partial condition match is applied
     * @return
     */
    @GetMapping("/api/data")
    public ResponseEntity<?> retrieveDataByQuery(@RequestParam List filterKey,
                                                 @RequestParam List operation,
                                                 @RequestParam List value,
                                                 @RequestParam(required = false) String dataOption) {

        List<Map<String, Object>> results = service.search(filterKey, operation, value, dataOption);

        if (results.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given query criteria");
        else {
            return ResponseEntity.ok(results);
        }
    }
}
