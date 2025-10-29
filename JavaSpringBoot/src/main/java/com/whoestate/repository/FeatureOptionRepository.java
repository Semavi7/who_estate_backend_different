package com.whoestate.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.whoestate.entity.FeatureOption;

@Repository
public interface FeatureOptionRepository extends MongoRepository<FeatureOption, String> {
    List<FeatureOption> findByCategory(String category);
    List<FeatureOption> findByIsActiveTrue();
}