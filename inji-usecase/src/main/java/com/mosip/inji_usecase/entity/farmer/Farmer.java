package com.mosip.inji_usecase.entity.farmer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "farmer", schema = "farmer")
@Data
public class Farmer {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phone_number;

    @Column(name = "email")
    private String email;

    @Column(name = "date_of_birth")
    private String date_of_birth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "state")
    private String state;

    @Column(name = "district")
    private String district;

    @Column(name = "village")
    private String village;

    @Column(name = "pin_code")
    private Integer pin_code;

    @Column(name = "address")
    private String address;

    @Column(name = "civil_status")
    private String civil_status;

    @Column(name = "registration_date")
    private String registration_date;



    @Column(name = "education_level")
    private String education_level;

    @Column(name = "employment_status")
    private String employment_status;

    @Column(name = "hh_income_type")
    private String hh_income_type;



    @Column(name = "total_land_area")
    private Integer total_land_area;

    @Column(name = "ownership_type")
    private String ownership_type;

    @Column(name = "land_certificate")
    private String land_certificate;

    @Column(unique= true)
    private Integer land_id;



    @Column(name= "primary_crop")
    private String primary_crop;

    @Column(name = "collected_gc")
    private String collected_gc;

    @Column(name = "season")
    private String season;

    @Column(name = "secondary_crop")
    private String secondary_crop;


    
    @Column(name = "livestock_type")
    private String livestock_type;
    
    @Column(name = "livestock_count")
    private String livestock_count;

}
