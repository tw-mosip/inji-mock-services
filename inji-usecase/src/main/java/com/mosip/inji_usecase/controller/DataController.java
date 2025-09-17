package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.entity.EntityData;
import com.mosip.inji_usecase.service.GenericCrudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/data")
public class DataController {

    private final GenericCrudService service;

    public DataController(GenericCrudService service) {
        this.service = service;
    }

    @PostMapping("/{entityName}")
    public ResponseEntity<Void> create(@PathVariable String entityName, @RequestBody Map<String, Object> data) {
        service.create(entityName, data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{entityName}")
    public ResponseEntity<List<Map<String, Object>>> readAll(@PathVariable String entityName) {
        List<EntityData> entities = service.readAll(entityName);
        if (entities.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Map<String, Object>> result = entities.stream().map(EntityData::getData).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{entityName}/{id}")
    public ResponseEntity<EntityData> read(@PathVariable String entityName, @PathVariable String id) {
        EntityData entity = service.read(entityName, id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entity);
    }

    @PutMapping("/{entityName}/{id}")
    public ResponseEntity<Void> update(@PathVariable String entityName, @PathVariable String id, @RequestBody Map<String, Object> data) {
        boolean updated = service.update(entityName, id, data);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{entityName}/{id}")
    public ResponseEntity<Void> delete(@PathVariable String entityName, @PathVariable String id) {
        boolean deleted = service.delete(entityName, id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}

