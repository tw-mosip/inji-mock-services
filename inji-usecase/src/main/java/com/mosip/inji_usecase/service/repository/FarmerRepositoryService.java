package com.mosip.inji_usecase.service.repository;

import org.springframework.stereotype.Service;

import com.mosip.inji_usecase.dto.farmer.FarmerDto;
import com.mosip.inji_usecase.entity.farmer.Farmer;
import com.mosip.inji_usecase.mapper.farmer.FarmerMapper;
import com.mosip.inji_usecase.repository.farmer.FarmerRepository;

@Service("farmerRepositoryService")
public class FarmerRepositoryService
        extends AbstractRepositoryService<Farmer, FarmerDto, Long, FarmerRepository, FarmerMapper> {

    public FarmerRepositoryService(FarmerRepository farmerRepository, FarmerMapper farmerMapper) {
        super(farmerRepository, farmerMapper);
    }

}