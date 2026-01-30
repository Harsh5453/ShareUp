package com.shareup.authservice.service;

import com.shareup.authservice.dto.TokenValidationResponse;
import com.shareup.authservice.util.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationServiceImpl implements TokenValidationService {

    private final JwtUtil jwtUtil;

    public TokenValidationServiceImpl(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public TokenValidationResponse validate(String token) {

        if (!jwtUtil.validateToken(token)) {
            return new TokenValidationResponse(false, null, null, null, null );
        }

        Long userId = jwtUtil.extractUserId(token);
        String email = jwtUtil.extractEmail(token);
        String role = jwtUtil.extractRole(token);
        String phone = jwtUtil.extractPhone(token);

        return new TokenValidationResponse(
                true,
                userId,
                email,
                role,
                phone
        );
    }
}
