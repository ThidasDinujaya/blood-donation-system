package com.nibm.bloodbank.userservice.Data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByBloodGroup(String bloodGroup);

    List<User> findByBloodGroupAndCityAndAvailableToDonateTrue(String bloodGroup, String city);

    @Query("SELECT new com.nibm.bloodbank.userservice.Data.BloodGroupCount(u.bloodGroup, COUNT(u)) FROM User u GROUP BY u.bloodGroup")
    List<BloodGroupCount> countUsersByBloodGroup();

    @Query("SELECT u FROM User u WHERE " +
           "(:city IS NULL OR u.city = :city) AND " +
           "(:bloodGroup IS NULL OR u.bloodGroup = :bloodGroup) AND " +
           "(:availableToDonate IS NULL OR u.availableToDonate = :availableToDonate) AND " +
           "(:role IS NULL OR u.role = :role)")
    List<User> findByCriteria(String city, String bloodGroup, Boolean availableToDonate, String role);
}