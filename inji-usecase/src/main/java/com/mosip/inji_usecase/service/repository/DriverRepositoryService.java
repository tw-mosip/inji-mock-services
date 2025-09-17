package com.mosip.inji_usecase.service.repository;

import org.springframework.stereotype.Service;
import com.mosip.inji_usecase.dto.truckpass.DriverDto;
import com.mosip.inji_usecase.entity.truckpass.Driver;
import com.mosip.inji_usecase.mapper.truckpass.DriverMapper;
import com.mosip.inji_usecase.repository.truckpass.DriverRepository;

@Service("driverRepositoryService")
public class DriverRepositoryService
        extends AbstractRepositoryService<Driver, DriverDto, String, DriverRepository, DriverMapper> {

    public DriverRepositoryService(DriverRepository driverRepository, DriverMapper driverMapper) {
        super(driverRepository, driverMapper);
    }
}
