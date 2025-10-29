package com.whoestate.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.whoestate.service.FileUploadService;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private final String UPLOAD_DIR = "uploads/";

    public FileUploadServiceImpl() {
        // Create upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf('.')) : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Create file path
        Path filePath = Paths.get(UPLOAD_DIR, uniqueFilename);

        // Save file
        Files.write(filePath, file.getBytes());

        return uniqueFilename;
    }

    @Override
    public boolean deleteFile(String fileName) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        return Files.deleteIfExists(filePath);
    }
}