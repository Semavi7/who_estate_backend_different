package com.whoestate.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import com.whoestate.dto.CreateUserDto;
import com.whoestate.dto.UpdateUserDto;
import com.whoestate.entity.User;

public interface UserService {
    CompletableFuture<Void> initializeAdminUserAsync();
    User createAsync(CreateUserDto createUserDto);
    User findByEmail(String email);
    User findById(String id);
    List<User> findAll();
    User update(String id, UpdateUserDto updateUserDto);
    boolean updatePassword(String id, String oldPassword, String newPassword);
    boolean delete(String id);
    boolean validateUser(String email, String password);
}