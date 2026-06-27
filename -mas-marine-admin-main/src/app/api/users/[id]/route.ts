import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

const updateSchema = z.object({
  allowedPages: z.array(z.string()).optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  const body = updateSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  try {
    const data: Record<string, string> = {};
    if (body.data.allowedPages !== undefined) {
      data.allowedPages = JSON.stringify(body.data.allowedPages);
    }
    if (body.data.role !== undefined) {
      data.role = body.data.role;
    }
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, username: true, role: true, allowedPages: true },
    });
    return NextResponse.json({
      ...user,
      allowedPages: (() => { try { return JSON.parse(user.allowedPages || '[]'); } catch { return []; } })(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
