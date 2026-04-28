import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Must match the region where the table lives (and your `aws configure` default, if you use that).
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const lowLevel = new DynamoDBClient({ region });

/** Single shared client for Lambdas / serverless-offline (uses your local AWS creds when offline). */
export const docClient = DynamoDBDocumentClient.from(lowLevel, {
  marshallOptions: { removeUndefinedValues: true },
});

/**
 * `USERS_TABLE` is set in `serverless.yml` → `provider.environment`. If `serverless-offline` ever
 * omits it, falling back to `users` avoids `TableName: undefined` (DynamoDB can return
 * ResourceNotFound for that). You can still override: `$env:USERS_TABLE = "my-table"`.
 */
export function usersTableName() {
  return process.env.USERS_TABLE || 'users';
}
