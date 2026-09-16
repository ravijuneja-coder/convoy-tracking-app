import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SETTINGS_PATH = join(process.cwd(), 'data', 'settings.json');

async function readSettings() {
  try {
    const raw = await readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeSettings(data: object) {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const body = await req.json();
    await writeSettings(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
