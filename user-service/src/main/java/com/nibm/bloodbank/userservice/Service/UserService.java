package com.nibm.bloodbank.userservice.Service;

import com.nibm.bloodbank.userservice.Data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new AuthResponse("Email is already registered.", false);
        }

        String role = user.getRole() == null ? "ROLE_USER" : user.getRole();
        user.setRole(role);

        if ("ROLE_HOSPITAL".equals(role)) {
            user.setBloodGroup(null);
            user.setAvailableToDonate(false);
            user.setLastDonationDate(null);
        } else {
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

    public boolean isEmailRegistered(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public List<User> findUsers(String city, String bloodGroup, Boolean availableToDonate, String role) {
        return userRepository.findByCriteria(city, bloodGroup, availableToDonate, role);
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

    public AuthResponse changePassword(String email, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new AuthResponse("User not found.", false);
        }
        User user = userOpt.get();
        if (!oldPassword.equals(user.getPassword())) {
            return new AuthResponse("Invalid old password.", false);
        }
        user.setPassword(newPassword);
        userRepository.save(user);
        return new AuthResponse("Password updated successfully.", true);
    }

    public AuthResponse updateUserProfile(Long id, String firstName, String lastName,
                                           String hospitalName, String phoneNumber, String city,
                                           String bloodGroup, Boolean availableToDonate, String lastDonationDate) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            return new AuthResponse("User not found.", false);
        }

        User user = existingUserOpt.get();
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (hospitalName != null) user.setHospitalName(hospitalName);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (city != null) user.setCity(city);

        if ("ROLE_HOSPITAL".equals(user.getRole())) {
            user.setBloodGroup(null);
            user.setAvailableToDonate(false);
            user.setLastDonationDate(null);
        } else {
            if (bloodGroup != null) user.setBloodGroup(bloodGroup);
            if (availableToDonate != null) user.setAvailableToDonate(availableToDonate);
            if (lastDonationDate != null) user.setLastDonationDate(lastDonationDate);
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

    public List<User> getEligibleDonors(String bloodGroup, String city) {
        List<User> availableDonors = userRepository.findByBloodGroupAndCityAndAvailableToDonateTrue(bloodGroup, city);

        return availableDonors.stream().filter(user -> {
            if ("ROLE_HOSPITAL".equals(user.getRole()) || "ROLE_ADMIN".equals(user.getRole())) {
                return false;
            }
            if (user.getLastDonationDate() == null) {
                return true;
            }
            long daysSinceLastDonation = ChronoUnit.DAYS.between(
                    LocalDate.parse(user.getLastDonationDate()), LocalDate.now());
            return daysSinceLastDonation >= 90;
        }).collect(Collectors.toList());
    }
}