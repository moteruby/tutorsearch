package com.example.demo.controller;


import com.example.demo.model.Lesson;
import com.example.demo.model.TutorProfile;
import com.example.demo.model.User;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.TutorProfileRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;


@RestController
@RequestMapping("/api/lessons")
@Slf4j
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tutors")
    public List<User> getAllTutors() {
        log.info("Fetching all tutors");
        List<User> tutors = userRepository.findByRole("TUTOR");
        log.info("Found {} tutors", tutors.size());
        return tutors;
    }

    @GetMapping("/students")
    public List<User> getAllStudents() {
        return userRepository.findByRole("STUDENT");
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<Lesson>> getPendingRequests(@PathVariable Long userId) {
        try {
            log.info("Fetching pending requests for user ID: {}", userId);

            // Проверяем существование пользователя
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            log.info("Found user: {}", user);

            List<Lesson> pendingLessons = lessonRepository.findPendingRequestsForUser(userId);
            log.info("Found {} pending lessons for user {}", pendingLessons.size(), userId);

            // Логируем каждый найденный урок
            pendingLessons.forEach(lesson ->
                    log.info("Pending lesson: ID={}, Tutor={}, Student={}, StartTime={}, Status={}",
                            lesson.getId(),
                            lesson.getTutor().getUsername(),
                            lesson.getStudent().getUsername(),
                            lesson.getStartTime(),
                            lesson.getStatus()
                    )
            );

            return ResponseEntity.ok(pendingLessons);
        } catch (Exception e) {
            log.error("Error fetching pending requests for user {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Lesson>> getTutorLessons(
            @PathVariable Long tutorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        if (start == null) {
            start = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        }
        if (end == null) {
            end = start.plusMonths(1);
        }
        
        List<Lesson> lessons = lessonRepository.findByTutorIdAndStartTimeBetween(tutorId, start, end);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Lesson>> getStudentLessons(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        if (start == null) {
            start = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        }
        if (end == null) {
            end = start.plusMonths(1);
        }
        
        List<Lesson> lessons = lessonRepository.findByStudentIdAndStartTimeBetween(studentId, start, end);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/request")
    public ResponseEntity<Lesson> createRequest(@RequestBody Map<String, Object> requestData) {
        try {
            log.info("Received lesson request data: {}", requestData);

            // Проверяем наличие всех необходимых полей
            if (!requestData.containsKey("tutorId") || !requestData.containsKey("studentId") ||
                !requestData.containsKey("startTime") || !requestData.containsKey("endTime") ||
                !requestData.containsKey("subject")) {
                log.error("Missing required fields in request data");
                return ResponseEntity.badRequest().body(null);
            }

            Long tutorId = Long.parseLong(requestData.get("tutorId").toString());
            Long studentId = Long.parseLong(requestData.get("studentId").toString());
            String startTimeStr = requestData.get("startTime").toString();
            String endTimeStr = requestData.get("endTime").toString();
            String subject = requestData.get("subject").toString();
            String description = requestData.getOrDefault("description", "").toString();

            try {
                // Парсим даты в LocalDateTime, обрабатывая разные форматы
                LocalDateTime startTime;
                LocalDateTime endTime;

                if (startTimeStr.contains("Z")) {
                    // Если дата в формате с UTC (с 'Z' на конце)
                    startTime = LocalDateTime.parse(startTimeStr.substring(0, 19));
                    endTime = LocalDateTime.parse(endTimeStr.substring(0, 19));
                } else {
                    // Если дата в обычном формате
                    startTime = LocalDateTime.parse(startTimeStr);
                    endTime = LocalDateTime.parse(endTimeStr);
                }

                // Проверки...
                if (startTime.isBefore(LocalDateTime.now())) {
                    log.error("Start time is in the past: {}", startTime);
                    return ResponseEntity.badRequest().body(null);
                }

                if (!endTime.isAfter(startTime)) {
                    log.error("End time is not after start time: start={}, end={}", startTime, endTime);
                    return ResponseEntity.badRequest().body(null);
                }

                // Остальной код...
                User tutor = userRepository.findById(tutorId)
                        .orElseThrow(() -> new RuntimeException("Tutor not found"));
                User student = userRepository.findById(studentId)
                        .orElseThrow(() -> new RuntimeException("Student not found"));

                Lesson lesson = new Lesson();
                lesson.setTutor(tutor);
                lesson.setStudent(student);
                lesson.setStartTime(startTime);
                lesson.setEndTime(endTime);
                lesson.setSubject(subject);
                lesson.setDescription(description);
                lesson.setStatus(Lesson.LessonStatus.PENDING);

                Lesson savedLesson = lessonRepository.save(lesson);
                return ResponseEntity.ok(savedLesson);

            } catch (DateTimeParseException e) {
                log.error("Error parsing dates: startTime={}, endTime={}", startTimeStr, endTimeStr, e);
                return ResponseEntity.badRequest().body(null);
            }
        } catch (Exception e) {
            log.error("Error creating lesson request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/{lessonId}/approve")
    public ResponseEntity<Lesson> approveRequest(@PathVariable Long lessonId) {
        try {
            log.info("Approving lesson with ID: {}", lessonId);
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            
            // Проверяем, что урок в статусе PENDING
            if (lesson.getStatus() != Lesson.LessonStatus.PENDING) {
                log.warn("Cannot approve lesson {} - wrong status: {}", lessonId, lesson.getStatus());
                return ResponseEntity.badRequest().build();
            }
            
            lesson.setStatus(Lesson.LessonStatus.APPROVED);
            Lesson savedLesson = lessonRepository.save(lesson);
            log.info("Lesson {} approved successfully", lessonId);
            return ResponseEntity.ok(savedLesson);
        } catch (Exception e) {
            log.error("Error approving lesson {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{lessonId}/reject")
    public ResponseEntity<Lesson> rejectRequest(@PathVariable Long lessonId) {
        try {
            log.info("Rejecting lesson with ID: {}", lessonId);
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            
            // Проверяем, что урок в статусе PENDING
            if (lesson.getStatus() != Lesson.LessonStatus.PENDING) {
                log.warn("Cannot reject lesson {} - wrong status: {}", lessonId, lesson.getStatus());
                return ResponseEntity.badRequest().build();
            }
            
            lesson.setStatus(Lesson.LessonStatus.REJECTED);
            Lesson savedLesson = lessonRepository.save(lesson);
            log.info("Lesson {} rejected successfully", lessonId);
            return ResponseEntity.ok(savedLesson);
        } catch (Exception e) {
            log.error("Error rejecting lesson {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{lessonId}/complete")
    public ResponseEntity<Lesson> completeLesson(@PathVariable Long lessonId) {
        try {
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            lesson.setStatus(Lesson.LessonStatus.COMPLETED);
            return ResponseEntity.ok(lessonRepository.save(lesson));
        } catch (Exception e) {
            log.error("Error completing lesson {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{lessonId}/cancel")
    public ResponseEntity<Lesson> cancelLesson(@PathVariable Long lessonId) {
        try {
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            lesson.setStatus(Lesson.LessonStatus.CANCELLED);
            return ResponseEntity.ok(lessonRepository.save(lesson));
        } catch (Exception e) {
            log.error("Error cancelling lesson {}", lessonId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{lessonId}/status")
    public ResponseEntity<?> updateLessonStatus(
        @PathVariable Long lessonId,
        @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

            lesson.setStatus(Lesson.LessonStatus.valueOf(status));
            lessonRepository.save(lesson);

            return ResponseEntity.ok(lesson);
        } catch (Exception e) {
            log.error("Error updating lesson status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}