package com.mosip.inji_usecase.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("truckpassValidationService")
public class TruckPassValidationService extends AbstractValidationService {

    private static final Logger logger = LoggerFactory.getLogger(TruckPassValidationService.class);

    public TruckPassValidationService(VerifyFieldService verifyFieldService) {
        super(verifyFieldService, "validation/truckpass.json", logger);
    }
}
