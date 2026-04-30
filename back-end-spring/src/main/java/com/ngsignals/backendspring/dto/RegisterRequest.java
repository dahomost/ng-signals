package com.ngsignals.backendspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
  @JsonProperty("first_name")
  @NotBlank
  private String firstName;

  @JsonProperty("last_name")
  @NotBlank
  private String lastName;

  @JsonProperty("email")
  @NotBlank
  @Email
  private String email;

  @JsonProperty("password")
  @NotBlank
  @Size(min = 8, message = "Password must be at least 8 characters")
  private String password;

  @JsonProperty("phone_number")
  private String phoneNumber;

  @JsonProperty("address")
  private String address;

  @JsonProperty("ssn")
  private String ssn;

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getSsn() {
    return ssn;
  }

  public void setSsn(String ssn) {
    this.ssn = ssn;
  }
}
