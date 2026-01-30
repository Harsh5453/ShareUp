package com.shareup.authservice.controller;

import com.shareup.authservice.dto.UserEmailResponse;
import com.shareup.authservice.entity.User;
import com.shareup.authservice.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public UserEmailResponse getUserById(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserEmailResponse res = new UserEmailResponse();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());

        return res;
    }
}
