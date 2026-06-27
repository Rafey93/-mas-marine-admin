'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Anchor, LogOut } from 'lucide-react';
import { navItems } from '@/lib/navItems';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { SessionUser } from '@/lib/session';

function pageKeyFromHref(href: string): string {
  if (href === '/dashboard') return 'dashboard';
  const match = href.match(/^\/dashboard\/([^/]+)/);
  return match ? match[1] : '';
}

export default function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  const visibleItems = user.role === 'admin'
    ? navItems
    : navItems.filter(item => user.allowedPages.includes(pageKeyFromHref(item.href)));

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] min-h-screen bg-navy flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-teal flex items-center justify-center flex-shrink-0">
          <Anchor className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight uppercase tracking-wide">Andros Marine</p>
          <p className="text-white/50 text-xs">Institute Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto sidebar-scroll">
        <ul className="space-y-0.5 px-3">
          {visibleItems.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-teal text-white font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User / logout */}
      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
            <p className="text-white/40 text-xs truncate capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/60 hover:text-white text-xs w-full transition-colors py-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
