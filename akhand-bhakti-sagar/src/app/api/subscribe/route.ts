import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  try {
    const subscriber = await prisma.subscriber.create({ data: { email } });
    return NextResponse.json(
      { message: 'Subscribed successfully', id: subscriber.id },
      { status: 201 }
    );
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }
    throw err;
  }
}
