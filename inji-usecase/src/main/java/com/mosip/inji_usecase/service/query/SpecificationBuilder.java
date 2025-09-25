package com.mosip.inji_usecase.service.query;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

public class SpecificationBuilder<T> {

    private final List<SearchCriteria> params;

    public SpecificationBuilder(){
        this.params = new ArrayList<>();
    }

    public final SpecificationBuilder<T> with(String key,
            String operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }

    public final SpecificationBuilder<T> with(SearchCriteria searchCriteria) {
        params.add(searchCriteria);
        return this;
    }

    public Specification<T> build(){
        if(params.isEmpty()){
            return null;
        }

        Specification<T> result = 
                   new CriteriaSpecification<>(params.get(0));
        for (int idx = 1; idx < params.size(); idx++){
            SearchCriteria criteria = params.get(idx);
            result =  SearchOperation.getDataOption(criteria
                     .getDataOption()) == SearchOperation.ALL
                     ? result.and(new    
                       CriteriaSpecification<>(criteria))
                     : result.or(
                       new CriteriaSpecification<>(criteria));
        }
        return result;
    }

}
