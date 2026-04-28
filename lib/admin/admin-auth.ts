const encoder = new TextEncoder();

const ADMIN_TOKEN_CONTEXT = 'tuscanini-admin-session-v1';

export const ADMIN_ACCESS_COOKIE_NAME = 'tuscanini_admin_access';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 4;

function toBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url');
  }

  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);

  if (leftBytes.length !== rightBytes.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index];
  }

  return diff === 0;
}

function getAdminAccessSecret(): string {
  return process.env.ADMIN_ACCESS_SECRET?.trim() ?? '';
}

export function getAdminSessionCookieConfig() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}

async function buildSessionTokenFromSecret(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(ADMIN_TOKEN_CONTEXT));
  return toBase64Url(new Uint8Array(signature));
}

export async function buildAdminSessionToken(): Promise<string | null> {
  const secret = getAdminAccessSecret();
  if (!secret) {
    return null;
  }

  return buildSessionTokenFromSecret(secret);
}

export async function validateAdminAccessSecret(secretInput: string): Promise<boolean> {
  const configuredSecret = getAdminAccessSecret();
  if (!configuredSecret) {
    return false;
  }

  return constantTimeEqual(secretInput.trim(), configuredSecret);
}

export async function isAdminSessionTokenValid(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  const expectedToken = await buildAdminSessionToken();
  if (!expectedToken) {
    return false;
  }

  return constantTimeEqual(token, expectedToken);
}

export function getSafeAdminNextPath(nextValue: string | null | undefined): string {
  if (!nextValue || !nextValue.startsWith('/')) {
    return '/admin';
  }

  if (!nextValue.startsWith('/admin')) {
    return '/admin';
  }

  if (nextValue.startsWith('/admin/login')) {
    return '/admin';
  }

  return nextValue;
}

export function isProtectedAdminPath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/products') ||
    pathname.startsWith('/admin/orders') ||
    pathname.startsWith('/admin/kitchen') ||
    pathname.startsWith('/admin/tables') ||
    pathname.startsWith('/admin/settings') ||
    pathname.startsWith('/admin/offers') ||
    pathname.startsWith('/admin/debug')
  );
}
