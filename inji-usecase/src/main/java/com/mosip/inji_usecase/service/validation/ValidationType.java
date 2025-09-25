package com.mosip.inji_usecase.service.validation;

public enum ValidationType {

    REQUIRED,
    TYPE,
    REGEX,
    MINLENGTH,
    MAXLENGTH,
    CONDITIONAL,
    UNIQUE;

    public static ValidationType fromString(String key) {
        try {
            return ValidationType.valueOf(key.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Unkown validation type " + key);
        }
    }

}
