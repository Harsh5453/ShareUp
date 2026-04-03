package com.shareup.rental.security;

public class UserContext {

    private final Long   userId;
    private final String email;
    private final String phone;  

    public UserContext(Long userId, String email, String phone) {
        this.userId = userId;
        this.email  = email;
        this.phone  = phone;
    }

    public Long   getUserId() { return userId; }
    public String getEmail()  { return email; }
    public String getPhone()  { return phone; }
}
