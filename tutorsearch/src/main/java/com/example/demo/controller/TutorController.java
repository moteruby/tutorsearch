package com.example.demo.controller;

import com.example.demo.model.TutorProfile;
import com.example.demo.repository.TutorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutors")
public class TutorController {
    @Autowired
    private TutorProfileRepository tutorProfileRepository;

    @GetMapping("/search")
    public List<TutorProfile> searchTutors(@RequestParam String subject) {
        return tutorProfileRepository.findBySubjectsContaining(subject);
    }
}