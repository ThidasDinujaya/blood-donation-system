package com.nibm.bloodbank.campaignservice.Data;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "appointments")
public class Appointment {

    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "campaign_id")
    private int campaignId;

    @Column(name = "donor_id")
    private int donorId;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "time_slot")
    private String timeSlot;

    @Column(name = "status")
    private String status;

    //constructor
    public Appointment() {
    }

    //setters
    public void setId(int id) {
        this.id = id;
    }

    public void setCampaignId(int campaignId) {
        this.campaignId = campaignId;
    }

    public void setDonorId(int donorId) {
        this.donorId = donorId;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    //getters
    public int getId() {
        return id;
    }

    public int getCampaignId() {
        return campaignId;
    }

    public int getDonorId() {
        return donorId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public String getStatus() {
        return status;
    }
}
