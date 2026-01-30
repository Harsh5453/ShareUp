package com.shareup.authservice.service;

import com.shareup.authservice.dto.AuthResponse;
import com.shareup.authservice.dto.LoginRequest;
import com.shareup.authservice.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
