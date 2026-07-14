package com.nibm.bloodbank.userservice.Data;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByBloodGroup(String bloodGroup);

    //Find donors who match the blood group, live in the specified city, and are marked as active
    List<User> findByBloodGroupAndCityAndAvailableToDonateTrue(String bloodGroup, String city);
}