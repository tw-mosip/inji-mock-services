package com.mosip.inji_usecase.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("farmerValidationService")
public class FarmerValidationService extends AbstractValidationService {

    private static final Logger logger = LoggerFactory.getLogger(FarmerValidationService.class);

    public FarmerValidationService(VerifyFieldService verifyFieldService) {
        super(verifyFieldService, "validation/farmer.json", logger);
    }
}
