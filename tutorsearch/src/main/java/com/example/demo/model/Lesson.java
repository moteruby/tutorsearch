package com.example.demo.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Data
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    private String subject;
    private String description;

    @Enumerated(EnumType.STRING)
    private LessonStatus status;

    public enum LessonStatus {
        PENDING,
        APPROVED,
        REJECTED,
        COMPLETED,
        CANCELLED
    }
}