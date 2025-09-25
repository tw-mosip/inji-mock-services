// DriverRepository.java
package com.mosip.inji_usecase.repository.truckpass;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.mosip.inji_usecase.entity.truckpass.Driver;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String>, JpaSpecificationExecutor<Driver> {
    Optional<Driver> findByUin(String uin);
    List<Driver> findByFullNameContainingIgnoreCase(String name);
    List<Driver> findByUinContainingOrFullNameContainingIgnoreCase(String uin, String name);
}
