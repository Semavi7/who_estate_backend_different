package com.whoestate.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.whoestate.dto.CreateFeatureOptionDto;
import com.whoestate.dto.UpdateFeatureOptionDto;
import com.whoestate.entity.FeatureOption;
import com.whoestate.repository.FeatureOptionRepository;
import com.whoestate.service.FeatureOptionService;

@Service
public class FeatureOptionServiceImpl implements FeatureOptionService {

    @Autowired
    private FeatureOptionRepository featureOptionRepository;

    @Override
    public FeatureOption create(CreateFeatureOptionDto createFeatureOptionDto) {
        FeatureOption featureOption = new FeatureOption();
        featureOption.setName(createFeatureOptionDto.getName());
        featureOption.setCategory(createFeatureOptionDto.getCategory());
        featureOption.setIsActive(true);
        featureOption.setCreatedAt(LocalDateTime.now());
        featureOption.setUpdatedAt(LocalDateTime.now());

        return featureOptionRepository.save(featureOption);
    }

    @Override
    public FeatureOption findById(String id) {
        return featureOptionRepository.findById(id).orElse(null);
    }

    @Override
    public List<FeatureOption> findAll() {
        return featureOptionRepository.findAll();
    }

    @Override
    public List<FeatureOption> findByCategory(String category) {
        return featureOptionRepository.findByCategory(category);
    }

    @Override
    public List<FeatureOption> findActiveFeatures() {
        return featureOptionRepository.findByIsActiveTrue();
    }

    @Override
    public FeatureOption update(String id, UpdateFeatureOptionDto updateFeatureOptionDto) {
        FeatureOption featureOption = findById(id);
        if (featureOption == null) {
            return null;
        }

        if (updateFeatureOptionDto.getName() != null) {
            featureOption.setName(updateFeatureOptionDto.getName());
        }
        if (updateFeatureOptionDto.getCategory() != null) {
            featureOption.setCategory(updateFeatureOptionDto.getCategory());
        }
        if (updateFeatureOptionDto.getIsActive() != null) {
            featureOption.setIsActive(updateFeatureOptionDto.getIsActive());
        }

        featureOption.setUpdatedAt(LocalDateTime.now());
        return featureOptionRepository.save(featureOption);
    }

    @Override
    public boolean delete(String id) {
        if (featureOptionRepository.existsById(id)) {
            featureOptionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}