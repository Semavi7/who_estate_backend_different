package com.whoestate.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.whoestate.service.FileUploadService;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileUploadService.uploadFile(file);
            String uploadedFileName = fileName;
            return ResponseEntity.ok(new Object() {
                public String fileName = uploadedFileName;
                public String message = "File uploaded successfully";
            });
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new Object() {
                public String message = "File upload failed: " + e.getMessage();
            });
        }
    }

    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName) {
        try {
            boolean deleted = fileUploadService.deleteFile(fileName);
            if (deleted) {
                return ResponseEntity.ok(new Object() {
                    public String message = "File deleted successfully";
                });
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new Object() {
                public String message = "File deletion failed: " + e.getMessage();
            });
        }
    }
}