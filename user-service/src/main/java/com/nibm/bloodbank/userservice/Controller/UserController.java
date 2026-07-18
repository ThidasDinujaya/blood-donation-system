package com.nibm.bloodbank.userservice.Controller;

import com.nibm.bloodbank.userservice.Data.AuthResponse;
import com.nibm.bloodbank.userservice.Data.User;
import com.nibm.bloodbank.userservice.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getAllUsers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) Boolean availableToDonate,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String eligibleDonors) {
        if (eligibleDonors != null && eligibleDonors.equals("true")) {
            return userService.getEligibleDonors(bloodGroup, city);
        }
        return userService.findUsers(city, bloodGroup, availableToDonate, role);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id).orElse(null);
    }

    @PutMapping("/users/{id}")
    public AuthResponse updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUserProfile(
                id, user.getFirstName(), user.getLastName(),
                user.getHospitalName(), user.getPhoneNumber(), user.getCity(),
                user.getBloodGroup(), user.getAvailableToDonate(), user.getLastDonationDate());
    }

    @DeleteMapping("/users/{id}")
    public AuthResponse deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }


    @GetMapping("/users/me")
    public User getCurrentUser(@RequestParam String email) {
        return userService.getUserByEmail(email).orElse(null);
    }

    @PutMapping("/users/me/password")
    public AuthResponse changePassword(@RequestParam String email,
                                        @RequestParam String oldPassword,
                                        @RequestParam String newPassword) {
        return userService.changePassword(email, oldPassword, newPassword);
    }
}