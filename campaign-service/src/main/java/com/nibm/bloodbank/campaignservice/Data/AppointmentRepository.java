package com.nibm.bloodbank.campaignservice.Data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("SELECT a FROM Appointment a WHERE a.campaignId = ?1")
    List<Appointment> findByCampaignId(int campaignId);

    @Query("SELECT a FROM Appointment a WHERE a.donorId = ?1")
    List<Appointment> findByDonorId(int donorId);

    @Query("SELECT a FROM Appointment a WHERE a.campaignId = ?1 AND a.appointmentDate = ?2 AND a.timeSlot = ?3")
    Appointment findByCampaignIdAndAppointmentDateAndTimeSlot(
            int campaignId,
            LocalDate appointmentDate,
            String timeSlot
    );

    @Query("SELECT a FROM Appointment a WHERE a.status = ?1")
    List<Appointment> findByStatus(String status);

    @Query("SELECT a FROM Appointment a WHERE a.campaignId = ?1 AND a.donorId = ?2")
    List<Appointment> findByCampaignIdAndDonorId(int campaignId, int donorId);
}
