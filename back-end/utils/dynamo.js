import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const lowLevel = new DynamoDBClient({ region });

/** Single shared client for Lambdas / serverless-offline (uses your local AWS creds when offline). */
export const docClient = DynamoDBDocumentClient.from(lowLevel, {
  marshallOptions: { removeUndefinedValues: true },
});

export function usersTableName() {
  const name = process.env.USERS_TABLE;
  if (!name) {
    throw new Error('USERS_TABLE environment variable is not set');
  }
  return name;
}
