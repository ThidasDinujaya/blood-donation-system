package com.nibm.bloodbank.campaignservice.Data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByCampaignId(int campaignId);

    List<Appointment> findByDonorId(int donorId);

    Appointment findByCampaignIdAndAppointmentDateAndTimeSlot(
            int campaignId,
            LocalDate appointmentDate,
            String timeSlot
    );

    List<Appointment> findByStatus(String status);

    // New method: find by campaign and donor
    List<Appointment> findByCampaignIdAndDonorId(int campaignId, int donorId);
}
