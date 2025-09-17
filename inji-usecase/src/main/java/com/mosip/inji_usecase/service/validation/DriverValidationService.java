package com.mosip.inji_usecase.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("driverValidationService")
public class DriverValidationService extends AbstractValidationService {

    private static final Logger logger = LoggerFactory.getLogger(DriverValidationService.class);

    public DriverValidationService(VerifyFieldService verifyFieldService) {
        super(verifyFieldService, "validation/driver.json", logger);
    }
}
