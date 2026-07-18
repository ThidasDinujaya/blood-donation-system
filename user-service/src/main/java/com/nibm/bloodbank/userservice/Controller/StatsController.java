package com.nibm.bloodbank.userservice.Controller;

import com.nibm.bloodbank.userservice.Data.BloodGroupCount;
import com.nibm.bloodbank.userservice.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/stats")
public class StatsController {

    @Autowired
    private UserService userService;

    @GetMapping("/users/bloodgroups")
    public List<BloodGroupCount> getUsersCountByBloodGroup() {
        return userService.getBloodGroupCounts();
    }
}