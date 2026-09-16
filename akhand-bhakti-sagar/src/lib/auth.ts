import { cookies } from 'next/headers';
import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// ─── Session shape ─────────────────────────────────────────────────────────
export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  isLoggedIn: boolean;
}

// ─── iron-session config ───────────────────────────────────────────────────
const SESSION_COOKIE_NAME = 'abs_session';

function getSessionOptions(): SessionOptions {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET environment variable must be set and at least 32 characters long.'
    );
  }
  return {
    cookieName: SESSION_COOKIE_NAME,
    password: secret,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    },
  };
}

// ─── Password helpers ──────────────────────────────────────────────────────

/**
 * Hash a plain-text password using bcrypt (cost factor 12).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare a plain-text password against a stored bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Session helpers ───────────────────────────────────────────────────────

type AppSession = IronSession<SessionData>;

/**
 * Retrieve the current iron-session for the incoming request.
 * Works in Server Components and Route Handlers via `next/headers`.
 */
export async function getSession(): Promise<AppSession> {
  const cookieStore = cookies();
  const session = await getIronSession<SessionData>(cookieStore, getSessionOptions());
  return session;
}

/**
 * Create (or refresh) the session after a successful login.
 */
export async function createSession(data: Omit<SessionData, 'isLoggedIn'>): Promise<void> {
  const session = await getSession();
  session.userId = data.userId;
  session.email = data.email;
  session.name = data.name;
  session.role = data.role;
  session.isLoggedIn = true;
  await session.save();
}

/**
 * Destroy the session (logout).
 */
export async function clearSession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Returns the authenticated session data or null if the user is not logged in.
 */
export async function getAuthenticatedSession(): Promise<SessionData | null> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return null;
    }
    return {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      isLoggedIn: true,
    };
  } catch {
    return null;
  }
}

/**
 * For use in Route Handlers: returns a 401 response if not authenticated, else null.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await getAuthenticatedSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
