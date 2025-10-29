package com.whoestate.service;

public interface MailerService {
    void sendWelcomeMail(String to, String name);
    void sendResetPasswordMail(String to, String token);
    void sendContactNotification(String to, String message);
}