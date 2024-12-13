package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatPreviewDTO {
    private Long userId;
    private String username;
    private String imageUrl;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private boolean unread;
} 