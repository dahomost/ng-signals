package com.ngsignals.backendspring.repository;

import java.util.Map;

public interface UserRepository {
  void save(Map<String, Object> userItem);
}
