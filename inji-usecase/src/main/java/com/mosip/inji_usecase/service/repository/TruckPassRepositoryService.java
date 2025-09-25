package com.mosip.inji_usecase.service.repository;

import org.springframework.stereotype.Service;
import com.mosip.inji_usecase.dto.truckpass.TruckPassDto;
import com.mosip.inji_usecase.entity.truckpass.TruckPass;
import com.mosip.inji_usecase.mapper.truckpass.TruckPassMapper;
import com.mosip.inji_usecase.repository.truckpass.TruckPassRepository;

@Service("truckpassRepositoryService")
public class TruckPassRepositoryService
        extends AbstractRepositoryService<TruckPass, TruckPassDto, String, TruckPassRepository, TruckPassMapper> {

    public TruckPassRepositoryService(TruckPassRepository truckPassRepository, TruckPassMapper truckPassMapper) {
        super(truckPassRepository, truckPassMapper);
    }
}
