package com.nibm.bloodbank.campaignservice.Data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
    @Query("SELECT c FROM Campaign c WHERE c.date >= ?1")
    List<Campaign> findByDateGreaterThanEqual(LocalDate date);

    @Query("SELECT c FROM Campaign c WHERE c.location LIKE %?1%")
    List<Campaign> findByLocationContaining(String location);

    @Query("SELECT c FROM Campaign c WHERE c.date = ?1")
    List<Campaign> findByDate(LocalDate date);
}
