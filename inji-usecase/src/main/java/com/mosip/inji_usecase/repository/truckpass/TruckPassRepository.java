// TruckPassRepository.java
package com.mosip.inji_usecase.repository.truckpass;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.mosip.inji_usecase.entity.truckpass.TruckPass;
import java.util.List;

@Repository
public interface TruckPassRepository extends JpaRepository<TruckPass, String>, JpaSpecificationExecutor<TruckPass> {
//    List<TruckPass> findByCreatedBy(String createdBy);
}
