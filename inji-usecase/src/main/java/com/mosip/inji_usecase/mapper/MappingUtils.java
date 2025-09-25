package com.mosip.inji_usecase.mapper;

public class MappingUtils {

    public static String mapToString(Object value) {
        return value == null ? null : value.toString();
    }

    public static Long mapToLong(Object value) {
        if (value == null)
            return null;
        if (value instanceof Number number)
            return number.longValue();
        try {
            return Long.valueOf(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static Integer mapToInteger(Object value) {
        if (value == null)
            return null;
        if (value instanceof Number number)
            return number.intValue();
        try {
            return Integer.valueOf(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

}
