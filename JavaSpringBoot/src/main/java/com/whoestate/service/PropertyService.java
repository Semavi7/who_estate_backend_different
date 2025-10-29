package com.whoestate.service;

import java.util.List;

import com.whoestate.dto.CreatePropertyDto;
import com.whoestate.dto.UpdatePropertyDto;
import com.whoestate.entity.Property;

public interface PropertyService {
    Property create(CreatePropertyDto createPropertyDto);
    Property findById(String id);
    List<Property> findAll();
    List<Property> findByUserId(String userId);
    List<Property> findApprovedProperties();
    List<Property> findByCity(String city);
    List<Property> findByPropertyType(String propertyType);
    Property update(String id, UpdatePropertyDto updatePropertyDto);
    boolean delete(String id);
}