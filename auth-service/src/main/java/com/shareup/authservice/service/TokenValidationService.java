package com.shareup.authservice.service;

import com.shareup.authservice.dto.TokenValidationResponse;

public interface TokenValidationService {

    TokenValidationResponse validate(String token);
    
}
