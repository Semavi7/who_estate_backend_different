package com.whoestate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whoestate.dto.CreateMessageDto;
import com.whoestate.entity.Message;
import com.whoestate.service.MessageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.findAll();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessage(@PathVariable String id) {
        Message message = messageService.findById(id);
        if (message != null) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Message> createMessage(@Valid @RequestBody CreateMessageDto createMessageDto) {
        Message message = messageService.create(createMessageDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        boolean success = messageService.delete(id);
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "Message deleted successfully";
            });
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<Message>> getMessagesBySenderId(@PathVariable String senderId) {
        List<Message> messages = messageService.findBySenderId(senderId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<Message>> getMessagesByReceiverId(@PathVariable String receiverId) {
        List<Message> messages = messageService.findByReceiverId(receiverId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Message>> getMessagesByPropertyId(@PathVariable String propertyId) {
        List<Message> messages = messageService.findByPropertyId(propertyId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversation/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(@PathVariable String senderId, @PathVariable String receiverId) {
        List<Message> messages = messageService.findBySenderIdAndReceiverId(senderId, receiverId);
        return ResponseEntity.ok(messages);
    }
}