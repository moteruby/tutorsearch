package com.example.demo.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TutorDTO {
    private Long id;
    private String username;
    private String email;
    private List<String> subjects;
    private String description;
    private String imageUrl;
    private Double averageRating;
    private Double hourlyRate;
    private List<ReviewDTO> reviews;

    public static TutorDTO fromUser(User user) {
        TutorDTO dto = new TutorDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setSubjects(user.getSubjects());
        dto.setDescription(user.getDescription());
        dto.setImageUrl(user.getImageUrl());
        dto.setAverageRating(user.getAverageRating());
        dto.setHourlyRate(user.getHourlyRate());

        if (user.getReviews() != null) {
            dto.setReviews(user.getReviews().stream()
                    .map(ReviewDTO::fromReview)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

}

