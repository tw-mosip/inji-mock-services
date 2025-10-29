package com.mosip.inji_usecase.controller;

import com.mosip.inji_usecase.entity.data.EntityData;
import com.mosip.inji_usecase.service.DataService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DataController.class)
class DataControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataService dataService;

    @Test
    @DisplayName("Test create endpoint")
    void testCreate() throws Exception {
        Mockito.doNothing().when(dataService).create(anyString(), anyMap());
        mockMvc.perform(MockMvcRequestBuilders.post("/api/data/testEntity")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"key\":\"value\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Test readAll endpoint - found")
    void testReadAllFound() throws Exception {
        List<Map<String, Object>> data = List.of(Map.of("id", "1"));
        Mockito.when(dataService.readAll("testEntity")).thenReturn(data);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/data/testEntity"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    @DisplayName("Test readAll endpoint - not found")
    void testReadAllNotFound() throws Exception {
        Mockito.when(dataService.readAll("testEntity")).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/data/testEntity"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test read endpoint - found")
    void testReadFound() throws Exception {
        EntityData entityData = Mockito.mock(EntityData.class);
        Mockito.when(entityData.getData()).thenReturn(Map.of("id", "1"));
        Mockito.when(dataService.read("testEntity", "1")).thenReturn(entityData);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/data/testEntity/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    @DisplayName("Test read endpoint - not found")
    void testReadNotFound() throws Exception {
        Mockito.when(dataService.read("testEntity", "1")).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/data/testEntity/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test update endpoint - success")
    void testUpdateSuccess() throws Exception {
        Mockito.when(dataService.update(eq("testEntity"), eq("1"), anyMap())).thenReturn(true);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/data/testEntity/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"key\":\"value\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Test update endpoint - not found")
    void testUpdateNotFound() throws Exception {
        Mockito.when(dataService.update(eq("testEntity"), eq("1"), anyMap())).thenReturn(false);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/data/testEntity/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"key\":\"value\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test delete endpoint - success")
    void testDeleteSuccess() throws Exception {
        Mockito.when(dataService.delete("testEntity", "1")).thenReturn(true);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/data/testEntity/1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Test delete endpoint - not found")
    void testDeleteNotFound() throws Exception {
        Mockito.when(dataService.delete("testEntity", "1")).thenReturn(false);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/data/testEntity/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test retrieveDataByQuery endpoint - found")
    void testRetrieveDataByQueryFound() throws Exception {
        List<Map<String, Object>> results = List.of(Map.of("id", "1"));
        Mockito.when(dataService.search(anyList(), anyList(), anyList(), any())).thenReturn(results);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/data")
                .param("filterKey", "id")
                .param("operation", "eq")
                .param("value", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    @DisplayName("Test retrieveDataByQuery endpoint - not found")
    void testRetrieveDataByQueryNotFound() throws Exception {
        Mockito.when(dataService.search(anyList(), anyList(), anyList(), any())).thenReturn(Collections.emptyList());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/data")
                .param("filterKey", "id")
                .param("operation", "eq")
                .param("value", "1"))
                .andExpect(status().isNotFound());
    }
}