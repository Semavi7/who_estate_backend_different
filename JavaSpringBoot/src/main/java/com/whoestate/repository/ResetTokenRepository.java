package com.whoestate.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.whoestate.entity.ResetToken;

@Repository
public interface ResetTokenRepository extends MongoRepository<ResetToken, String> {
    Optional<ResetToken> findByToken(String token);
    Optional<ResetToken> findByUserId(String userId);
}