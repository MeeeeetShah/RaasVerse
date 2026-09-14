import crypto from 'crypto';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'raasverse_super_secret_key_2026_festive';
export const ADMIN_COOKIE_NAME = 'raasverse_admin_session';

// Hash password with salt using SHA-256
export function hashPassword(password, salt = 'raasverse_salt_2026') {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Sign a simple secure JWT-like token (header.payload.signature)
export function signToken(payload, expiresInMs = 7 * 24 * 60 * 60 * 1000) {
  const exp = Date.now() + expiresInMs;
  const tokenPayload = { ...payload, exp };
  
  const b64Payload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(b64Payload)
    .digest('base64url');
    
  return `${b64Payload}.${signature}`;
}

// Verify token
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [b64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(b64Payload)
    .digest('base64url');
    
  if (signature !== expectedSignature) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // expired
    }
    return payload;
  } catch (_) {
    return null;
  }
}

// Verify Super Admin from Request (headers or cookies)
export async function verifySuperAdmin(req = null) {
  let token = null;

  // 1. Try Bearer token in headers
  if (req) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Try cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      const cookieObj = cookieStore.get(ADMIN_COOKIE_NAME);
      if (cookieObj) {
        token = cookieObj.value;
      }
    } catch (_) {
      // Cookies might not be available in some contexts
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Check role
  if (payload.role !== 'super_admin') {
    return null;
  }

  // Verify against configured ADMIN_EMAIL if set
  const configuredEmail = process.env.ADMIN_EMAIL;
  if (configuredEmail && payload.email && payload.email.toLowerCase() !== configuredEmail.toLowerCase().trim()) {
    return null;
  }

  return {
    id: payload.id || 'super_admin_1',
    name: payload.name || 'RaasVerse Super Admin',
    email: payload.email,
    role: 'super_admin'
  };
}
