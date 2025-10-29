package com.whoestate.service;

import com.whoestate.dto.LoginResponseDto;

public interface AuthService {
    LoginResponseDto login(String email, String password);
    String forgotPassword(String email);
    String resetPassword(String token, String newPassword);
}