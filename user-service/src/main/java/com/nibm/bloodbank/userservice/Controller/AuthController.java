package com.nibm.bloodbank.userservice.Controller;

import com.nibm.bloodbank.userservice.Data.AuthRequest;
import com.nibm.bloodbank.userservice.Data.AuthResponse;
import com.nibm.bloodbank.userservice.Data.User;
import com.nibm.bloodbank.userservice.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return userService.authenticateUser(request);
    }

    @DeleteMapping("/logout")
    public AuthResponse logout() {
        return new AuthResponse("Logout successful.", true);
    }

    @GetMapping("/checkemail")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean isRegistered = userService.isEmailRegistered(email);
        return Collections.singletonMap("isRegistered", isRegistered);
    }
}