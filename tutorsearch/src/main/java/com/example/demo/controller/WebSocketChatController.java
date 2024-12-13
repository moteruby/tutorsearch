package com.example.demo.controller;

import com.example.demo.dto.ChatMessage;
import com.example.demo.model.Message;
import com.example.demo.model.User;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
@Slf4j
public class WebSocketChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        log.info("Received message: {}", chatMessage);
        chatMessage.setTimestamp(LocalDateTime.now());

        try {
            // Сохраняем сообщение в базу данных
            User sender = userRepository.findById(chatMessage.getSenderId())
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            User receiver = userRepository.findById(chatMessage.getReceiverId())
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            Message message = new Message();
            message.setSender(sender);
            message.setReceiver(receiver);
            message.setContent(chatMessage.getContent());
            message.setTimestamp(chatMessage.getTimestamp());
            messageRepository.save(message);

            log.info("Message saved to database");

            // Отправляем сообщ��ние получателю через WebSocket
            String destination = "/user/" + chatMessage.getReceiverId() + "/queue/messages";
            log.info("Sending to destination: {}", destination);
            messagingTemplate.convertAndSend(destination, chatMessage);
            log.info("Message sent via WebSocket");

        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }

    @MessageMapping("/chat.test")
    public void handleTestMessage(@Payload Map<String, Object> testMessage) {
        log.info("Received test message: {}", testMessage);
        // Отправляем подтверждение обратно
        String userId = testMessage.get("userId").toString();
        messagingTemplate.convertAndSend("/user/" + userId + "/queue/messages",
            Map.of(
                "type", "TEST",
                "content", "Connection successful",
                "timestamp", LocalDateTime.now()
            ));
    }
}