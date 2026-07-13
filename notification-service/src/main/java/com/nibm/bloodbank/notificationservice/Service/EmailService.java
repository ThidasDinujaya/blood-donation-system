package com.nibm.bloodbank.notificationservice.Service;

import com.nibm.bloodbank.notificationservice.Data.NotificationLog;
import com.nibm.bloodbank.notificationservice.Data.NotificationLogRepository;
import com.nibm.bloodbank.notificationservice.Data.NotificationRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository logRepository;

    public EmailService(JavaMailSender mailSender, NotificationLogRepository logRepository) {
        this.mailSender = mailSender;
        this.logRepository = logRepository;
    }

    public void sendEmailAlert(NotificationRequest request) {
        NotificationLog log = new NotificationLog();
        log.setRecipientEmail(request.getRecipientEmail());
        log.setSubject(request.getSubject());
        log.setMessage(request.getMessage());
        log.setSentAt(LocalDateTime.now());

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(request.getRecipientEmail());
            mailMessage.setSubject(request.getSubject());
            mailMessage.setText(request.getMessage());


            mailSender.send(mailMessage);

            log.setStatus("SENT");
        } catch (Exception e) {
            log.setStatus("FAILED: " + e.getMessage());
            System.err.println("Failed to send email: " + e.getMessage());
        } finally {
            
            logRepository.save(log);
        }
    }
}