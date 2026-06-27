import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, username: true, role: true, allowedPages: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users.map(u => ({
      ...u,
      allowedPages: (() => { try { return JSON.parse(u.allowedPages || '[]'); } catch { return []; } })(),
    })));
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
