package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@Slf4j
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentProfile(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            Principal principal,
            @RequestBody(required = false) Map<String, Object> updates,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String oldUsername = user.getUsername();
            boolean usernameChanged = false;

            // Обработка JSON-данных
            if (updates != null) {
                // Обновляем username
                if (updates.containsKey("username")) {
                    String newUsername = (String) updates.get("username");
                    if (!newUsername.equals(user.getUsername())) {
                        if (userRepository.findByUsername(newUsername).isPresent()) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("error", "Username already taken"));
                        }
                        user.setUsername(newUsername);
                        usernameChanged = true;
                    }
                }

                // Обновляем email
                if (updates.containsKey("email")) {
                    String newEmail = (String) updates.get("email");
                    if (!newEmail.equals(user.getEmail()) && 
                        userRepository.findByEmail(newEmail).isPresent()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Email already taken"));
                    }
                    user.setEmail(newEmail);
                }

                // Обновляем пароль
                if (updates.containsKey("password")) {
                    String newPassword = (String) updates.get("password");
                    if (!newPassword.isEmpty()) {
                        user.setPassword(passwordEncoder.encode(newPassword));
                    }
                }

                // Обновляем поля репетитора
                if (user.getRole().equals("TUTOR")) {
                    if (updates.containsKey("description")) {
                        user.setDescription((String) updates.get("description"));
                    }
                    
                    if (updates.containsKey("hourlyRate")) {
                        Object hourlyRateObj = updates.get("hourlyRate");
                        if (hourlyRateObj != null) {
                            if (hourlyRateObj instanceof Number) {
                                user.setHourlyRate(((Number) hourlyRateObj).doubleValue());
                            } else if (hourlyRateObj instanceof String) {
                                try {
                                    user.setHourlyRate(Double.parseDouble((String) hourlyRateObj));
                                } catch (NumberFormatException e) {
                                    return ResponseEntity.badRequest()
                                            .body(Map.of("error", "Invalid hourly rate format"));
                                }
                            }
                        }
                    }
                    
                    if (updates.containsKey("subjects")) {
                        @SuppressWarnings("unchecked")
                        List<String> subjects = (List<String>) updates.get("subjects");
                        user.setSubjects(subjects);
                    }
                }
            }

            // Обработка изображения
            if (profileImage != null && !profileImage.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + 
                        getFileExtension(profileImage.getOriginalFilename());
                Path filePath = Paths.get(uploadDir, fileName);
                Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setImageUrl("/uploads/" + fileName);
            }

            User savedUser = userRepository.save(user);

            // Если username изменился, обновляем Principal
            if (usernameChanged) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                Authentication newAuth = new UsernamePasswordAuthenticationToken(
                    savedUser.getUsername(),
                    auth.getCredentials(),
                    auth.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(newAuth);
            }

            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            log.error("Error updating profile", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private String getFileExtension(String fileName) {
        return fileName != null && fileName.contains(".") 
                ? fileName.substring(fileName.lastIndexOf(".")) 
                : "";
    }
} 