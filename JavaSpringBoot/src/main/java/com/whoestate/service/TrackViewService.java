package com.whoestate.service;

import java.util.List;

import com.whoestate.entity.TrackView;

public interface TrackViewService {
    TrackView create(String userId, String propertyId);
    TrackView findById(String id);
    List<TrackView> findAll();
    List<TrackView> findByUserId(String userId);
    List<TrackView> findByPropertyId(String propertyId);
    List<TrackView> findByUserIdAndPropertyId(String userId, String propertyId);
    boolean delete(String id);
}