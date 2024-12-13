package com.example.demo.repository;

import com.example.demo.model.Message;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) ORDER BY m.timestamp DESC")
    List<Message> findUserChats(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
           "ORDER BY m.timestamp")
    List<Message> findChatHistory(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT DISTINCT u FROM Message m " +
           "JOIN User u ON (u.id = m.sender.id OR u.id = m.receiver.id) " +
           "WHERE (m.sender.id = :userId OR m.receiver.id = :userId) " +
           "AND u.id != :userId")
    List<User> findChatParticipants(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
           "ORDER BY m.timestamp DESC")
    List<Message> findLastMessageQuery(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    default Message findLastMessage(Long userId1, Long userId2) {
        List<Message> messages = findLastMessageQuery(userId1, userId2);
        return messages.isEmpty() ? null : messages.get(0);
    }
}
