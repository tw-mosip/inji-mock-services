package com.mosip.inji_usecase.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosip.inji_usecase.entity.EntityData;
import com.mosip.inji_usecase.service.GenericCrudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DataController.class)
class DataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GenericCrudService service;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void testCreate() throws Exception {
        String entityName = "testEntity";
        Map<String, Object> data = new HashMap<>();
        data.put("key", "value");

        doNothing().when(service).create(entityName, data);

        mockMvc.perform(post("/api/data/" + entityName)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(data)))
                .andExpect(status().isOk());
    }

    @Test
    void testReadAll() throws Exception {
        String entityName = "testEntity";

        Map<String, Object> data1 = Map.of("key1", "value1");
        Map<String, Object> data2 = Map.of("key2", "value2");

        List<EntityData> entities = List.of(
                new EntityData("1", entityName, data1),
                new EntityData("2", entityName, data2)
        );

        when(service.readAll(entityName)).thenReturn(entities);

        mockMvc.perform(get("/api/data/" + entityName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].key1").value("value1"))
                .andExpect(jsonPath("$[1].key2").value("value2"));
    }

    @Test
    void testReadAll_NotFound() throws Exception {
        String entityName = "testEntity";

        when(service.readAll(entityName)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/data/" + entityName))
                .andExpect(status().isNotFound());
    }

    @Test
    void testReadById_Found() throws Exception {
        String entityName = "testEntity";
        String id = "1";
        Map<String, Object> data = Map.of("key", "value");

        EntityData entity = new EntityData(id, entityName, data);

        when(service.read(entityName, id)).thenReturn(entity);

        mockMvc.perform(get("/api/data/" + entityName + "/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.key").value("value"));
    }

    @Test
    void testReadById_NotFound() throws Exception {
        String entityName = "testEntity";
        String id = "1";

        when(service.read(entityName, id)).thenReturn(null);

        mockMvc.perform(get("/api/data/" + entityName + "/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdate_Found() throws Exception {
        String entityName = "testEntity";
        String id = "1";
        Map<String, Object> data = Map.of("key", "newValue");

        when(service.update(entityName, id, data)).thenReturn(true);

        mockMvc.perform(put("/api/data/" + entityName + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(data)))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdate_NotFound() throws Exception {
        String entityName = "testEntity";
        String id = "1";
        Map<String, Object> data = Map.of("key", "newValue");

        when(service.update(entityName, id, data)).thenReturn(false);

        mockMvc.perform(put("/api/data/" + entityName + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(data)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDelete_Found() throws Exception {
        String entityName = "testEntity";
        String id = "1";

        when(service.delete(entityName, id)).thenReturn(true);

        mockMvc.perform(delete("/api/data/" + entityName + "/" + id))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_NotFound() throws Exception {
        String entityName = "testEntity";
        String id = "1";

        when(service.delete(entityName, id)).thenReturn(false);

        mockMvc.perform(delete("/api/data/" + entityName + "/" + id))
                .andExpect(status().isNotFound());
    }
}
