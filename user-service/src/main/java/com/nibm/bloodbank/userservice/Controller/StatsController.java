package com.nibm.bloodbank.userservice.Controller;

import com.nibm.bloodbank.userservice.Data.BloodGroupCount;
import com.nibm.bloodbank.userservice.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserService userService;

    public StatsController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/by-blood-group")
    public ResponseEntity<List<BloodGroupCount>> getUsersCountByBloodGroup() {
        List<BloodGroupCount> counts = userService.getBloodGroupCounts();
        return ResponseEntity.ok(counts);
    }
}