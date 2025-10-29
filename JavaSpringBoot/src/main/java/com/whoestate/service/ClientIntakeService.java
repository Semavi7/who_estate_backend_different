package com.whoestate.service;

import java.util.List;

import com.whoestate.dto.CreateClientIntakeDto;
import com.whoestate.entity.ClientIntake;

public interface ClientIntakeService {
    ClientIntake create(CreateClientIntakeDto createClientIntakeDto);
    ClientIntake findById(String id);
    List<ClientIntake> findAll();
    boolean delete(String id);
}