package com.ngsignals.backendspring.controller;

import com.ngsignals.backendspring.dto.PingResponse;
import com.ngsignals.backendspring.dto.RegisterRequest;
import com.ngsignals.backendspring.dto.RegisterResponse;
import com.ngsignals.backendspring.service.RegisterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ApiController {
  private final RegisterService registerService;

  public ApiController(RegisterService registerService) {
    this.registerService = registerService;
  }

  @GetMapping("/ping")
  public ResponseEntity<PingResponse> ping() {
    return ResponseEntity.ok(new PingResponse(true, "API is up"));
  }

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
    String id = registerService.createUser(request);
    return ResponseEntity.ok(new RegisterResponse("User created", id));
  }
}
