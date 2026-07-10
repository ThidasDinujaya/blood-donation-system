package com.blooddonation.inventory_service.service;


import com.blooddonation.inventory_service.data.BloodInventory;
import com.blooddonation.inventory_service.data.BloodInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BloodInventoryService {

    @Autowired
    private BloodInventoryRepository inventoryRepo;

    public List<BloodInventory> getAllInventory() {
        return inventoryRepo.findAll();
    }

    public BloodInventory getInventoryById(int id) {
        Optional<BloodInventory> inventory = inventoryRepo.findById(id);
        if (inventory.isPresent()) {
            return inventory.get();
        }
        return null;
    }

    public List<BloodInventory> getInventoryByBloodGroup(String bloodGroup) {
        return inventoryRepo.getInventoryByBloodGroup(bloodGroup);
    }

    public BloodInventory createInventory(BloodInventory inventory) {
        return inventoryRepo.save(inventory);
    }

    public BloodInventory updateInventory(int id, BloodInventory inventory) {
        inventory.setId(id);
        return inventoryRepo.save(inventory);
    }

    public void deleteInventoryById(int id) {
        inventoryRepo.deleteById(id);
    }

    public BloodInventory reserveUnits(String bloodGroup, int units) {
        List<BloodInventory> matches = inventoryRepo.getInventoryByBloodGroup(bloodGroup);

        for (BloodInventory item : matches) {
            if (item.getUnitsAvailable() >= units) {
                item.setUnitsAvailable(item.getUnitsAvailable() - units);
                return inventoryRepo.save(item);
            }
        }
        return null;
    }
}

