package org.chatapp.backend.controller;

import java.net.URI;
import java.util.List;

import org.chatapp.backend.model.User;
import org.chatapp.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@RestController
public class userController {
    private final UserRepository userRepository;
    
    public userController(UserRepository userRepository) {
        this.userRepository = userRepository;
    };

    @PostMapping("/user")
    public ResponseEntity<User> postMethodName(@RequestBody User newUser) {
        User savedUser = userRepository.save(newUser);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedUser.getId())
            .toUri();
        return ResponseEntity.created(location).body(savedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);
        return ResponseEntity.ok(userPage.getContent());
    }
}
