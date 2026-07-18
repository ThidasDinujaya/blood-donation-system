package com.nibm.bloodbank.userservice.Data;

public class AuthResponse {
    private String message;
    private boolean success;
    private Long userId;
    private String role;

    // Simple response (errors / logout)
    public AuthResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    // Full response on successful login
    public AuthResponse(String message, boolean success, Long userId, String role) {
        this.message = message;
        this.success = success;
        this.userId  = userId;
        this.role    = role;
    }

    public String getMessage()  { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess()  { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Long getUserId()     { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRole()     { return role; }
    public void setRole(String role) { this.role = role; }
}