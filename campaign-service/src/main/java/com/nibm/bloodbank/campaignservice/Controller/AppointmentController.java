package com.nibm.bloodbank.campaignservice.Controller;

import com.nibm.bloodbank.campaignservice.Data.Appointment;
import com.nibm.bloodbank.campaignservice.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/appointments/{id}")
    public Appointment getAppointmentById(@PathVariable int id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping("/appointments")
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @PutMapping("/appointments/{id}")
    public Appointment updateAppointment(@PathVariable int id, @RequestBody Appointment appointment) {
        appointment.setId(id);
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/appointments/{id}")
    public void deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
    }
    @GetMapping("/appointments/campaign/{campaignId}")
    public List<Appointment> getAppointmentsByCampaign(@PathVariable int campaignId) {
        return appointmentService.getAppointmentsByCampaign(campaignId);
    }

    @GetMapping("/appointments/donor/{donorId}")
    public List<Appointment> getAppointmentsByDonor(@PathVariable int donorId) {
        return appointmentService.getAppointmentsByDonor(donorId);
    }
    @GetMapping(path="/appointments", params={"status"})
    public List<Appointment> getAppointmentsByStatus(@RequestParam String status) {
        return appointmentService.getAppointmentsByStatus(status);
    }
}
