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

import com.whoestate.dto.CreatePropertyDto;
import com.whoestate.dto.UpdatePropertyDto;
import com.whoestate.entity.Property;
import com.whoestate.service.PropertyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.findApprovedProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getProperty(@PathVariable String id) {
        Property property = propertyService.findById(id);
        if (property != null) {
            return ResponseEntity.ok(property);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Property> createProperty(@Valid @RequestBody CreatePropertyDto createPropertyDto) {
        Property property = propertyService.create(createPropertyDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Property> updateProperty(@PathVariable String id, @Valid @RequestBody UpdatePropertyDto updatePropertyDto) {
        Property property = propertyService.update(id, updatePropertyDto);
        if (property != null) {
            return ResponseEntity.ok(property);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteProperty(@PathVariable String id) {
        boolean success = propertyService.delete(id);
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "Property deleted successfully";
            });
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Property>> getPropertiesByUserId(@PathVariable String userId) {
        List<Property> properties = propertyService.findByUserId(userId);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Property>> getPropertiesByCity(@PathVariable String city) {
        List<Property> properties = propertyService.findByCity(city);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/type/{propertyType}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable String propertyType) {
        List<Property> properties = propertyService.findByPropertyType(propertyType);
        return ResponseEntity.ok(properties);
    }
}