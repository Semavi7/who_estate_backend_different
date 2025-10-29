package com.whoestate.service.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.whoestate.config.JwtUtil;
import com.whoestate.dto.LoginResponseDto;
import com.whoestate.entity.ResetToken;
import com.whoestate.entity.User;
import com.whoestate.repository.ResetTokenRepository;
import com.whoestate.repository.UserRepository;
import com.whoestate.service.AuthService;
import com.whoestate.service.MailerService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResetTokenRepository resetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MailerService mailerService;

    @Override
    public LoginResponseDto login(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return new LoginResponseDto(token, user.getEmail(), user.getName(), user.getRoles());
        }
        return null;
    }

    @Override
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            // Delete any existing reset tokens for this user
            resetTokenRepository.findByUserId(user.getId()).ifPresent(token -> 
                resetTokenRepository.deleteById(token.getId()));

            // Create a new reset token
            String token = UUID.randomUUID().toString();
            ResetToken resetToken = new ResetToken(token, user.getId());
            resetTokenRepository.save(resetToken);

            // Send email with reset token
            mailerService.sendResetPasswordMail(user.getEmail(), token);

            return "Password reset link sent to your email.";
        }
        return "If the email exists, a reset link has been sent.";
    }

    @Override
    public String resetPassword(String token, String newPassword) {
        ResetToken resetToken = resetTokenRepository.findByToken(token).orElse(null);
        if (resetToken != null && !resetToken.isExpired()) {
            User user = userRepository.findById(resetToken.getUserId()).orElse(null);
            if (user != null) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                
                // Delete the used token
                resetTokenRepository.delete(resetToken);
                
                return "Password has been reset successfully.";
            }
        }
        return "Invalid or expired token.";
    }
}