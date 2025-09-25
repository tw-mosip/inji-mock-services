package com.mosip.inji_usecase.service.repository;


import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;

public interface RepositoryService<T, ID> {

    public Map<String, Object> save(Map<String, Object> obj);

    public Optional<Map<String, Object>> getById(ID id);
    
    public List<Map<String, Object>> getBySearchCriteria(Specification<T> spec);

}
