package com.nibm.bloodbank.campaignservice.Controller;

import com.nibm.bloodbank.campaignservice.Data.Appointment;
import com.nibm.bloodbank.campaignservice.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment created = appointmentService.createAppointment(appointment);
            return ResponseEntity.ok(created);
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/appointments/{id}")
    public Appointment updateAppointment(@PathVariable int id, @RequestBody Appointment appointment) {
        appointment.setId(id);
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/appointments/campaigns/{campaignId}")
    public List<Appointment> getAppointmentsByCampaign(@PathVariable int campaignId) {
        return appointmentService.getAppointmentsByCampaign(campaignId);
    }

    @GetMapping("/appointments/campaigns/{campaignId}/count")
    public ResponseEntity<Map<String, Integer>> getAppointmentCountByCampaign(@PathVariable int campaignId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByCampaign(campaignId);
        Map<String, Integer> response = new HashMap<>();
        response.put("count", appointments.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments/donors/{donorId}")
    public List<Appointment> getAppointmentsByDonor(@PathVariable int donorId) {
        return appointmentService.getAppointmentsByDonor(donorId);
    }

    @GetMapping(path="/appointments", params={"status"})
    public List<Appointment> getAppointmentsByStatus(@RequestParam String status) {
        return appointmentService.getAppointmentsByStatus(status);
    }

    @GetMapping("/appointments/campaigns/{campaignId}/donors/{donorId}/exists")
    public ResponseEntity<Map<String, Boolean>> checkDonorAppointmentExists(@PathVariable int campaignId, @PathVariable int donorId) {
        boolean exists = appointmentService.hasDonorAppointmentForCampaign(campaignId, donorId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}
