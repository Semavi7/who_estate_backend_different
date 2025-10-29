package com.whoestate.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.whoestate.entity.TrackView;

@Repository
public interface TrackViewRepository extends MongoRepository<TrackView, String> {
    List<TrackView> findByUserId(String userId);
    List<TrackView> findByPropertyId(String propertyId);
    List<TrackView> findByUserIdAndPropertyId(String userId, String propertyId);
}