package com.ngsignals.backendspring.repository;

import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

@Repository
public class DynamoDbUserRepository implements UserRepository {
  private final DynamoDbClient dynamoDbClient;
  private final String usersTable;

  public DynamoDbUserRepository(
      DynamoDbClient dynamoDbClient,
      @Value("${app.users-table}") String usersTable) {
    this.dynamoDbClient = dynamoDbClient;
    this.usersTable = usersTable;
  }

  @Override
  public void save(Map<String, Object> userItem) {
    Map<String, AttributeValue> item = new HashMap<>();
    item.put("id", AttributeValue.builder().s((String) userItem.get("id")).build());
    item.put("first_name", AttributeValue.builder().s((String) userItem.get("first_name")).build());
    item.put("last_name", AttributeValue.builder().s((String) userItem.get("last_name")).build());
    item.put("address", AttributeValue.builder().s((String) userItem.get("address")).build());
    item.put("email", AttributeValue.builder().s((String) userItem.get("email")).build());
    item.put("phone_number", AttributeValue.builder().s((String) userItem.get("phone_number")).build());
    item.put(
        "social_security_number",
        AttributeValue.builder().s((String) userItem.get("social_security_number")).build());
    item.put("password_hash", AttributeValue.builder().s((String) userItem.get("password_hash")).build());
    item.put("role", AttributeValue.builder().s((String) userItem.get("role")).build());
    item.put("is_active", AttributeValue.builder().bool((Boolean) userItem.get("is_active")).build());
    item.put("created_at", AttributeValue.builder().s((String) userItem.get("created_at")).build());

    PutItemRequest request = PutItemRequest.builder().tableName(usersTable).item(item).build();
    dynamoDbClient.putItem(request);
  }
}
