package com.example.demo.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private Long tutorId;
    private Long studentId;
    private String studentName;
    private int rating;
    private String text;
    private LocalDateTime date;

    public static ReviewDTO fromReview(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setTutorId(review.getTutor().getId());
        dto.setStudentId(review.getStudent().getId());
        dto.setStudentName(review.getStudent().getUsername());
        dto.setRating(review.getRating());
        dto.setText(review.getText());
        dto.setDate(review.getDate());
        return dto;
    }
}
