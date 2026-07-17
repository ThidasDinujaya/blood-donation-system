package com.blooddonation.inventory_service.controller;


import com.blooddonation.inventory_service.data.BloodInventory;
import com.blooddonation.inventory_service.service.BloodInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api")
public class BloodInventoryController {

    @Autowired
    private BloodInventoryService obj;

    @GetMapping(path = "/bloodinventories")
    public List<BloodInventory> getAllInventory() {
        return obj.getAllInventory();
    }

    @GetMapping(path = "/bloodinventories/{id}")
    public BloodInventory getInventoryById(@PathVariable int id) {
        return obj.getInventoryById(id);
    }

    @GetMapping(path = "/bloodinventories", params = {"bloodGroup"})
    public List<BloodInventory> getInventoryByBloodGroup(@RequestParam String bloodGroup) {
        return obj.getInventoryByBloodGroup(bloodGroup);
    }

    @PostMapping(path = "/bloodinventories")
    public BloodInventory createInventory(@RequestBody BloodInventory inventory) {
        return obj.createInventory(inventory);
    }

    @PutMapping(path = "/bloodinventories/{id}")
    public BloodInventory updateInventoryById(@PathVariable int id, @RequestBody BloodInventory inventory) {
        return obj.updateInventory(id, inventory);
    }

    @DeleteMapping(path = "/bloodinventories/{id}")
    public void deleteInventoryById(@PathVariable int id) {
        obj.deleteInventoryById(id);
    }

    @PostMapping(path = "/bloodinventories/reservations")
    public BloodInventory reserve(@RequestParam String bloodGroup, @RequestParam int units) {
        return obj.reserveUnits(bloodGroup, units);
    }
}
