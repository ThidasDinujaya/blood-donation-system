package com.nibm.bloodbank.userservice.Service;

import com.nibm.bloodbank.userservice.Data.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new AuthResponse("Email is already registered.", false);
        }

        String role = user.getRole() == null ? "ROLE_USER" : user.getRole();
        user.setRole(role);

        // All users: firstName, lastName, phoneNumber, city are mandatory
        if (user.getFirstName() == null || user.getFirstName().isBlank()) {
            return new AuthResponse("First name is required.", false);
        }
        if (user.getLastName() == null || user.getLastName().isBlank()) {
            return new AuthResponse("Last name is required.", false);
        }
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            return new AuthResponse("Phone number is required.", false);
        }
        if (user.getCity() == null || user.getCity().isBlank()) {
            return new AuthResponse("City is required.", false);
        }

        if ("ROLE_HOSPITAL".equals(role)) {
            if (user.getHospitalName() == null || user.getHospitalName().isBlank()) {
                return new AuthResponse("Hospital name is required.", false);
            }
            user.setBloodGroup(null);
            user.setAvailableToDonate(false);
            user.setLastDonationDate(null);
        } else {
            // Donor (ROLE_USER) or other non-hospital roles
            if (user.getBloodGroup() == null || user.getBloodGroup().isBlank()) {
                return new AuthResponse("Blood group is required for donors.", false);
            }
            user.setHospitalName(null);
            if (user.getAvailableToDonate() == null) {
                user.setAvailableToDonate(true);
            }
        }

        userRepository.save(user);
        return new AuthResponse("User registered successfully.", true);
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isEmpty()) {
            return new AuthResponse("User not found.", false);
        }
        User user = existingUser.get();
        if (request.getPassword().equals(user.getPassword())) {
            return new AuthResponse("Login successful.", true, user.getId(), user.getRole());
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

    public Page<User> findUsers(String city, String bloodGroup, Boolean availableToDonate, Pageable pageable) {
        Specification<User> spec = UserSpecification.findByCriteria(city, bloodGroup, availableToDonate);
        return userRepository.findAll(spec, pageable);
    }

    public List<BloodGroupCount> getBloodGroupCounts() {
        return userRepository.countUsersByBloodGroup();
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
        if (!request.getOldPassword().equals(user.getPassword())) {
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
        if (request.getHospitalName() != null) user.setHospitalName(request.getHospitalName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCity() != null) user.setCity(request.getCity());

        if ("ROLE_HOSPITAL".equals(user.getRole())) {
            user.setBloodGroup(null);
            user.setAvailableToDonate(false);
            user.setLastDonationDate(null);
        } else {
            if (request.getBloodGroup() != null) user.setBloodGroup(request.getBloodGroup());
            if (request.getAvailableToDonate() != null) user.setAvailableToDonate(request.getAvailableToDonate());
            if (request.getLastDonationDate() != null) user.setLastDonationDate(request.getLastDonationDate());
        }

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
            if ("ROLE_HOSPITAL".equals(user.getRole()) || "ROLE_ADMIN".equals(user.getRole())) {
                return false;
            }
            if (user.getLastDonationDate() == null) {
                return true;
            }
            long daysSinceLastDonation = ChronoUnit.DAYS.between(user.getLastDonationDate(), LocalDate.now());
            return daysSinceLastDonation >= 90;
        }).collect(Collectors.toList());
    }

    public List<User> findByBloodGroup(String bloodGroup) {
        return userRepository.findByBloodGroup(bloodGroup);
    }
}