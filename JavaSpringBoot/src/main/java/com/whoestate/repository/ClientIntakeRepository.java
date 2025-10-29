package com.whoestate.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.whoestate.entity.ClientIntake;

@Repository
public interface ClientIntakeRepository extends MongoRepository<ClientIntake, String> {
    // Additional query methods can be added here if needed
}