import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const settingsSchema = z.record(z.string(), z.string());

export async function GET(req: NextRequest) {
  void req;
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed — expected a flat key-value object of strings' },
      { status: 400 }
    );
  }

  const data = parsed.data;

  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return NextResponse.json({ settings });
}
