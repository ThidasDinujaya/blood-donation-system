package com.nibm.bloodbank.notificationservice.Data;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    // custom queries later
}
