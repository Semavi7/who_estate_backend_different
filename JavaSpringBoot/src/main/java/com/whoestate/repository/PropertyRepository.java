package com.whoestate.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.whoestate.entity.Property;

@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {
    List<Property> findByUserId(String userId);
    List<Property> findByIsApprovedTrue();
    List<Property> findByCity(String city);
    List<Property> findByPropertyType(String propertyType);
}