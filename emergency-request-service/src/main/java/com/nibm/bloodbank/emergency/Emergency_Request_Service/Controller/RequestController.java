package com.nibm.bloodbank.emergency.Emergency_Request_Service.Controller;

import com.nibm.bloodbank.emergency.Emergency_Request_Service.Data.Request;
import com.nibm.bloodbank.emergency.Emergency_Request_Service.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping ("/api")
public class RequestController {

    @Autowired
    private RequestService requestService;


    //Get all Requests

    @GetMapping("/requests")
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }


    // Get Request using  by id

    @GetMapping("/requests/{id}")
    public Request getRequestById(@PathVariable int id) {
        return requestService.getRequestById(id);
    }

    // Delete Request using by id
    @DeleteMapping("requests/{id}")
    public String deleteRequest(@PathVariable Integer id) {
        requestService.deleteRequest(id);
        return "Request deleted successfully";
    }

    // Create Request
    @PostMapping("/requests")
    public Request createRequest(@RequestBody Request request) {
        return requestService.createRequest(request);
    }


    // Update Request by given id
    @PutMapping("/requests/{id}")
    public Request updateRequest(@PathVariable int id,@RequestBody Request request) {
        request.setId(id);
        return requestService.updateRequest(request);
    }

    // Search By Blood Group
    @GetMapping (path = "/requests", params = {"bloodGroup"})
    public List<Request> getRequestByBloodGroup (@RequestParam String bloodGroup){
        return requestService.getRequestByBloodGroup(bloodGroup);
    }

    // Get Request by Status
    @GetMapping(path = "/requests", params = {"status"})
    public List<Request> getRequestByStatus(@RequestParam String status) {
        return requestService.getRequestByStatus(status);
    }

    // Get Emergency Requests Only
    @GetMapping("/requests/emergency")
    public List<Request> getEmergencyRequests() {
        return requestService.getEmergencyRequests();
    }

    // Search Requests by Priority
    @GetMapping(path = "/requests", params = {"priority"})
    public List<Request> getRequestByPriority(@RequestParam String priority) {
        return requestService.getRequestByPriority(priority);
    }

    // Search Requests by Hospital Name
    @GetMapping(path = "/requests", params = {"hospitalName"})
    public List<Request> getRequestByHospitalName(@RequestParam String hospitalName) {
        return requestService.getRequestByHospitalName(hospitalName);
    }

    // Search by Required Before Date
    @GetMapping(path="/requests", params={"requiredBefore"})
    public List<Request> getRequestByRequiredBefore(
            @RequestParam LocalDate requiredBefore){
        return requestService.getRequestByRequiredBefore(requiredBefore);
    }

    // Search by Contact Number
    @GetMapping(path="/requests", params={"contactNumber"})
    public List<Request> getRequestByContactNumber(
            @RequestParam String contactNumber){
        return requestService.getRequestByContactNumber(contactNumber);
    }

    // Search by Blood Group and Status
    @GetMapping(path="/requests", params={"bloodGroup","status"})
    public List<Request> getBloodGroupAndStatus(
            @RequestParam String bloodGroup,
            @RequestParam String status){

        return requestService.getBloodGroupAndStatus(bloodGroup,status);
    }

    // Search by Blood Group and Priority
    @GetMapping(path="/requests", params={"bloodGroup","priority"})
    public List<Request> getBloodGroupAndPriority(
            @RequestParam String bloodGroup,
            @RequestParam String priority){

        return requestService.getBloodGroupAndPriority(bloodGroup,priority);
    }

    // Search by Hospital and Status
    @GetMapping(path="/requests", params={"hospitalName","status"})
    public List<Request> getHospitalAndStatus(
            @RequestParam String hospitalName,
            @RequestParam String status){

        return requestService.getHospitalAndStatus(hospitalName,status);
    }

    // Get Pending Requests
    @GetMapping("/requests/pending")
    public List<Request> getPendingRequests(){
        return requestService.getPendingRequests();
    }

    // Get Approved Requests
    @GetMapping("/requests/approved")
    public List<Request> getApprovedRequests(){
        return requestService.getApprovedRequests();
    }

    // Get Completed Requests
    @GetMapping("/requests/completed")
    public List<Request> getCompletedRequests(){
        return requestService.getCompletedRequests();
    }

    //
    @PutMapping("/requests/{id}/cancel")
    public Request cancelRequest(@PathVariable int id) {
        return requestService.cancelRequest(id);
    }
}