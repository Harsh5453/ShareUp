package com.shareup.authservice.service;

import com.shareup.authservice.dto.*;
import com.shareup.authservice.entity.User;
import com.shareup.authservice.repository.UserRepository;
import com.shareup.authservice.util.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phone(request.getPhone())
                .build();   // ❌ pickupAddress removed

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone()
        );

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getEmail(),
                saved.getRole().name()
        );
    }


    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone()
        );

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }

}
