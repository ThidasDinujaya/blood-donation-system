package com.nibm.bloodbank.emergency.Emergency_Request_Service.Data;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table (name = "emergency_request")
public class Request {

    //variables
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "id")
    private int id;

    @Column (name = "hospital_name")
    private String hospitalName;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "units_needed")
    private Integer unitsNeeded;

    private String priority;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "required_before")
    private LocalDate requiredBefore;

    @Column (name = "status")
    private String status;


    //Default Constructor

    public Request() {

    }


    //Setters

    public void setId(int id) {
        this.id = id;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setUnitsNeeded(Integer unitsNeeded) {
        this.unitsNeeded = unitsNeeded;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public void setRequiredBefore(LocalDate requiredBefore) {
        this.requiredBefore = requiredBefore;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    //Getters

    public int getId() {
        return id;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public Integer getUnitsNeeded() {
        return unitsNeeded;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public LocalDate getRequiredBefore() {
        return requiredBefore;
    }

    public String getStatus() {
        return status;
    }
}
