package com.nibm.bloodbank.campaignservice.Service;


import com.nibm.bloodbank.campaignservice.Data.Appointment;
import com.nibm.bloodbank.campaignservice.Data.AppointmentRepository;
import com.nibm.bloodbank.campaignservice.Data.Campaign;
import com.nibm.bloodbank.campaignservice.Data.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepo;
    @Autowired
    private CampaignRepository campaignRepo;

    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }

    public Appointment getAppointmentById(int id) {
        return appointmentRepo.findById(id).orElse(null);
    }

    public Appointment createAppointment(Appointment appointment) {
        // Get campaign details to fill in missing date and time slot
        Campaign campaign = campaignRepo.findById(appointment.getCampaignId()).orElse(null);
        if (campaign != null) {
            if (appointment.getAppointmentDate() == null) {
                appointment.setAppointmentDate(campaign.getDate());
            }
            if (appointment.getTimeSlot() == null || appointment.getTimeSlot().isEmpty()) {
                appointment.setTimeSlot(campaign.getStartTime().toString());
            }

            // 1. Check if donor already has an appointment for this campaign
            List<Appointment> donorAppointments = appointmentRepo.findByCampaignIdAndDonorId(appointment.getCampaignId(), appointment.getDonorId());
            if (!donorAppointments.isEmpty()) {
                throw new IllegalStateException("You already have an appointment for this campaign");
            }

            // 2. Check if maxDonors limit has been reached
            List<Appointment> campaignAppointments = appointmentRepo.findByCampaignId(appointment.getCampaignId());
            if (campaignAppointments.size() >= campaign.getMaxDonors()) {
                throw new IllegalStateException("This campaign has reached the maximum number of donors");
            }
        }

        return appointmentRepo.save(appointment);
    }

    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepo.save(appointment);
    }

    public void deleteAppointment(int id) {
        appointmentRepo.deleteById(id);
    }

    public List<Appointment> getAppointmentsByCampaign(int campaignId) {
        return appointmentRepo.findByCampaignId(campaignId);
    }

    public List<Appointment> getAppointmentsByDonor(int donorId) {
        return appointmentRepo.findByDonorId(donorId);
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepo.findByStatus(status);
    }

    // New method: Check if donor has appointment for campaign
    public boolean hasDonorAppointmentForCampaign(int campaignId, int donorId) {
        return !appointmentRepo.findByCampaignIdAndDonorId(campaignId, donorId).isEmpty();
    }
}
