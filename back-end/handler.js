import { createRegisteredUser } from './services/userService.js';

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'Content-Type,Authorization',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

/** Same idea as your old Lambda: API Gateway sends JSON string; console tests pass the object. */
function parseRegisterBody(event) {
  if (event?.body != null && typeof event.body === 'string' && event.body.length > 0) {
    let raw = event.body;
    if (event.isBase64Encoded) {
      // Convert base64 to string because API Gateway sends the body as base64 encoded
      raw = Buffer.from(raw, 'base64').toString('utf8'); 
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  // check if the event is an object and has a first_name property
  // otherwise return an empty object
  if (event && typeof event === 'object' && 'first_name' in event) {
    return event;
  }
  return {};
}

function validateRegisterPayload(body) {
  if (!body || typeof body !== 'object') {
    return 'Invalid JSON body';
  }
  const required = ['first_name', 'last_name', 'email', 'password'];
  for (const k of required) {
    if (body[k] === undefined || body[k] === null || String(body[k]).trim() === '') {
      return `Missing or empty field: ${k}`;
    }
  }
  if (String(body.password).length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
}

export async function ping() {
  return json(200, { ok: true, message: 'API is up' });
}

/** POST /api/v1/register — aligns with your previous Lambda + test JSON. */
export async function register(event) {
  const body = parseRegisterBody(event);
  if (body === null) {
    return json(400, { error: 'Invalid JSON' });
  }

  const validationError = validateRegisterPayload(body);
  if (validationError) {
    return json(400, { error: validationError });
  }

  const result = await createRegisteredUser({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
    phone_number: body.phone_number,
    address: body.address,
    ssn: body.ssn,
  });

  if (!result.ok) {
    return json(500, { error: result.message });
  }

  return json(200, { message: 'User created', id: result.id });
}
