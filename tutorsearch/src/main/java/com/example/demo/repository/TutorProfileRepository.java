package com.example.demo.repository;

import com.example.demo.model.TutorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorProfileRepository extends JpaRepository<TutorProfile, Long> {
    List<TutorProfile> findBySubjectsContaining(String subject);
}
