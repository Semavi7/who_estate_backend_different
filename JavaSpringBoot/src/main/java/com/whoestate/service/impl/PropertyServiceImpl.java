package com.whoestate.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.whoestate.dto.CreatePropertyDto;
import com.whoestate.dto.UpdatePropertyDto;
import com.whoestate.entity.Property;
import com.whoestate.repository.PropertyRepository;
import com.whoestate.service.PropertyService;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public Property create(CreatePropertyDto createPropertyDto) {
        Property property = new Property();
        property.setTitle(createPropertyDto.getTitle());
        property.setDescription(createPropertyDto.getDescription());
        property.setAddress(createPropertyDto.getAddress());
        property.setCity(createPropertyDto.getCity());
        property.setDistrict(createPropertyDto.getDistrict());
        property.setPrice(createPropertyDto.getPrice());
        property.setPropertyType(createPropertyDto.getPropertyType());
        property.setPropertyStatus(createPropertyDto.getPropertyStatus());
        property.setBedrooms(createPropertyDto.getBedrooms());
        property.setBathrooms(createPropertyDto.getBathrooms());
        property.setArea(createPropertyDto.getArea());
        property.setImages(createPropertyDto.getImages());
        property.setUserId(createPropertyDto.getUserId());
        property.setCreatedAt(LocalDateTime.now());
        property.setUpdatedAt(LocalDateTime.now());

        return propertyRepository.save(property);
    }

    @Override
    public Property findById(String id) {
        return propertyRepository.findById(id).orElse(null);
    }

    @Override
    public List<Property> findAll() {
        return propertyRepository.findAll();
    }

    @Override
    public List<Property> findByUserId(String userId) {
        return propertyRepository.findByUserId(userId);
    }

    @Override
    public List<Property> findApprovedProperties() {
        return propertyRepository.findByIsApprovedTrue();
    }

    @Override
    public List<Property> findByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    @Override
    public List<Property> findByPropertyType(String propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }

    @Override
    public Property update(String id, UpdatePropertyDto updatePropertyDto) {
        Property property = findById(id);
        if (property == null) {
            return null;
        }

        if (updatePropertyDto.getTitle() != null) {
            property.setTitle(updatePropertyDto.getTitle());
        }
        if (updatePropertyDto.getDescription() != null) {
            property.setDescription(updatePropertyDto.getDescription());
        }
        if (updatePropertyDto.getAddress() != null) {
            property.setAddress(updatePropertyDto.getAddress());
        }
        if (updatePropertyDto.getCity() != null) {
            property.setCity(updatePropertyDto.getCity());
        }
        if (updatePropertyDto.getDistrict() != null) {
            property.setDistrict(updatePropertyDto.getDistrict());
        }
        if (updatePropertyDto.getPrice() != null) {
            property.setPrice(updatePropertyDto.getPrice());
        }
        if (updatePropertyDto.getPropertyType() != null) {
            property.setPropertyType(updatePropertyDto.getPropertyType());
        }
        if (updatePropertyDto.getPropertyStatus() != null) {
            property.setPropertyStatus(updatePropertyDto.getPropertyStatus());
        }
        if (updatePropertyDto.getBedrooms() != null) {
            property.setBedrooms(updatePropertyDto.getBedrooms());
        }
        if (updatePropertyDto.getBathrooms() != null) {
            property.setBathrooms(updatePropertyDto.getBathrooms());
        }
        if (updatePropertyDto.getArea() != null) {
            property.setArea(updatePropertyDto.getArea());
        }
        if (updatePropertyDto.getImages() != null) {
            property.setImages(updatePropertyDto.getImages());
        }
        if (updatePropertyDto.getIsApproved() != null) {
            property.setIsApproved(updatePropertyDto.getIsApproved());
        }

        property.setUpdatedAt(LocalDateTime.now());
        return propertyRepository.save(property);
    }

    @Override
    public boolean delete(String id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}