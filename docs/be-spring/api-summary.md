# Backend API Summary

The `back-end/` folder contains a Node.js serverless API deployed with the Serverless Framework. It exposes HTTP endpoints through API Gateway, runs business logic in AWS Lambda, and stores user data in DynamoDB using the AWS SDK.

## Main Runtime Stack

- Node.js 20.x Lambda runtime
- Serverless Framework v3
- API Gateway HTTP API
- AWS Lambda
- DynamoDB
- AWS SDK v3
- `bcryptjs` for password hashing
- `serverless-offline` for local API testing

## Main Methods Used

### `ping()`

This is a simple health-check Lambda handler. It returns a JSON response confirming that the API is running.

### `register(event)`

This is the main registration endpoint handler for:

```text
POST /api/v1/register
```

It does the following:

1. Parses the request body from API Gateway.
2. Supports normal JSON string bodies and base64-encoded bodies.
3. Validates required fields:
   - `first_name`
   - `last_name`
   - `email`
   - `password`
4. Enforces a minimum password length of 8 characters.
5. Calls `createRegisteredUser()` to save the user.
6. Returns either a success response with the new user ID or an error response.

### `parseRegisterBody(event)`

This helper normalizes incoming request data. It handles both real API Gateway requests, where `event.body` is a JSON string, and direct Lambda console tests, where the event may already be an object.

### `validateRegisterPayload(body)`

This helper validates the registration payload before touching DynamoDB. It protects the service from missing required fields and weak passwords.

### `createRegisteredUser(input)`

This is the main business logic method. It:

- Generates a unique user ID with `randomUUID()`.
- Hashes the password using bcrypt.
- Builds the DynamoDB user record.
- Adds default user metadata:
  - `role: "user"`
  - `is_active: true`
  - `created_at`
- Saves the item into DynamoDB with `PutCommand`.

### `getUserById(id)`

This method fetches a user from DynamoDB by primary key using `GetCommand`. It is available but not currently exposed as an API route.

### `hashPassword(plain)`

Hashes a plaintext password using bcrypt with 10 rounds.

### `verifyPassword(plain, hash)`

Compares a plaintext password against a stored bcrypt hash. This is ready for login/authentication logic, although login is not implemented yet.

## Deployment Configuration

`serverless.yml` defines two Lambda functions:

- `GET /api/v1/ping` -> `handler.ping`
- `POST /api/v1/register` -> `handler.register`

It also configures:

- AWS region: `us-east-1`
- Runtime: `nodejs20.x`
- CORS enabled
- `USERS_TABLE` environment variable
- IAM permissions for:
  - `dynamodb:PutItem`
  - `dynamodb:GetItem`

## Professional Architecture View

The backend is cleanly separated into layers:

- `handler.js`: API layer, request parsing, validation, and HTTP responses.
- `services/userService.js`: business logic for user creation and lookup.
- `utils/dynamo.js`: DynamoDB client configuration and table name handling.
- `utils/password.js`: password hashing and verification.

This is a good beginner-friendly serverless structure because API concerns, business logic, database access, and security helpers are separated instead of being mixed into one Lambda file.

## Recommended Next Steps

- Add duplicate email protection before creating a new user.
- Add a login endpoint using `verifyPassword()`.
- Add automated tests for registration validation.
- Add tests for DynamoDB failure handling.
