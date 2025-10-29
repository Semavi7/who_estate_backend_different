package com.whoestate.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.whoestate.entity.TrackView;
import com.whoestate.repository.TrackViewRepository;
import com.whoestate.service.TrackViewService;

@Service
public class TrackViewServiceImpl implements TrackViewService {

    @Autowired
    private TrackViewRepository trackViewRepository;

    @Override
    public TrackView create(String userId, String propertyId) {
        // Check if a track view already exists for this user and property
        List<TrackView> existing = trackViewRepository.findByUserIdAndPropertyId(userId, propertyId);
        if (!existing.isEmpty()) {
            // If exists, return the existing one or update the timestamp
            TrackView trackView = existing.get(0);
            trackView.setViewedAt(LocalDateTime.now());
            return trackViewRepository.save(trackView);
        }

        TrackView trackView = new TrackView();
        trackView.setUserId(userId);
        trackView.setPropertyId(propertyId);
        trackView.setViewedAt(LocalDateTime.now());

        return trackViewRepository.save(trackView);
    }

    @Override
    public TrackView findById(String id) {
        return trackViewRepository.findById(id).orElse(null);
    }

    @Override
    public List<TrackView> findAll() {
        return trackViewRepository.findAll();
    }

    @Override
    public List<TrackView> findByUserId(String userId) {
        return trackViewRepository.findByUserId(userId);
    }

    @Override
    public List<TrackView> findByPropertyId(String propertyId) {
        return trackViewRepository.findByPropertyId(propertyId);
    }

    @Override
    public List<TrackView> findByUserIdAndPropertyId(String userId, String propertyId) {
        return trackViewRepository.findByUserIdAndPropertyId(userId, propertyId);
    }

    @Override
    public boolean delete(String id) {
        if (trackViewRepository.existsById(id)) {
            trackViewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}