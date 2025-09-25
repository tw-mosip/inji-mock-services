package com.mosip.inji_usecase.dto.truckpass;

import lombok.Data;

@Data
public class TruckPassDto {
    private Long id;
    private String driverUin;
    private String driverName;
    private String phoneNumber;
    private String gender;
    private String emailId;
    private String city;
    private String faceImagePath;
    private String driverLicenseNumber;
    private String passportNumber;
    private String invoiceNumber;
    private String cmrWaybill;
    private String customsDocumentation;
    private String weightCertificatePath;
    private String vehicleType;
    private String axleSize;
    private String vehicleRegistrationDocsPath;
    private String truckLicensePlate;
    private String exporterName;
    private String importerName;
    private String entryExitPoint;
    private String countryOrigin;
    private String countryDestination;
    private String dateDeparture;    // String like your farmer dates
    private String dateReturn;       // String like your farmer dates
}
