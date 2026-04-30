# back-end-spring

Spring Boot + Maven version of the existing Node backend API.

## Endpoints

- `GET /api/v1/ping` -> `{ "ok": true, "message": "API is up" }`
- `POST /api/v1/register` -> `{ "message": "User created", "id": "<uuid>" }`

Request body for register:

```json
{
  "first_name": "Razan",
  "last_name": "Test",
  "email": "razan@test.com",
  "password": "Password123",
  "phone_number": "1234567890",
  "address": "123 Main St",
  "ssn": "111-22-3333"
}
```

## Run

Prerequisites:
- Java 17+
- Maven 3.9+
- AWS credentials configured locally (for DynamoDB access)

```bash
cd back-end-spring
mvn spring-boot:run
```

App starts on port `8080`.

## Configuration

Edit `src/main/resources/application.properties`:

- `server.port=8080`
- `app.users-table=users`
- `app.aws-region=us-east-1`
