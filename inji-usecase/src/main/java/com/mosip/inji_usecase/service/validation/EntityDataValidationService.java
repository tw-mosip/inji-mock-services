package com.mosip.inji_usecase.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("EntityDataValidationService")
public class EntityDataValidationService extends AbstractValidationService {

    private static final Logger logger = LoggerFactory.getLogger(EntityDataValidationService.class);

    @Autowired
    public EntityDataValidationService(VerifyFieldService verifyFieldService) {
        super(verifyFieldService, "validation/driver.json", logger);
    }

    public EntityDataValidationService(VerifyFieldService verifyFieldService, String entityType) {
        super(verifyFieldService, "validation/"+entityType+".json", logger);
    }
}
