package com.ngsignals.backendspring.service;

import com.ngsignals.backendspring.dto.RegisterRequest;
import com.ngsignals.backendspring.repository.UserRepository;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

  public RegisterService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public String createUser(RegisterRequest request) {
    String id = UUID.randomUUID().toString();
    String hashedPassword = passwordEncoder.encode(request.getPassword());

    Map<String, Object> item = new HashMap<>();
    item.put("id", id);
    item.put("first_name", safe(request.getFirstName()));
    item.put("last_name", safe(request.getLastName()));
    item.put("address", safe(request.getAddress()));
    item.put("email", safe(request.getEmail()));
    item.put("phone_number", safe(request.getPhoneNumber()));
    item.put("social_security_number", safe(request.getSsn()));
    item.put("password_hash", hashedPassword);
    item.put("role", "user");
    item.put("is_active", true);
    item.put("created_at", Instant.now().toString());

    userRepository.save(item);
    return id;
  }

  private String safe(String value) {
    return value == null ? "" : value.trim();
  }
}
