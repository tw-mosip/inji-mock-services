package com.mosip.inji_usecase.repository.data;

import com.mosip.inji_usecase.entity.data.EntityData;
import com.mosip.inji_usecase.entity.farmer.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EntityDataRepository extends JpaRepository<EntityData, Long>, JpaSpecificationExecutor<Farmer> {

}
