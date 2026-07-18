package com.nibm.bloodbank.campaignservice.Controller;

import com.nibm.bloodbank.campaignservice.Data.Appointment;
import com.nibm.bloodbank.campaignservice.Data.Campaign;
import com.nibm.bloodbank.campaignservice.Service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CampaignController {
    @Autowired
    private CampaignService campaignService;

    @GetMapping("/campaigns")
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @GetMapping("/campaigns/{id}")
    public Campaign getCampaignById(@PathVariable int id) {
        return campaignService.getCampaignById(id);
    }

    @PostMapping("/campaigns")
    public Campaign createCampaign(@RequestBody Campaign campaign) {
        return campaignService.createCampaign(campaign);
    }

    @PutMapping("/campaigns/{id}")
    public Campaign updateCampaign(@PathVariable int id, @RequestBody Campaign campaign) {
        campaign.setId(id);
        return campaignService.updateCampaign(campaign);
    }

    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable int id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping(path="/campaigns", params={"upcoming"})
    public List<Campaign> getUpcomingCampaigns() {
        return campaignService.getUpcomingCampaigns();
    }

    @GetMapping(path="/campaigns", params={"location"})
    public List<Campaign> getCampaignByLocation(@RequestParam String location) {
        return campaignService.getCampaignsByLocation(location);
    }

}
