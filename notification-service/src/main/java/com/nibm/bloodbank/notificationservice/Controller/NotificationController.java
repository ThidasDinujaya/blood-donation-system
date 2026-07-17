package com.nibm.bloodbank.notificationservice.Controller;

import com.nibm.bloodbank.notificationservice.Data.NotificationRequest;
import com.nibm.bloodbank.notificationservice.Service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {

        emailService.sendEmailAlert(request);
        return ResponseEntity.ok("Notification processing initiated.");
    }
}