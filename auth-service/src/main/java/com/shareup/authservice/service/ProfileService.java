package com.shareup.authservice.service;

import com.shareup.authservice.dto.ProfileResponse;
import com.shareup.authservice.dto.UpdateProfileRequest;

public interface ProfileService {

    ProfileResponse getProfile(String email);

    ProfileResponse updateProfile(String email, UpdateProfileRequest request);
}
