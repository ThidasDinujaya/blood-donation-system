package com.nibm.bloodbank.campaignservice.Data;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "campaigns")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "location")
    private String location;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "organizer")
    private String organizer;

    @Column(name = "max_donors")
    private int maxDonors;

    @Column(name = "description")
    private String description;



    //setters

    public void setId(int id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public void setMaxDonors(int maxDonors) {
        this.maxDonors = maxDonors;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    //getters

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getOrganizer() {
        return organizer;
    }

    public int getMaxDonors() {
        return maxDonors;
    }

    public String getDescription() {
        return description;
    }
}


