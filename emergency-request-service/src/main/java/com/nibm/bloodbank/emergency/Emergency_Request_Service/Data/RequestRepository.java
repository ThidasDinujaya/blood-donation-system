package com.nibm.bloodbank.emergency.Emergency_Request_Service.Data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {

    // Get by blood group
    @Query("SELECT r FROM Request r WHERE r.bloodGroup=?1")
    List<Request> getRequestByBloodGroup(String bloodGroup);

    // Get Request by Status
    @Query("SELECT r FROM Request r WHERE r.status=?1")
    public List<Request> getRequestByStatus(String status);

    // Get Emergency Requests Only
    @Query("SELECT r FROM Request r WHERE r.priority='Emergency'")
    public List<Request> getEmergencyRequests();

    // Search Requests by Priority
    @Query("SELECT r FROM Request r WHERE r.priority=?1")
    public List<Request> getRequestByPriority(String priority);

    // Search Requests by Hospital Name
    @Query("SELECT r FROM Request r WHERE r.hospitalName=?1")
    public List<Request> getRequestByHospitalName(String hospitalName);

    // Search by Required Before Date
    @Query("SELECT r FROM Request r WHERE r.requiredBefore=?1")
    public List<Request> getRequestByRequiredBefore(LocalDate requiredBefore);

    // Search by Contact Number
    @Query("SELECT r FROM Request r WHERE r.contactNumber=?1")
    public List<Request> getRequestByContactNumber(String contactNumber);

    // Search by Blood Group and Status
    @Query("SELECT r FROM Request r WHERE r.bloodGroup=?1 AND r.status=?2")
    public List<Request> getBloodGroupAndStatus(String bloodGroup,String status);

    // Search by Blood Group and Priority
    @Query("SELECT r FROM Request r WHERE r.bloodGroup=?1 AND r.priority=?2")
    public List<Request> getBloodGroupAndPriority(String bloodGroup,String priority);

    // Search by Hospital and Status
    @Query("SELECT r FROM Request r WHERE r.hospitalName=?1 AND r.status=?2")
    public List<Request> getHospitalAndStatus(String hospitalName,String status);

    // Get Pending Requests
    @Query("SELECT r FROM Request r WHERE r.status='Pending'")
    public List<Request> getPendingRequests();

    // Get Approved Requests
    @Query("SELECT r FROM Request r WHERE r.status='Approved'")
    public List<Request> getApprovedRequests();

    // Get Completed Requests
    @Query("SELECT r FROM Request r WHERE r.status='Completed'")
    public List<Request> getCompletedRequests();
}
