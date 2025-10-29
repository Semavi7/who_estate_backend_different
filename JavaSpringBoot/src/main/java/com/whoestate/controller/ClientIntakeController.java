package com.whoestate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whoestate.dto.CreateClientIntakeDto;
import com.whoestate.entity.ClientIntake;
import com.whoestate.service.ClientIntakeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/client-intakes")
@CrossOrigin(origins = "*")
public class ClientIntakeController {

    @Autowired
    private ClientIntakeService clientIntakeService;

    @GetMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<ClientIntake>> getAllClientIntakes() {
        List<ClientIntake> clientIntakes = clientIntakeService.findAll();
        return ResponseEntity.ok(clientIntakes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientIntake> getClientIntake(@PathVariable String id) {
        ClientIntake clientIntake = clientIntakeService.findById(id);
        if (clientIntake != null) {
            return ResponseEntity.ok(clientIntake);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ClientIntake> createClientIntake(@Valid @RequestBody CreateClientIntakeDto createClientIntakeDto) {
        ClientIntake clientIntake = clientIntakeService.create(createClientIntakeDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(clientIntake);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteClientIntake(@PathVariable String id) {
        boolean success = clientIntakeService.delete(id);
        if (success) {
            return ResponseEntity.ok(new Object() {
                public String message = "Client intake deleted successfully";
            });
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}