package com.whoestate.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.whoestate.dto.CreateMessageDto;
import com.whoestate.entity.Message;
import com.whoestate.repository.MessageRepository;
import com.whoestate.service.MessageService;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Message create(CreateMessageDto createMessageDto) {
        Message message = new Message();
        message.setSenderId(createMessageDto.getSenderId());
        message.setReceiverId(createMessageDto.getReceiverId());
        message.setPropertyId(createMessageDto.getPropertyId());
        message.setContent(createMessageDto.getContent());
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        return messageRepository.save(message);
    }

    @Override
    public Message findById(String id) {
        return messageRepository.findById(id).orElse(null);
    }

    @Override
    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    @Override
    public List<Message> findBySenderId(String senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    @Override
    public List<Message> findByReceiverId(String receiverId) {
        return messageRepository.findByReceiverId(receiverId);
    }

    @Override
    public List<Message> findByPropertyId(String propertyId) {
        return messageRepository.findByPropertyId(propertyId);
    }

    @Override
    public List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId) {
        return messageRepository.findBySenderIdAndReceiverId(senderId, receiverId);
    }

    @Override
    public boolean delete(String id) {
        if (messageRepository.existsById(id)) {
            messageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}