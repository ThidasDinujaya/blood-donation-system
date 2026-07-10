package com.nibm.bloodbank.campaignservice.Service;
import com.nibm.bloodbank.campaignservice.Data.Campaign;
import com.nibm.bloodbank.campaignservice.Data.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class CampaignService {
    @Autowired
    private CampaignRepository campaignRepo;

    public List<Campaign> getAllCampaigns() {
        return campaignRepo.findAll();
    }

    public Campaign getCampaignById(int id) {
        return campaignRepo.findById(id).orElse(null);
    }

    public Campaign createCampaign(Campaign campaign) {
        return campaignRepo.save(campaign);
    }

    public Campaign updateCampaign(Campaign campaign) {
        return campaignRepo.save(campaign);
    }

    public void deleteCampaign(int id) {
        campaignRepo.deleteById(id);
    }
    public List<Campaign> getUpcomingCampaigns(){
        return campaignRepo.findByDateGreaterThanEqual(LocalDate.now());

    }
    public List<Campaign> getCampaignsByLocation(String location) {
        return campaignRepo.findByLocationContaining(location);
    }

}
