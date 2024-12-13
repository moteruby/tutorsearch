package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long senderId;
    private Long receiverId;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
