package com.mosip.inji_usecase.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

class MappingUtilsTest {

    @Test
    void testMapToString() {
        assertEquals("hello", MappingUtils.mapToString("hello"));
        assertEquals("123", MappingUtils.mapToString(123));
        assertEquals("123.45", MappingUtils.mapToString(123.45));
        assertNull(MappingUtils.mapToString(null));
    }

    @Test
    void testMapToLong() {
        assertEquals(123L, MappingUtils.mapToLong(123L));
        assertEquals(456L, MappingUtils.mapToLong(456));
        assertEquals(789L, MappingUtils.mapToLong("789"));
        assertNull(MappingUtils.mapToLong("abc"));
        assertNull(MappingUtils.mapToLong(null));
    }

    @Test
    void testMapToInteger() {
        assertEquals(123, MappingUtils.mapToInteger(123));
        assertEquals(456, MappingUtils.mapToInteger(456L));
        assertEquals(789, MappingUtils.mapToInteger("789"));
        assertNull(MappingUtils.mapToInteger("xyz"));
        assertNull(MappingUtils.mapToInteger(null));
        assertNull(MappingUtils.mapToInteger("123.45")); // Should not parse float string
    }
}