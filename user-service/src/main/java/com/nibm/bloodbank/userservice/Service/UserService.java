package com.nibm.bloodbank.userservice.Service;

import com.nibm.bloodbank.userservice.Data.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
            return new AuthResponse("Login successful. UserID: " + existingUser.get().getId(), true);
        } else {
            return new AuthResponse("Invalid credentials.", false);
        }
    }

    public AuthResponse logoutUser(String refreshToken) {
        // In a real application, you would invalidate the refresh token.
        // For this example, we'll just return a success message.
        return new AuthResponse("Logout successful.", true);
    }

    public boolean isEmailRegistered(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public AuthResponse changePassword(String email, ChangePasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new AuthResponse("User not found.", false);
        }
        User user = userOpt.get();
        if (!user.getPassword().equals(request.getOldPassword())) {
            return new AuthResponse("Invalid old password.", false);
        }
        user.setPassword(request.getNewPassword());
        userRepository.save(user);
        return new AuthResponse("Password updated successfully.", true);
    }

    public AuthResponse updateUserProfile(Long id, UpdateProfileRequest request) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            return new AuthResponse("User not found.", false);
        }

        User user = existingUserOpt.get();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getBloodGroup() != null) user.setBloodGroup(request.getBloodGroup());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getAvailableToDonate() != null) user.setAvailableToDonate(request.getAvailableToDonate());
        if (request.getLastDonationDate() != null) user.setLastDonationDate(request.getLastDonationDate());

        userRepository.save(user);
        return new AuthResponse("Profile updated successfully.", true);
    }

    public AuthResponse deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return new AuthResponse("User not found.", false);
        }
        userRepository.deleteById(id);
        return new AuthResponse("User deleted successfully.", true);
    }

    public List<User> getUsersByBloodGroup(String bloodGroup) {
        return userRepository.findByBloodGroup(bloodGroup);
    }

    // Find available and safe donors in a specific city
    public List<User> getEligibleDonors(String bloodGroup, String city) {
        List<User> availableDonors = userRepository.findByBloodGroupAndCityAndAvailableToDonateTrue(bloodGroup, city);

        // Filter out donors who donated less than 90 days ago
        return availableDonors.stream().filter(user -> {
            if (user.getLastDonationDate() == null) {
                return true;
            }
            long daysSinceLastDonation = ChronoUnit.DAYS.between(user.getLastDonationDate(), LocalDate.now());
            return daysSinceLastDonation >= 90;
        }).collect(Collectors.toList());
    }
}