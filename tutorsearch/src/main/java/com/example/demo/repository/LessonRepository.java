package com.example.demo.repository;

import com.example.demo.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByTutorIdAndStartTimeBetween(
            Long tutorId, LocalDateTime start, LocalDateTime end);

    List<Lesson> findByStudentIdAndStartTimeBetween(
            Long studentId, LocalDateTime start, LocalDateTime end);

    List<Lesson> findByStatusAndStartTimeBetween(
            Lesson.LessonStatus status, LocalDateTime start, LocalDateTime end);

    @Query("SELECT l FROM Lesson l " +
            "WHERE (l.student.id = :userId OR l.tutor.id = :userId) " +
            "AND l.status = 'PENDING' " +
            "ORDER BY l.startTime ASC")
    List<Lesson> findPendingRequestsForUser(@Param("userId") Long userId);
}
