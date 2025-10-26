package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.entity.EntityData;
import com.mosip.inji_usecase.service.GenericCrudService;
import com.mosip.inji_usecase.service.query.SearchCriteria;
import com.mosip.inji_usecase.service.repository.RepositoryService;
import com.mosip.inji_usecase.service.validation.ValidationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@AllArgsConstructor
@RestController
public class DataController {

    private final Map<String, ValidationService> validationServices;
    private final Map<String, RepositoryService> repositoryServices;

    private final GenericCrudService service;


    /**
     * Creates a new entity record.
     *
     * @param entityName
     * @param data
     * @param notifyUser -> query param to indicate if user notification is needed
     * @return
     */
    @PostMapping("api/data/{entityName}")
    public ResponseEntity<Void> create(@PathVariable String entityName, @RequestBody Map<String, Object> data, @RequestParam(value = "notifyUser", required = false, defaultValue = "false") boolean notifyUser) {
        System.out.println("Creating data with entity: " + entityName);
        service.create(entityName, data);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves all records of a given entity type.
     *
     * @param entityName
     * @return
     */
    @GetMapping("api/data/{entityName:[a-zA-Z]+}")
    public ResponseEntity<List<Map<String, Object>>> readAll(@PathVariable String entityName) {
        List<EntityData> entities = service.readAll(entityName);
        if (entities.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Map<String, Object>> result = entities.stream().map(EntityData::getData).toList();
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
    public ResponseEntity<Void> update(@PathVariable String entityName, @PathVariable String id, @RequestBody Map<String, Object> data) {
        boolean updated = service.update(entityName, id, data);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("api/data/{entityName}/{id}")
    public ResponseEntity<Void> delete(@PathVariable String entityName, @PathVariable String id) {
        boolean deleted = service.delete(entityName, id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/api/data")
    public ResponseEntity<?> ingestData(
            @RequestHeader(name = "x-source") String dataSource,
            @RequestBody Map<String, Object> data) {
        ValidationService validationService = validationServices.get(dataSource + "ValidationService");
        RepositoryService repositoryService = repositoryServices.get(dataSource + "RepositoryService");

        if (validationService == null) {
            return ResponseEntity.badRequest().body("Unknown data source: " + dataSource);
        }

        try {

            validationService.validate(data);
            repositoryService.save(data);
            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("VALIDATION ERROR:: '" + e.getMessage() + "'");

        }
    }

    @GetMapping("/api/data/{id:\\d+}")
    public ResponseEntity<?> retrieveDataById(@PathVariable("id") Long id) {

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, RepositoryService> repository : repositoryServices.entrySet()) {

            Optional<Map<String, Object>> entity = repository.getValue().getById(id);
            entity.ifPresent(object -> result.addLast(object));
        }

        if (result.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for ID: " + id);
        else return ResponseEntity.ok(result);
    }

    /**
     *
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
                                                @RequestParam(required = false) String dataOption){

        List<SearchCriteria> criterias = new ArrayList<>();
        for(int i = 0; i < filterKey.size(); i++){
            SearchCriteria criteria = new SearchCriteria();
            criteria.setFilterKey(filterKey.get(i).toString());
            criteria.setOperation(operation.get(i).toString());
            criteria.setValue(value.get(i).toString());
            criteria.setDataOption(dataOption);
            criterias.add(criteria);
        }
        List<Map<String, Object>> results = service.search(criterias);

        if(results.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given query criteria");
        else {
            return ResponseEntity.ok(results);
        }
    }
}
