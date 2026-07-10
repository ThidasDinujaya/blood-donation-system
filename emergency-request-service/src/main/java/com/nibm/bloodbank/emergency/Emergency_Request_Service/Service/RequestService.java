package com.nibm.bloodbank.emergency.Emergency_Request_Service.Service;

import com.nibm.bloodbank.emergency.Emergency_Request_Service.Data.Request;
import com.nibm.bloodbank.emergency.Emergency_Request_Service.Data.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RequestService {


    @Autowired
    private RequestRepository repository;


    public List<Request> getAllRequests() {
        return repository.findAll();
    }

    public Request getRequestById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Request createRequest(Request request) {
        return repository.save(request);
    }

    public Request updateRequest(Request request) {
        return repository.save(request);
    }

    // Delete Request
    public void deleteRequest(int id) {
        repository.deleteById(id);
    }

    // Get Request By Blood Group
    public List<Request> getRequestByBloodGroup(String bloodGroup){
        return repository.getRequestByBloodGroup(bloodGroup);
    }

    // Get Request by Status
    public List<Request> getRequestByStatus(String status) {
        return repository.getRequestByStatus(status);
    }

    // Get Emergency Requests Only
    public List<Request> getEmergencyRequests() {
        return repository.getEmergencyRequests();
    }

    // Search Requests by Priority
    public List<Request> getRequestByPriority(String priority) {
        return repository.getRequestByPriority(priority);
    }

    // Search Requests by Hospital Name
    public List<Request> getRequestByHospitalName(String hospitalName) {
        return repository.getRequestByHospitalName(hospitalName);
    }

    // Search by Required Before Date
    public List<Request> getRequestByRequiredBefore(LocalDate requiredBefore){
        return repository.getRequestByRequiredBefore(requiredBefore);
    }

    // Search by Contact Number
    public List<Request> getRequestByContactNumber(String contactNumber){
        return repository.getRequestByContactNumber(contactNumber);
    }

    // Search by Blood Group and Status
    public List<Request> getBloodGroupAndStatus(String bloodGroup,String status){
        return repository.getBloodGroupAndStatus(bloodGroup,status);
    }

    // Search by Blood Group and Priority
    public List<Request> getBloodGroupAndPriority(String bloodGroup,String priority){
        return repository.getBloodGroupAndPriority(bloodGroup,priority);
    }

    // Search by Hospital and Status
    public List<Request> getHospitalAndStatus(String hospitalName,String status){
        return repository.getHospitalAndStatus(hospitalName,status);
    }

    // Get Pending Requests
    public List<Request> getPendingRequests(){
        return repository.getPendingRequests();
    }

    // Get Approved Requests
    public List<Request> getApprovedRequests(){
        return repository.getApprovedRequests();
    }

    // Get Completed Requests
    public List<Request> getCompletedRequests(){
        return repository.getCompletedRequests();
    }

    //
    public Request cancelRequest(int id) {

        Request request = repository.findById(id).orElse(null);

        if (request != null) {
            request.setStatus("Cancelled");
            return repository.save(request);
        }

        return null;
    }


}
