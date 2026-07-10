package com.nibm.bloodbank.campaignservice.Data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
    List<Campaign> findByDateGreaterThanEqual(LocalDate date);
    List<Campaign> findByLocationContaining(String location);
    List<Campaign> findByDate(LocalDate date);

}
