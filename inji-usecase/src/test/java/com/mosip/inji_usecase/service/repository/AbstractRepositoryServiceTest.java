package com.mosip.inji_usecase.service.repository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.mosip.inji_usecase.mapper.Mapper;

@ExtendWith(MockitoExtension.class)
class AbstractRepositoryServiceTest {

    // Helper classes for testing the generic abstract class
    private static class DummyEntity {}
    private static class DummyDto {}
    private static class DummyId {}

    private interface DummyRepository extends JpaRepository<DummyEntity, DummyId>, JpaSpecificationExecutor<DummyEntity> {}

    private static class ConcreteRepositoryService extends AbstractRepositoryService<DummyEntity, DummyDto, DummyId, DummyRepository, Mapper<DummyEntity, DummyDto>> {
        public ConcreteRepositoryService(DummyRepository repository, Mapper<DummyEntity, DummyDto> mapper) {
            super(repository, mapper);
        }
    }

    @Mock
    private DummyRepository mockRepository;

    @Mock
    private Mapper<DummyEntity, DummyDto> mockMapper;

    private ConcreteRepositoryService service;

    @BeforeEach
    void setUp() {
        service = new ConcreteRepositoryService(mockRepository, mockMapper);
    }

    @Test
    void testSave() {
        // Arrange
        Map<String, Object> inputMap = Map.of("key", "value");
        DummyDto dummyDto = new DummyDto();
        DummyEntity dummyEntity = new DummyEntity();
        Map<String, Object> expectedMap = Map.of("id", "123");

        when(mockMapper.toDto(inputMap)).thenReturn(dummyDto);
        when(mockMapper.toEntity(dummyDto)).thenReturn(dummyEntity);
        when(mockRepository.save(dummyEntity)).thenReturn(dummyEntity);
        when(mockMapper.toMap(dummyDto)).thenReturn(expectedMap);

        // Act
        Map<String, Object> result = service.save(inputMap);

        // Assert
        assertNotNull(result);
        assertEquals(expectedMap, result);

        verify(mockMapper).toDto(inputMap);
        verify(mockMapper).toEntity(dummyDto);
        verify(mockRepository).save(dummyEntity);
        verify(mockMapper).toMap(dummyDto);
    }

    @Test
    void testGetById_WhenFound() {
        // Arrange
        DummyId id = new DummyId();
        DummyEntity dummyEntity = new DummyEntity();
        DummyDto dummyDto = new DummyDto();
        Map<String, Object> expectedMap = Map.of("id", "123");

        when(mockRepository.findById(id)).thenReturn(Optional.of(dummyEntity));
        when(mockMapper.toDto(dummyEntity)).thenReturn(dummyDto);
        when(mockMapper.toMap(dummyDto)).thenReturn(expectedMap);

        // Act
        Optional<Map<String, Object>> result = service.getById(id);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(expectedMap, result.get());

        verify(mockRepository).findById(id);
        verify(mockMapper).toDto(dummyEntity);
        verify(mockMapper).toMap(dummyDto);
    }

    @Test
    void testGetById_WhenNotFound() {
        // Arrange
        DummyId id = new DummyId();
        when(mockRepository.findById(id)).thenReturn(Optional.empty());

        // Act
        Optional<Map<String, Object>> result = service.getById(id);

        // Assert
        assertTrue(result.isEmpty());

        verify(mockRepository).findById(id);
        verify(mockMapper, never()).toDto(any(DummyEntity.class));
        verify(mockMapper, never()).toMap(any(DummyDto.class));
    }

    @Test
    void testGetBySearchCriteria_WhenResultsFound() {
        // Arrange
        Specification<DummyEntity> spec = mock(Specification.class);
        DummyEntity entity1 = new DummyEntity();
        DummyEntity entity2 = new DummyEntity();
        List<DummyEntity> entityList = Arrays.asList(entity1, entity2);

        DummyDto dto1 = new DummyDto();
        DummyDto dto2 = new DummyDto();
        Map<String, Object> map1 = Map.of("id", "1");
        Map<String, Object> map2 = Map.of("id", "2");

        when(mockRepository.findAll(spec)).thenReturn(entityList);
        when(mockMapper.toDto(entity1)).thenReturn(dto1);
        when(mockMapper.toMap(dto1)).thenReturn(map1);
        when(mockMapper.toDto(entity2)).thenReturn(dto2);
        when(mockMapper.toMap(dto2)).thenReturn(map2);

        // Act
        List<Map<String, Object>> result = service.getBySearchCriteria(spec);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.containsAll(Arrays.asList(map1, map2)));

        verify(mockRepository).findAll(spec);
        verify(mockMapper, times(2)).toDto(any(DummyEntity.class));
        verify(mockMapper, times(2)).toMap(any(DummyDto.class));
    }

    @Test
    void testGetBySearchCriteria_WhenNoResults() {
        // Arrange
        Specification<DummyEntity> spec = mock(Specification.class);
        when(mockRepository.findAll(spec)).thenReturn(Collections.emptyList());

        // Act
        List<Map<String, Object>> result = service.getBySearchCriteria(spec);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(mockRepository).findAll(spec);
        verify(mockMapper, never()).toDto(any(DummyEntity.class));
        verify(mockMapper, never()).toMap(any(DummyDto.class));
    }
}