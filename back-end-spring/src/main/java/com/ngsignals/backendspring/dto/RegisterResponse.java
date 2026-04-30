package com.ngsignals.backendspring.dto;

public class RegisterResponse {
  private String message;
  private String id;

  public RegisterResponse() {}

  public RegisterResponse(String message, String id) {
    this.message = message;
    this.id = id;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
}
