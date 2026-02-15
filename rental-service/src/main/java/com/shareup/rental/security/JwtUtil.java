package com.shareup.rental.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final Key signingKey;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public boolean validateToken(String token) {
    try {
        System.out.println("VALIDATING TOKEN...");
        extractAllClaims(token);
        System.out.println("TOKEN VALID");
        return true;
    } catch (Exception e) {
        System.out.println("JWT VALIDATION FAILED:");
        e.printStackTrace();
        return false;
    }
    }


   public Long extractUserId(String token) {
    Object userId = extractAllClaims(token).get("userId");
    return Long.valueOf(userId.toString());
}


    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
