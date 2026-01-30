package com.shareup.authservice.controller;

import com.shareup.authservice.dto.TokenValidationResponse;
import com.shareup.authservice.service.TokenValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin   // important for frontend + other services
public class TokenValidationController {

    private final TokenValidationService tokenValidationService;

    public TokenValidationController(TokenValidationService tokenValidationService) {
        this.tokenValidationService = tokenValidationService;
    }

    @GetMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validateToken(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest()
                    .body(new TokenValidationResponse(false, null, null, null, null));
        }

        String token = authorizationHeader.substring(7);

        TokenValidationResponse response = tokenValidationService.validate(token);

        return ResponseEntity.ok(response);
    }
}
