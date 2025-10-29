package com.whoestate.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.whoestate.dto.CreateClientIntakeDto;
import com.whoestate.entity.ClientIntake;
import com.whoestate.repository.ClientIntakeRepository;
import com.whoestate.service.ClientIntakeService;

@Service
public class ClientIntakeServiceImpl implements ClientIntakeService {

    @Autowired
    private ClientIntakeRepository clientIntakeRepository;

    @Override
    public ClientIntake create(CreateClientIntakeDto createClientIntakeDto) {
        ClientIntake clientIntake = new ClientIntake();
        clientIntake.setName(createClientIntakeDto.getName());
        clientIntake.setSurname(createClientIntakeDto.getSurname());
        clientIntake.setEmail(createClientIntakeDto.getEmail());
        clientIntake.setPhoneNumber(createClientIntakeDto.getPhoneNumber());
        clientIntake.setMessage(createClientIntakeDto.getMessage());
        clientIntake.setPropertyType(createClientIntakeDto.getPropertyType());
        clientIntake.setPropertyLocation(createClientIntakeDto.getPropertyLocation());
        clientIntake.setBudget(createClientIntakeDto.getBudget());
        clientIntake.setCreatedAt(LocalDateTime.now());

        return clientIntakeRepository.save(clientIntake);
    }

    @Override
    public ClientIntake findById(String id) {
        return clientIntakeRepository.findById(id).orElse(null);
    }

    @Override
    public List<ClientIntake> findAll() {
        return clientIntakeRepository.findAll();
    }

    @Override
    public boolean delete(String id) {
        if (clientIntakeRepository.existsById(id)) {
            clientIntakeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}