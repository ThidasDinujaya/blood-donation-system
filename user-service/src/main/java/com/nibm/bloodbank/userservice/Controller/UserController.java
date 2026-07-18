package com.nibm.bloodbank.userservice.Controller;

import com.nibm.bloodbank.userservice.Data.AuthResponse;
import com.nibm.bloodbank.userservice.Data.ChangePasswordRequest;
import com.nibm.bloodbank.userservice.Data.UpdateProfileRequest;
import com.nibm.bloodbank.userservice.Data.User;
import com.nibm.bloodbank.userservice.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> findUsers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) Boolean availableToDonate,
            Pageable pageable) {
        Page<User> users = userService.findUsers(city, bloodGroup, availableToDonate, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        Optional<User> user = userService.getUserByEmail(userDetails.getUsername());
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/me/password")
    public ResponseEntity<AuthResponse> changePassword(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody ChangePasswordRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse response = userService.changePassword(userDetails.getUsername(), request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchEligibleDonors(
            @RequestParam String bloodGroup,
            @RequestParam String city) {
        return ResponseEntity.ok(userService.getEligibleDonors(bloodGroup, city));
    }

    @GetMapping("/blood-group/{bloodGroup}")
    public ResponseEntity<List<User>> getUsersByBloodGroup(@PathVariable String bloodGroup) {
        List<User> users = userService.getUsersByBloodGroup(bloodGroup);
        return ResponseEntity.ok(users);
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
            @Valid @RequestBody UpdateProfileRequest request) {
        AuthResponse response = userService.updateUserProfile(id, request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> deleteUser(@PathVariable Long id) {
        AuthResponse response = userService.deleteUser(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}