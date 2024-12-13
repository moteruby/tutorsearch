package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-history")
public class ChatHistoryController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long userId) {
        List<Message> messages = messageRepository.findUserChats(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{userId1}/{userId2}")
    public ResponseEntity<List<Message>> getChatHistoryBetweenUsers(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        List<Message> messages = messageRepository.findChatHistory(userId1, userId2);
        return ResponseEntity.ok(messages);
    }
}
