package com.mosip.inji_usecase.service.validation;

import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

@Component
public interface ValidationService {

    public void validate(Map<String, Object> data, Boolean isRegistration);
}
