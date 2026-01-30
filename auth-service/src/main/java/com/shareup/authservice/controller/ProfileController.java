package com.shareup.authservice.controller;

import com.shareup.authservice.dto.ProfileResponse;
import com.shareup.authservice.dto.UpdateProfileRequest;
import com.shareup.authservice.security.CustomUserDetails;
import com.shareup.authservice.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        ProfileResponse response = profileService.getProfile(userDetails.getUsername());

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        ProfileResponse response = profileService.updateProfile(userDetails.getUsername(), request);

        return ResponseEntity.ok(response);
    }
}
