import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { SESSION_COOKIE, verifySession } from '@/lib/session';

// Map route segments to page keys
function getPageKey(pathname: string): string | null {
  if (pathname === '/dashboard') return 'dashboard';
  const match = pathname.match(/^\/dashboard\/([^/]+)/);
  return match ? match[1] : null;
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Record<string, string>>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  // Verify JWT (not just presence)
  const user = await verifySession(token);
  if (!user) redirect('/');

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
