import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { docClient, usersTableName } from '../utils/dynamo.js';
import { hashPassword } from '../utils/password.js';

export async function getUserById(id) {
  const table = usersTableName();
  const res = await docClient.send(
    new GetCommand({
      TableName: table,
      Key: { id },
    })
  );
  return res.Item ?? null;
}

/**
 * Same shape as your previous Lambda: PutItem into `users` (or USERS_TABLE), bcrypt hash, crypto UUID.
 * No duplicate-email check (your old handler did not have one).
 *
 * @param {object} input
 * @param {string} input.first_name
 * @param {string} input.last_name
 * @param {string} input.email
 * @param {string} input.password
 * @param {string} [input.phone_number]
 * @param {string} [input.address]
 * @param {string} [input.ssn]
 * @returns {{ ok: true, id: string } | { ok: false, code: 'db_error', message: string }}
 */
export async function createRegisteredUser(input) {
  const id = randomUUID();
  const password_hash = await hashPassword(input.password);
  const now = new Date().toISOString();

  const item = {
    id,
    first_name: String(input.first_name || '').trim(),
    last_name: String(input.last_name || '').trim(),
    address: String(input.address || '').trim(),
    email: String(input.email || '').trim(),
    phone_number: String(input.phone_number || '').trim(),
    social_security_number: String(
      input.ssn || input.social_security_number || ''
    ).trim(),
    password_hash,
    role: 'user',
    is_active: true,
    created_at: now,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: usersTableName(),
        Item: item,
      })
    );
  } catch (e) {
    console.error('PutItem failed', e);
    return { ok: false, code: 'db_error', message: e.message || 'Could not save user' };
  }

  return { ok: true, id };
}
