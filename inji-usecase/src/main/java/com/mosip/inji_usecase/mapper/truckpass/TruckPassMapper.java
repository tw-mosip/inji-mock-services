package com.mosip.inji_usecase.mapper.truckpass;

import java.util.Map;
import org.mapstruct.Mapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.truckpass.TruckPassDto;
import com.mosip.inji_usecase.entity.truckpass.TruckPass;
import com.mosip.inji_usecase.mapper.MappingUtils;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface TruckPassMapper extends com.mosip.inji_usecase.mapper.Mapper<TruckPass, TruckPassDto> {

    @Override
    TruckPassDto toDto(TruckPass entity);

    @Override
    TruckPass toEntity(TruckPassDto dto);

    @Override
    TruckPassDto toDto(Map<String, Object> map);

    @Override
    default Map<String, Object> toMap(TruckPassDto dto) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(dto, new TypeReference<Map<String, Object>>() {});
    }
}
