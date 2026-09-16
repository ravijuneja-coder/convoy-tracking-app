import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession, getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@akhandbhaktisagar.com';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let isValid = false;
    if (adminPasswordHash) {
      isValid = await verifyPassword(password, adminPasswordHash);
    } else if (process.env.NODE_ENV !== 'production') {
      // Dev-only fallback: set ADMIN_PASSWORD in .env
      isValid = password === (process.env.ADMIN_PASSWORD || 'admin123');
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession({ userId: 'admin', email, name: 'Admin', role: 'ADMIN' });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
