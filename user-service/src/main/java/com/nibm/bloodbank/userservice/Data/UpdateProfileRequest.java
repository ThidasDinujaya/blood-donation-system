package com.nibm.bloodbank.userservice.Data;

import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;

public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String hospitalName;
    private String bloodGroup;

    @NotEmpty(message = "Phone number is required")
    private String phoneNumber;

    @NotEmpty(message = "City is required")
    private String city;
    private Boolean availableToDonate;
    private LocalDate lastDonationDate;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Boolean getAvailableToDonate() { return availableToDonate; }
    public void setAvailableToDonate(Boolean availableToDonate) { this.availableToDonate = availableToDonate; }

    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
}
