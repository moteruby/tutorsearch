package com.example.demo.controller;

import com.example.demo.dto.ChatPreviewDTO;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@Slf4j
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<ChatPreviewDTO>> getUserChats(@PathVariable Long userId) {
        try {
            List<User> chatParticipants = messageRepository.findChatParticipants(userId);
            
            if (chatParticipants == null || chatParticipants.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<ChatPreviewDTO> chats = chatParticipants.stream()
                .filter(participant -> participant != null)
                .map(participant -> {
                    ChatPreviewDTO chat = new ChatPreviewDTO();
                    chat.setUserId(participant.getId());
                    chat.setUsername(participant.getUsername());
                    chat.setImageUrl(participant.getImageUrl());
                    
                    Message lastMessage = messageRepository.findLastMessage(userId, participant.getId());
                    if (lastMessage != null) {
                        chat.setLastMessage(lastMessage.getContent());
                        chat.setLastMessageTime(lastMessage.getTimestamp());
                        chat.setUnread(false);
                    }
                    
                    return chat;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            log.error("Error getting user chats for userId: " + userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/history/{userId1}/{userId2}")
    public ResponseEntity<List<Message>> getChatHistory(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        List<Message> messages = messageRepository.findChatHistory(userId1, userId2);
        return ResponseEntity.ok(messages);
    }
}
