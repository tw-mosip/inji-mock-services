package com.mosip.inji_usecase.mapper.truckpass;

import java.util.Map;
import org.mapstruct.Mapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.dto.truckpass.DriverDto;
import com.mosip.inji_usecase.entity.truckpass.Driver;
import com.mosip.inji_usecase.mapper.MappingUtils;

@Mapper(componentModel = "spring", uses = MappingUtils.class)
public interface DriverMapper extends com.mosip.inji_usecase.mapper.Mapper<Driver, DriverDto> {

    @Override
    DriverDto toDto(Driver entity);

    @Override
    Driver toEntity(DriverDto dto);

    @Override
    DriverDto toDto(Map<String, Object> map);

    @Override
    default Map<String, Object> toMap(DriverDto dto) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(dto, new TypeReference<Map<String, Object>>() {});
    }
}
