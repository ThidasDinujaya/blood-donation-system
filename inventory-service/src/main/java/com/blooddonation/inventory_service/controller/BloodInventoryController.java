package com.blooddonation.inventory_service.controller;


import com.blooddonation.inventory_service.data.BloodInventory;
import com.blooddonation.inventory_service.service.BloodInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/inventories")
public class BloodInventoryController {

    @Autowired
    private BloodInventoryService obj;

    @GetMapping
    public List<BloodInventory> getAllInventory() {
        return obj.getAllInventory();
    }

    @GetMapping(path = "/{id}")
    public BloodInventory getInventoryById(@PathVariable int id) {
        return obj.getInventoryById(id);
    }

    @GetMapping(path = "/bloodgroups/{bloodGroup}")
    public List<BloodInventory> getInventoryByBloodGroup(@PathVariable String bloodGroup) {
        return obj.getInventoryByBloodGroup(bloodGroup);
    }

    @PostMapping
    public BloodInventory createInventory(@RequestBody BloodInventory inventory) {
        return obj.createInventory(inventory);
    }

    @PutMapping(path = "/{id}")
    public BloodInventory updateInventoryById(@PathVariable int id, @RequestBody BloodInventory inventory) {
        return obj.updateInventory(id, inventory);
    }

    @DeleteMapping(path = "/{id}")
    public void deleteInventoryById(@PathVariable int id) {
        obj.deleteInventoryById(id);
    }

    @PostMapping(path = "/reservations")
    public BloodInventory reserve(@RequestParam String bloodGroup, @RequestParam int units) {
        return obj.reserveUnits(bloodGroup, units);
    }
}
