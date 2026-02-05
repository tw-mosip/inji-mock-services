package com.mosip.inji_usecase.service.validation;

import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public interface ValidationService {

    public void validate(Map<String, Object> data);
}
