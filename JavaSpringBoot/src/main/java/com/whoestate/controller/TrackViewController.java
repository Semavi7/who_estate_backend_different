package com.whoestate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.whoestate.entity.TrackView;
import com.whoestate.service.TrackViewService;

@RestController
@RequestMapping("/api/trackviews")
@CrossOrigin(origins = "*")
public class TrackViewController {

    @Autowired
    private TrackViewService trackViewService;

    @GetMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<TrackView>> getAllTrackViews() {
        // For now, we'll return an empty list or handle appropriately
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrackView> getTrackView(@PathVariable String id) {
        TrackView trackView = trackViewService.findById(id);
        if (trackView != null) {
            return ResponseEntity.ok(trackView);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<TrackView> createTrackView(@RequestParam String userId, @RequestParam String propertyId) {
        TrackView trackView = trackViewService.create(userId, propertyId);
        return ResponseEntity.ok(trackView);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrackView(@PathVariable String id) {
        boolean success = trackViewService.delete(id);
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "Track view deleted successfully";
            });
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrackView>> getTrackViewsByUserId(@PathVariable String userId) {
        List<TrackView> trackViews = trackViewService.findByUserId(userId);
        return ResponseEntity.ok(trackViews);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<TrackView>> getTrackViewsByPropertyId(@PathVariable String propertyId) {
        List<TrackView> trackViews = trackViewService.findByPropertyId(propertyId);
        return ResponseEntity.ok(trackViews);
    }

    @GetMapping("/user/{userId}/property/{propertyId}")
    public ResponseEntity<List<TrackView>> getTrackViewsByUserAndProperty(@PathVariable String userId, @PathVariable String propertyId) {
        List<TrackView> trackViews = trackViewService.findByUserIdAndPropertyId(userId, propertyId);
        return ResponseEntity.ok(trackViews);
    }
}