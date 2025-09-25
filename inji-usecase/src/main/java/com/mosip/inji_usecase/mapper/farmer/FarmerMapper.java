package com.mosip.inji_usecase.mapper.farmer;

import java.util.Map;

import org.mapstruct.Mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.farmer.FarmerDto;
import com.mosip.inji_usecase.entity.farmer.Farmer;
import com.mosip.inji_usecase.mapper.MappingUtils;


@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface FarmerMapper extends com.mosip.inji_usecase.mapper.Mapper<Farmer, FarmerDto> {

    @Override
    FarmerDto toDto(Farmer entity);

    @Override
    Farmer toEntity(FarmerDto dto);

    @Override
    FarmerDto toDto(Map<String, Object> map);

    @Override
    default Map<String, Object> toMap(FarmerDto dto) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(dto, new TypeReference<Map<String, Object>>() {});
    }
}