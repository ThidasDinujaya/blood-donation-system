package com.nibm.bloodbank.campaignservice.Service;


import com.nibm.bloodbank.campaignservice.Data.Appointment;
import com.nibm.bloodbank.campaignservice.Data.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepo;

    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }

    public Appointment getAppointmentById(int id) {
        return appointmentRepo.findById(id).orElse(null);
    }

    public Appointment createAppointment(Appointment appointment) {
        Appointment bookedAppointment =
                appointmentRepo.findByCampaignIdAndAppointmentDateAndTimeSlot(
                        appointment.getCampaignId(),
                        appointment.getAppointmentDate(),
                        appointment.getTimeSlot()
                );
        if (bookedAppointment != null) {
            return null;
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
}
