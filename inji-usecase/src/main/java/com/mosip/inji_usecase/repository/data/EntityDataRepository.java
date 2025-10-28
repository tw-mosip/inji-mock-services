package com.mosip.inji_usecase.repository.data;

import com.mosip.inji_usecase.entity.data.EntityData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EntityDataRepository extends JpaRepository<EntityData, Long>, JpaSpecificationExecutor<EntityData> {

}
