package com.mosip.inji_usecase.service.validation;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class VerifyFieldServiceTest {

    @Test
    public void testVerifyRequired_AllFieldsPresent() {
        VerifyFieldService service = new VerifyFieldService();
        Map<String, Object> data = Map.of("name", "John", "age", 30);
        Set<String> required = Set.of("name", "age");
        assertDoesNotThrow(() -> service.verifyRequired(data, required));
    }

    @Test
    public void testVerifyRequired_MissingField() {
        VerifyFieldService service = new VerifyFieldService();
        Map<String, Object> data = Map.of("name", "John");
        Set<String> required = Set.of("name", "age");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyRequired(data, required));
        assertTrue(ex.getMessage().contains("Missing required field: age"));
    }

    @Test
    public void testVerifyType_StringTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "value");
        assertDoesNotThrow(() -> service.verifyType(entry, "string"));
    }

    @Test
    public void testVerifyType_StringTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 123);
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "string"));
        assertTrue(ex.getMessage().contains("must be a string"));
    }

    @Test
    public void testVerifyType_IntegerTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 123);
        assertDoesNotThrow(() -> service.verifyType(entry, "integer"));
    }

    @Test
    public void testVerifyType_IntegerTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "notInt");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "integer"));
        assertTrue(ex.getMessage().contains("must be an integer"));
    }

    @Test
    public void testVerifyType_FloatTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 1.23f);
        assertDoesNotThrow(() -> service.verifyType(entry, "float"));
    }

    @Test
    public void testVerifyType_FloatTypeValidDouble() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 1.23d);
        assertDoesNotThrow(() -> service.verifyType(entry, "float"));
    }

    @Test
    public void testVerifyType_FloatTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "notFloat");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "float"));
        assertTrue(ex.getMessage().contains("must be a float"));
    }

    @Test
    public void testVerifyType_BooleanTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", true);
        assertDoesNotThrow(() -> service.verifyType(entry, "boolean"));
    }

    @Test
    public void testVerifyType_BooleanTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "true");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "boolean"));
        assertTrue(ex.getMessage().contains("must be a boolean"));
    }

    @Test
    public void testVerifyType_ArrayTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", List.of(1, 2, 3));
        assertDoesNotThrow(() -> service.verifyType(entry, "array"));
    }

    @Test
    public void testVerifyType_ArrayTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "notArray");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "array"));
        assertTrue(ex.getMessage().contains("must be an array"));
    }

    @Test
    public void testVerifyType_DateTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "2024-06-01");
        assertDoesNotThrow(() -> service.verifyType(entry, "date"));
    }

    @Test
    public void testVerifyType_DateTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 123);
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "date"));
        assertTrue(ex.getMessage().contains("must be a date"));
    }

    @Test
    public void testVerifyType_ObjectTypeValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", Map.of("key", "value"));
        assertDoesNotThrow(() -> service.verifyType(entry, "object"));
    }

    @Test
    public void testVerifyType_ObjectTypeInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "notObject");
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyType(entry, "object"));
        assertTrue(ex.getMessage().contains("must be an object"));
    }

    @Test
    public void testVerifyLength_StringMinValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "abcd");
        assertDoesNotThrow(() -> service.verifyLength(entry, 2, VerifyFieldService.LengthConstraintType.MIN));
    }

    @Test
    public void testVerifyLength_StringMinInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "a");
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyLength(entry, 2, VerifyFieldService.LengthConstraintType.MIN));
        assertTrue(ex.getMessage().contains("failed length validation for string"));
    }

    @Test
    public void testVerifyLength_StringMaxValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "abc");
        assertDoesNotThrow(() -> service.verifyLength(entry, 5, VerifyFieldService.LengthConstraintType.MAX));
    }

    @Test
    public void testVerifyLength_StringMaxInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "abcdef");
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyLength(entry, 5, VerifyFieldService.LengthConstraintType.MAX));
        assertTrue(ex.getMessage().contains("failed length validation for string"));
    }

    @Test
    public void testVerifyLength_IntegerMinValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 10);
        assertDoesNotThrow(() -> service.verifyLength(entry, 5, VerifyFieldService.LengthConstraintType.MIN));
    }

    @Test
    public void testVerifyLength_IntegerMinInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 2);
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyLength(entry, 5, VerifyFieldService.LengthConstraintType.MIN));
        assertTrue(ex.getMessage().contains("failed length validation for integer/long"));
    }

    @Test
    public void testVerifyLength_FloatMaxValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 3.5f);
        assertDoesNotThrow(() -> service.verifyLength(entry, 5, VerifyFieldService.LengthConstraintType.MAX));
    }

    @Test
    public void testVerifyLength_FloatMaxInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", 6.5f);
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyLength(entry, 5, VerifyFieldService.LengthConstraintType.MAX));
        assertTrue(ex.getMessage().contains("failed length validation for float/double"));
    }

    @Test
    public void testVerifyLength_ArrayMinValid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", List.of(1, 2, 3));
        assertDoesNotThrow(() -> service.verifyLength(entry, 2, VerifyFieldService.LengthConstraintType.MIN));
    }

    @Test
    public void testVerifyLength_ArrayMinInvalid() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", List.of(1));
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyLength(entry, 2, VerifyFieldService.LengthConstraintType.MIN));
        assertTrue(ex.getMessage().contains("failed length validation for array"));
    }

    @Test
    public void testVerifyFormat_ValidPattern() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("email", "test@example.com");
        String pattern = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
        assertDoesNotThrow(() -> service.verifyFormat(entry, pattern));
    }

    @Test
    public void testVerifyFormat_InvalidPattern() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("email", "invalid-email");
        String pattern = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.verifyFormat(entry, pattern));
        assertTrue(ex.getMessage().contains("does not match pattern"));
    }

    @Test
    public void testVerifyConditional_AllConditionalsPresent() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "value");
        Set<String> keys = Set.of("field", "cond1", "cond2");
        assertDoesNotThrow(() -> service.verifyConditional(entry, keys, List.of("cond1", "cond2")));
    }

    @Test
    public void testVerifyConditional_MissingConditional() {
        VerifyFieldService service = new VerifyFieldService();
        Map.Entry<String, Object> entry = Map.entry("field", "value");
        Set<String> keys = Set.of("field", "cond1");
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyConditional(entry, keys, List.of("cond1", "cond2")));
        assertTrue(ex.getMessage().contains("requires field(s)"));
    }

}