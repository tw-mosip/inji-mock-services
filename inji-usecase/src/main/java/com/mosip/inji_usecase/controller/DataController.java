package com.mosip.inji_usecase.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mosip.inji_usecase.service.query.SearchCriteria;
import com.mosip.inji_usecase.service.query.SearchDto;
import com.mosip.inji_usecase.service.query.SpecificationBuilder;
import com.mosip.inji_usecase.service.repository.RepositoryService;
import com.mosip.inji_usecase.service.validation.ValidationService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class DataController {

    private final Map<String, ValidationService> validationServices;
    private final Map<String, RepositoryService> repositoryServices;

    @GetMapping("/api/data/{id}")
    public ResponseEntity<?> retrieveDataById(@PathVariable("id") Long id) {

        List<Map<String, Object>> result = new ArrayList<>();
        for(Map.Entry<String, RepositoryService> repository : repositoryServices.entrySet()){

            Optional<Map<String, Object>> entity = repository.getValue().getById(id);
            entity.ifPresent(object -> result.addLast(object));
        }

        if(result.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for ID: " + id);
        else return ResponseEntity.ok(result);
    }

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
        SearchDto params = new SearchDto(criterias, dataOption);
        List<Map<String, Object>> result = new ArrayList<>();
            SpecificationBuilder<?> builder = new SpecificationBuilder<>();
            List<SearchCriteria> criteriaList = params.getSearchCriteria();
            if (criteriaList != null) {
                criteriaList.forEach(x -> {
                    x.setDataOption(params
                            .getDataOption());
                    builder.with(x);
                });
            }

            for(Map.Entry<String, RepositoryService> repo : repositoryServices.entrySet()){
                try{
                    result.addAll(repo.getValue().getBySearchCriteria(builder.build()));
                } catch (Exception e){
                    System.err.println("Search failed for repository "+repo.getKey() +": " + e.getMessage());
                }
            }

        if(result.isEmpty()) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given query criteria");
        else
            return ResponseEntity.ok(result);

    }

    @PostMapping("/api/data")
    public ResponseEntity<?> ingestData(
        @RequestHeader(name = "x-source") String dataSource,
        @RequestBody Map<String, Object> data) 
    {
        ValidationService validationService = validationServices.get(dataSource + "ValidationService");
        RepositoryService repositoryService = repositoryServices.get(dataSource + "RepositoryService");
        
        if(validationService == null){
            return ResponseEntity.badRequest().body("Unknown data source: " + dataSource);
        }

        try{

            validationService.validate(data);
            repositoryService.save(data);
            return ResponseEntity.ok().build();

        }catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("VALIDATION ERROR:: '" + e.getMessage() + "'");

        }
    }

}
