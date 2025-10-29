package com.whoestate.service;

import java.util.List;

import com.whoestate.dto.CreateMessageDto;
import com.whoestate.entity.Message;

public interface MessageService {
    Message create(CreateMessageDto createMessageDto);
    Message findById(String id);
    List<Message> findAll();
    List<Message> findBySenderId(String senderId);
    List<Message> findByReceiverId(String receiverId);
    List<Message> findByPropertyId(String propertyId);
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);
    boolean delete(String id);
}