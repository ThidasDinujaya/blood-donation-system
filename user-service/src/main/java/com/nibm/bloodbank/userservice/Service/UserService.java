package com.nibm.bloodbank.userservice.Service;

import com.nibm.bloodbank.userservice.Data.AuthRequest;
import com.nibm.bloodbank.userservice.Data.AuthResponse;
import com.nibm.bloodbank.userservice.Data.User;
import com.nibm.bloodbank.userservice.Data.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new AuthResponse("Email is already registered.", false);
        }

        userRepository.save(user);
        return new AuthResponse("User registered successfully.", true);
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isEmpty()) {
            return new AuthResponse("User not found.", false);
        }

        if (existingUser.get().getPassword().equals(request.getPassword())) {
            return new AuthResponse("Login successful!", true);
        } else {
            return new AuthResponse("Invalid credentials.", false);
        }
    }
}