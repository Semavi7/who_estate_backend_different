package com.whoestate.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.whoestate.dto.CreateUserDto;
import com.whoestate.dto.UpdateUserDto;
import com.whoestate.entity.User;
import com.whoestate.enums.Role;
import com.whoestate.repository.UserRepository;
import com.whoestate.service.MailerService;
import com.whoestate.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailerService mailerService;

    @Override
    public CompletableFuture<Void> initializeAdminUserAsync() {
        return CompletableFuture.runAsync(() -> {
            String adminEmail = "refiyederya@gmail.com";
            Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);

            if (existingAdmin.isEmpty()) {
                User adminUser = new User();
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode("123456"));
                adminUser.setName("Refiye Derya");
                adminUser.setSurname("Gürses");
                adminUser.setPhoneNumber(5368100880L);
                adminUser.setRoles(Role.Admin.toString());
                adminUser.setCreatedAt(LocalDateTime.now());

                userRepository.save(adminUser);
                System.out.println("Admin user created successfully");
            }
        });
    }

    @Override
    public User createAsync(CreateUserDto createUserDto) {
        User newUser = new User();
        newUser.setEmail(createUserDto.getEmail());
        newUser.setPassword(passwordEncoder.encode("123456")); // Default password
        newUser.setName(createUserDto.getName());
        newUser.setSurname(createUserDto.getSurname());
        newUser.setPhoneNumber(createUserDto.getPhoneNumber());
        newUser.setRoles(Role.Member.toString());
        newUser.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        // Send welcome email asynchronously
        CompletableFuture.runAsync(() -> {
            try {
                mailerService.sendWelcomeMail(savedUser.getEmail(), 
                    savedUser.getName() + " " + savedUser.getSurname());
            } catch (Exception e) {
                System.err.println("Welcome mail sending failed: " + e.getMessage());
            }
        });

        return savedUser;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User update(String id, UpdateUserDto updateUserDto) {
        User user = findById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (updateUserDto.getEmail() != null) {
            user.setEmail(updateUserDto.getEmail());
        }
        if (updateUserDto.getName() != null) {
            user.setName(updateUserDto.getName());
        }
        if (updateUserDto.getSurname() != null) {
            user.setSurname(updateUserDto.getSurname());
        }
        if (updateUserDto.getPhoneNumber() != null) {
            user.setPhoneNumber(updateUserDto.getPhoneNumber());
        }
        if (updateUserDto.getImage() != null) {
            user.setImage(updateUserDto.getImage());
        }

        return userRepository.save(user);
    }

    @Override
    public boolean updatePassword(String id, String oldPassword, String newPassword) {
        User user = findById(id);
        if (user == null || !passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    @Override
    public boolean delete(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public boolean validateUser(String email, String password) {
        User user = findByEmail(email);
        return user != null && passwordEncoder.matches(password, user.getPassword());
    }
}