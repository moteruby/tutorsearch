package com.example.demo.controller;

import com.example.demo.model.Review;
import com.example.demo.model.ReviewDTO;
import com.example.demo.model.User;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@Slf4j
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            User tutor = userRepository.findById(reviewDTO.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
            
            User student = userRepository.findById(reviewDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

            // Проверяем, нет ли уже отзыва от этого студента
            if (reviewRepository.findByTutorAndStudent(tutor, student).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "You have already reviewed this tutor"));
            }

            Review review = new Review();
            review.setTutor(tutor);
            review.setStudent(student);
            review.setRating(reviewDTO.getRating());
            review.setText(reviewDTO.getText());
            review.setDate(LocalDateTime.now());

            Review savedReview = reviewRepository.save(review);
            return ResponseEntity.ok(ReviewDTO.fromReview(savedReview));
        } catch (Exception e) {
            log.error("Error creating review", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewDTO reviewDTO) {
        try {
            Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

            review.setRating(reviewDTO.getRating());
            review.setText(reviewDTO.getText());
            review.setDate(LocalDateTime.now());

            Review updatedReview = reviewRepository.save(review);
            return ResponseEntity.ok(ReviewDTO.fromReview(updatedReview));
        } catch (Exception e) {
            log.error("Error updating review", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting review", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<ReviewDTO>> getTutorReviews(@PathVariable Long tutorId) {
        try {
            List<Review> reviews = reviewRepository.findByTutorIdOrderByDateDesc(tutorId);
            List<ReviewDTO> reviewDTOs = reviews.stream()
                    .map(ReviewDTO::fromReview)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(reviewDTOs);
        } catch (Exception e) {
            log.error("Ошибка при получении отзывов для репетитора {}", tutorId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}