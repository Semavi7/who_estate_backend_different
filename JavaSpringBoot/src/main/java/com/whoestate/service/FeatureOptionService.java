package com.whoestate.service;

import java.util.List;

import com.whoestate.dto.CreateFeatureOptionDto;
import com.whoestate.dto.UpdateFeatureOptionDto;
import com.whoestate.entity.FeatureOption;

public interface FeatureOptionService {
    FeatureOption create(CreateFeatureOptionDto createFeatureOptionDto);
    FeatureOption findById(String id);
    List<FeatureOption> findAll();
    List<FeatureOption> findByCategory(String category);
    List<FeatureOption> findActiveFeatures();
    FeatureOption update(String id, UpdateFeatureOptionDto updateFeatureOptionDto);
    boolean delete(String id);
}