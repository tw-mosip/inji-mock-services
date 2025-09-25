package com.mosip.inji_usecase.entity.truckpass;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "driver", schema = "driver")
@Data
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uin", unique = true, nullable = false)
    private String uin;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "email_id")
    private String driverEmailId;

    @Column(name = "city")
    private String city;

    @Column(name = "face_image_path")
    private String faceImagePath;

    @Column(name = "driver_license_number")
    private String driverLicenseNumber;

    @Column(name = "passport_number")
    private String passportNumber;
}
