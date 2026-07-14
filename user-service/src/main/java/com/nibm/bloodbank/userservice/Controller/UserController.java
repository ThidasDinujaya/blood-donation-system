package com.nibm.bloodbank.userservice.Controller;

import com.nibm.bloodbank.userservice.Data.AuthResponse;
import com.nibm.bloodbank.userservice.Data.UpdateProfileRequest;
import com.nibm.bloodbank.userservice.Data.User;
import com.nibm.bloodbank.userservice.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request) {
        AuthResponse response = userService.updateUserProfile(id, request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AuthResponse> deleteUser(@PathVariable Long id) {
        AuthResponse response = userService.deleteUser(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/blood-group/{bloodGroup}")
    public ResponseEntity<List<User>> getUsersByBloodGroup(@PathVariable String bloodGroup) {
        List<User> users = userService.getUsersByBloodGroup(bloodGroup);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/search")
    public ResponseEntity<List<User>> searchEligibleDonors(
            @RequestParam String bloodGroup,
            @RequestParam String city) {
        List<User> eligibleDonors = userService.getEligibleDonors(bloodGroup, city);
        return ResponseEntity.ok(eligibleDonors);
    }
}