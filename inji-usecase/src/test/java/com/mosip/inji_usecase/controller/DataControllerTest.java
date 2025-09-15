package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.entity.GenericEntity;
import com.mosip.inji_usecase.service.GenericCrudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

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
        Map<String, Object> data = Map.of("key", "value");

        doNothing().when(service).create(Mockito.eq(entityName), Mockito.eq(data));

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

        List<GenericEntity> entities = List.of(
                new GenericEntity(1L,entityName, data1),
                new GenericEntity(2L,entityName, data2)
        );

        when(service.readAll(entityName)).thenReturn(entities);

        mockMvc.perform(get("/api/data/" + entityName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].key1").value("value1"))
                .andExpect(jsonPath("$[1].key2").value("value2"));
    }

    @Test
    void testUpdate() throws Exception {
        String entityName = "testEntity";
        String id = "1";
        Map<String, Object> data = Map.of("key", "newValue");

        doNothing().when(service).update(entityName, id, data);

        mockMvc.perform(put("/api/data/" + entityName + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(data)))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete() throws Exception {
        String entityName = "testEntity";
        String id = "1";

        doNothing().when(service).delete(entityName, id);

        mockMvc.perform(delete("/api/data/" + entityName + "/" + id))
                .andExpect(status().isOk());
    }
}
