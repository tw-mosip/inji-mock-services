package com.mosip.inji_usecase.entity.truckpass;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "truck_pass", schema = "truckpass")
@Data
public class TruckPass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Driver Details
    @Column(name = "driver_uin")
    private String driverUin;

    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "email_id")
    private String emailId;

    @Column(name = "city")
    private String city;

    @Column(name = "face_image_path")
    private String faceImagePath;

    @Column(name = "driver_license_number")
    private String driverLicenseNumber;

    @Column(name = "passport_number")
    private String passportNumber;

    // Consignment Details
    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "cmr_waybill")
    private String cmrWaybill;

    @Column(name = "customs_documentation")
    private String customsDocumentation;

    @Column(name = "weight_certificate_path")
    private String weightCertificatePath;

    // Vehicle Details
    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "axle_size")
    private String axleSize;

    @Column(name = "vehicle_registration_docs_path")
    private String vehicleRegistrationDocsPath;

    @Column(name = "truck_license_plate")
    private String truckLicensePlate;

    // Other Details
    @Column(name = "exporter_name")
    private String exporterName;

    @Column(name = "importer_name")
    private String importerName;

    @Column(name = "entry_exit_point")
    private String entryExitPoint;

    @Column(name = "country_origin")
    private String countryOrigin;

    @Column(name = "country_destination")
    private String countryDestination;

    @Column(name = "date_departure")
    private String dateDeparture;

    @Column(name = "date_return")
    private String dateReturn;


}
