package com.blooddonation.inventory_service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Integer> {

    @Query("SELECT b FROM BloodInventory b WHERE b.bloodGroup = ?1")
    public List<BloodInventory> getInventoryByBloodGroup(String bloodGroup);
}
