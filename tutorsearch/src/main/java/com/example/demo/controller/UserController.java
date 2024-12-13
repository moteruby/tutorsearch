package com.example.demo.controller;

import com.example.demo.model.TutorDTO;
import com.example.demo.model.User;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Slf4j
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/tutors")
    public ResponseEntity<List<TutorDTO>> getAllTutors(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Double maxHourlyRate,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String search
    ) {
        try {
            List<User> tutors = userRepository.findByRole("TUTOR");
            
            List<TutorDTO> tutorDTOs = tutors.stream()
                .map(tutor -> {
                    Double avgRating = reviewRepository.getAverageRatingForTutor(tutor.getId());
                    tutor.setAverageRating(avgRating != null ? avgRating : 0.0);
                    return TutorDTO.fromUser(tutor);
                })
                // Фильтр по предмету
                .filter(tutor -> subject == null || 
                    tutor.getSubjects().stream()
                        .anyMatch(s -> s.toLowerCase().contains(subject.toLowerCase())))
                // Фильтр по максимальной ставке
                .filter(tutor -> maxHourlyRate == null || 
                    (tutor.getHourlyRate() != null && tutor.getHourlyRate() <= maxHourlyRate))
                // Фильтр по минимальному рейтингу
                .filter(tutor -> minRating == null || 
                    tutor.getAverageRating() >= minRating)
                // Фильтр по поисковому запросу
                .filter(tutor -> search == null || 
                    tutor.getUsername().toLowerCase().contains(search.toLowerCase()) ||
                    (tutor.getDescription() != null && 
                     tutor.getDescription().toLowerCase().contains(search.toLowerCase())))
                .collect(Collectors.toList());

            return ResponseEntity.ok(tutorDTOs);
        } catch (Exception e) {
            log.error("Error fetching tutors", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tutors/{id}")
    public ResponseEntity<TutorDTO> getTutorDetails(@PathVariable Long id) {
        try {
            return userRepository.findById(id)
                .filter(user -> user.getRole().equals("TUTOR"))
                .map(tutor -> {
                    Double avgRating = reviewRepository.getAverageRatingForTutor(tutor.getId());
                    tutor.setAverageRating(avgRating != null ? avgRating : 0.0);
                    return ResponseEntity.ok(TutorDTO.fromUser(tutor));
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching tutor details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/tutors/{id}")
    public ResponseEntity<User> updateTutor(@PathVariable Long id, @RequestBody User updatedTutor) {
        try {
            User tutor = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tutor not found"));

            tutor.setSubjects(updatedTutor.getSubjects());
            tutor.setDescription(updatedTutor.getDescription());
            tutor.setImageUrl(updatedTutor.getImageUrl());

            User savedTutor = userRepository.save(tutor);
            return ResponseEntity.ok(savedTutor);
        } catch (Exception e) {
            log.error("Error updating tutor with id {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return userRepository.findById(id)
                    .map(user -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("id", user.getId());
                        response.put("username", user.getUsername());
                        response.put("role", user.getRole());
                        response.put("imageUrl", user.getImageUrl());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching user with id {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}