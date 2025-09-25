package com.mosip.inji_usecase.service.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public abstract class AbstractRepositoryService <T, D, ID, R extends JpaRepository<T, ID> & JpaSpecificationExecutor<T>, M extends com.mosip.inji_usecase.mapper.Mapper<T, D>> implements RepositoryService<T, ID>{

    protected final R repository;
    protected final M mapper;

    public AbstractRepositoryService(R repository, M mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Map<String, Object> save(Map<String, Object> obj) {
        D dto = mapper.toDto(obj);
        T entity = mapper.toEntity(dto);
        repository.save(entity);
        return mapper.toMap(dto);
    }

    @Override
    public Optional<Map<String, Object>> getById(ID id) {

        Optional<T> obj = repository.findById(id);
        return obj
                .map(entity -> {
                    D Dto = mapper.toDto(entity);
                    return mapper.toMap(Dto);
                });
    }

    @Override
    public List<Map<String, Object>> getBySearchCriteria(Specification<T> spec) {
        List<Map<String, Object>> result = new ArrayList<>();
        repository.findAll(spec).forEach((element) -> {
            D dto = mapper.toDto(element);
            Map<String, Object> obj = mapper.toMap(dto);
            result.add(obj);
        });
        return result;
    }

}