package com.mosip.inji_usecase.service.query;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDto {

    public List<SearchCriteria> searchCriteria;
    private String dataOption;

}
