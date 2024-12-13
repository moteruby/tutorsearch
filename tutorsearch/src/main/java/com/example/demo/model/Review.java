package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private int rating;
    private String text;
    private LocalDateTime date;

    @JsonProperty("student")
    public Map<String, Object> getStudentInfo() {
        Map<String, Object> studentInfo = new HashMap<>();
        studentInfo.put("id", student.getId());
        studentInfo.put("username", student.getUsername());
        return studentInfo;
    }
}