'use client';

import { useSidebar } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import TopNavbar from './TopNavbar';
import type { SessionUser } from '@/lib/session';

export default function DashboardShell({ children, user }: { children: React.ReactNode; user: SessionUser }) {
  const sidebar = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <Sidebar user={user} />
      <MobileSidebar isOpen={sidebar.isOpen} onClose={sidebar.close} user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar onMenuClick={sidebar.toggle} user={user} />
        <main className="flex-1 overflow-y-auto bg-page p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
