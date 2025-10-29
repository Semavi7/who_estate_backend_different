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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whoestate.dto.CreateUserDto;
import com.whoestate.dto.UpdatePasswordDto;
import com.whoestate.dto.UpdateUserDto;
import com.whoestate.entity.User;
import com.whoestate.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User user = userService.findById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserDto createUserDto) {
        User user = userService.createAsync(createUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @Valid @RequestBody UpdateUserDto updateUserDto) {
        User user = userService.update(id, updateUserDto);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable String id, @Valid @RequestBody UpdatePasswordDto updatePasswordDto) {
        boolean success = userService.updatePassword(id, updatePasswordDto.getOldPassword(), updatePasswordDto.getNewPassword());
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "Password updated successfully";
            });
        } else {
            return ResponseEntity.badRequest().body(new Object() {
                public String message = "Old password is incorrect";
            });
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        boolean success = userService.delete(id);
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "User deleted successfully";
            });
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}