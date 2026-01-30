package com.shareup.authservice.dto;

public class TokenValidationResponse {

    private boolean valid;
    private Long userId;
    private String email;
    private String role;
    private String phone;
    public TokenValidationResponse(boolean valid, Long userId, String email, String role , String phone ) {
        this.valid = valid;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.phone = phone;
    }

    public boolean isValid() { return valid; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getphone() { return phone; }
    
}
