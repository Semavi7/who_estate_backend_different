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

import com.whoestate.dto.CreateFeatureOptionDto;
import com.whoestate.dto.UpdateFeatureOptionDto;
import com.whoestate.entity.FeatureOption;
import com.whoestate.service.FeatureOptionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/feature-options")
@CrossOrigin(origins = "*")
public class FeatureOptionController {

    @Autowired
    private FeatureOptionService featureOptionService;

    @GetMapping
    public ResponseEntity<List<FeatureOption>> getAllFeatureOptions() {
        List<FeatureOption> featureOptions = featureOptionService.findActiveFeatures();
        return ResponseEntity.ok(featureOptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeatureOption> getFeatureOption(@PathVariable String id) {
        FeatureOption featureOption = featureOptionService.findById(id);
        if (featureOption != null) {
            return ResponseEntity.ok(featureOption);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<FeatureOption> createFeatureOption(@Valid @RequestBody CreateFeatureOptionDto createFeatureOptionDto) {
        FeatureOption featureOption = featureOptionService.create(createFeatureOptionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(featureOption);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<FeatureOption> updateFeatureOption(@PathVariable String id, @Valid @RequestBody UpdateFeatureOptionDto updateFeatureOptionDto) {
        FeatureOption featureOption = featureOptionService.update(id, updateFeatureOptionDto);
        if (featureOption != null) {
            return ResponseEntity.ok(featureOption);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteFeatureOption(@PathVariable String id) {
        boolean success = featureOptionService.delete(id);
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "Feature option deleted successfully";
            });
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FeatureOption>> getFeatureOptionsByCategory(@PathVariable String category) {
        List<FeatureOption> featureOptions = featureOptionService.findByCategory(category);
        return ResponseEntity.ok(featureOptions);
    }
}