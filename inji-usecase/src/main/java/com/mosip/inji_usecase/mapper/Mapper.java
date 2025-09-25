package com.mosip.inji_usecase.mapper;

import java.util.Map;


public interface Mapper<T, D> {
    D toDto(T entity);

    T toEntity(D dto);

    D toDto(Map<String, Object> map);

    Map<String, Object> toMap(D dto);
}