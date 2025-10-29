package com.whoestate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateMessageDto {
    @NotNull(message = "Sender ID is required")
    private String senderId;

    @NotNull(message = "Receiver ID is required")
    private String receiverId;

    @NotNull(message = "Property ID is required")
    private String propertyId;

    @NotBlank(message = "Content is required")
    private String content;

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}