package com.shareup.authservice.dto;

public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;

    public ProfileResponse(Long id, String name, String email, String role,
                           String phone ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getPhone() { return phone; }
}
