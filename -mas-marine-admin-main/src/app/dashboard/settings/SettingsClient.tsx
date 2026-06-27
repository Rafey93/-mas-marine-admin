'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/navItems';
import type { SessionUser } from '@/lib/session';

const ALL_PAGES = navItems.map(item => ({
  key: item.href === '/dashboard' ? 'dashboard' : (item.href.match(/^\/dashboard\/([^/]+)/)?.[1] ?? ''),
  label: item.label,
})).filter(p => p.key);

interface UserRow {
  id: string;
  name: string;
  username: string;
  role: string;
  allowedPages: string[];
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none',
        checked ? 'bg-teal' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-4' : 'translate-x-1'
      )} />
    </button>
  );
}

export default function SettingsClient({ currentUser }: { currentUser: SessionUser }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser.role !== 'admin') return;
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [currentUser.role]);

  const togglePage = async (userId: string, pageKey: string, currentPages: string[]) => {
    const updated = currentPages.includes(pageKey)
      ? currentPages.filter(p => p !== pageKey)
      : [...currentPages, pageKey];

    // Optimistic update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, allowedPages: updated } : u));
    setSaving(userId);

    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowedPages: updated }),
    });

    if (res.ok) {
      setSavedId(userId);
      setTimeout(() => setSavedId(null), 2000);
    }
    setSaving(null);
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setSaving(userId);
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">System configuration and preferences</p>
      </div>

      {/* Account section */}
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Account</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Display Name</label>
              <input defaultValue={currentUser.name} className="w-full h-9 px-3 border border-gray-300 text-sm bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Username</label>
              <input defaultValue={currentUser.username} className="w-full h-9 px-3 border border-gray-300 text-sm bg-gray-50" readOnly />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'px-2 py-0.5 text-xs font-semibold uppercase tracking-wider',
              currentUser.role === 'admin' ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-600'
            )}>
              {currentUser.role}
            </span>
            <p className="text-xs text-gray-400">Account settings are managed by your system administrator.</p>
          </div>
        </div>
      </div>

      {/* User Management — admin only */}
      {currentUser.role === 'admin' && (
        <div className="bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">User Access Management</h2>
            <p className="text-xs text-gray-400 mt-0.5">Control which pages each user can access. Admins always have full access.</p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Loading users…</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {users.map(u => (
                <div key={u.id} className="px-5 py-4">
                  {/* User header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {savedId === u.id && (
                        <span className="text-xs text-green-600 font-medium">Saved ✓</span>
                      )}
                      {saving === u.id && (
                        <span className="text-xs text-gray-400">Saving…</span>
                      )}
                      {/* Role toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Admin</span>
                        <Toggle
                          checked={u.role === 'admin'}
                          onChange={() => toggleRole(u.id, u.role)}
                        />
                      </div>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-semibold uppercase tracking-wider',
                        u.role === 'admin' ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-500'
                      )}>
                        {u.role}
                      </span>
                    </div>
                  </div>

                  {/* Page access toggles — only shown for non-admin users */}
                  {u.role !== 'admin' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2 pl-11">
                      {ALL_PAGES.map(page => (
                        <div key={page.key} className="flex items-center gap-2 py-1">
                          <Toggle
                            checked={u.allowedPages.includes(page.key)}
                            onChange={() => togglePage(u.id, page.key, u.allowedPages)}
                          />
                          <span className="text-xs text-gray-600">{page.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {u.role === 'admin' && (
                    <p className="text-xs text-gray-400 pl-11 mt-1">Admins have full access to all pages.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Application info */}
      <div className="bg-white">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Application</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { label: 'System Name', value: 'Andros Marine Institute Admin' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Database', value: 'MySQL (s23.hosterpk.com)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
