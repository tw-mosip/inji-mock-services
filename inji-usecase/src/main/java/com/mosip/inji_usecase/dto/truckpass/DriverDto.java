// DriverDto.java
package com.mosip.inji_usecase.dto.truckpass;

import lombok.Data;

@Data
public class DriverDto {
    private Long id;
    private String uin;
    private String fullName;
    private String phoneNumber;
    private String gender;
    private String driverEmailId;
    private String city;
    private String faceImagePath;
    private String driverLicenseNumber;
    private String passportNumber;
}
