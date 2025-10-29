package com.whoestate.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.whoestate.entity.Message;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderId(String senderId);
    List<Message> findByReceiverId(String receiverId);
    List<Message> findByPropertyId(String propertyId);
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);
}