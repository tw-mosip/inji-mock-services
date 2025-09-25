package com.mosip.inji_usecase.mapper.farmer;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.mosip.inji_usecase.dto.farmer.FarmerDto;
import com.mosip.inji_usecase.entity.farmer.Farmer;

class FarmerMapperTest {

    private FarmerMapper farmerMapper;

    @BeforeEach
    void setUp() {
        farmerMapper = Mappers.getMapper(FarmerMapper.class);
    }

    @Test
    void testToDto_fromEntity() {
        // Arrange
        Farmer entity = createSampleFarmerEntity();

        // Act
        FarmerDto dto = farmerMapper.toDto(entity);

        // Assert
        assertNotNull(dto);
        assertEquals(entity.getId(), dto.getId());
        assertEquals(entity.getName(), dto.getName());
        assertEquals(entity.getPin_code(), dto.getPin_code());
        assertEquals(entity.getEmail(), dto.getEmail());
        assertEquals(entity.getPrimary_crop(), dto.getPrimary_crop());
    }

    @Test
    void testToEntity_fromDto() {
        // Arrange
        FarmerDto dto = createSampleFarmerDto();

        // Act
        Farmer entity = farmerMapper.toEntity(dto);

        // Assert
        assertNotNull(entity);
        assertEquals(dto.getId(), entity.getId());
        assertEquals(dto.getName(), entity.getName());
        assertEquals(dto.getPin_code(), entity.getPin_code());
        assertEquals(dto.getEmail(), entity.getEmail());
        assertEquals(dto.getPrimary_crop(), entity.getPrimary_crop());
    }

    @Test
    void testToMap_fromDto() {
        // Arrange
        FarmerDto dto = createSampleFarmerDto();

        // Act
        Map<String, Object> map = farmerMapper.toMap(dto);

        // Assert
        assertNotNull(map);
        assertEquals(dto.getId(), map.get("id"));
        assertEquals(dto.getName(), map.get("name"));
        assertEquals(dto.getPin_code(), map.get("pin_code"));
        assertEquals(dto.getEmail(), map.get("email"));
        assertFalse(map.containsKey("nonExistentField"));
    }

    @Test
    void testToDto_fromMap() {
        // Arrange
        FarmerDto originalDto = createSampleFarmerDto();
        Map<String, Object> map = farmerMapper.toMap(originalDto);

        // Act
        FarmerDto newDto = farmerMapper.toDto(map);

        // Assert
        assertNotNull(newDto);
        assertEquals(originalDto.getId(), newDto.getId());
        assertEquals(originalDto.getName(), newDto.getName());
        assertEquals(originalDto.getPin_code(), newDto.getPin_code());
        assertEquals(originalDto.getEmail(), newDto.getEmail());
    }

    private Farmer createSampleFarmerEntity() {
        Farmer entity = new Farmer();
        entity.setId(1L);
        entity.setName("John Farmer");
        entity.setEmail("john.farmer@example.com");
        entity.setPin_code(560001);
        entity.setVillage("Testville");
        entity.setPrimary_crop("Wheat");
        entity.setTotal_land_area(100);
        return entity;
    }

    private FarmerDto createSampleFarmerDto() {
        FarmerDto dto = new FarmerDto();
        dto.setId(1L);
        dto.setName("John Farmer");
        dto.setEmail("john.farmer@example.com");
        dto.setPin_code(560001);
        dto.setVillage("Testville");
        dto.setPrimary_crop("Wheat");
        dto.setTotal_land_area(100);
        return dto;
    }
}