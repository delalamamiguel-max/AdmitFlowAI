'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import { Lock, Bell } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { lock, currentUser } = useLeads();

  const handleNotificationRequest = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled!');
        }
      });
    }
  };

  return (
    <header className="glass-panel flex justify-between items-center" style={{ height: '64px', padding: '0 1.5rem', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="flex items-center gap-md">
        <h1 className="font-bold" style={{ margin: 0, fontSize: '1.25rem', background: 'var(--color-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AdmitFlowAI
        </h1>
        <span className="text-muted text-sm hidden sm:inline">Admissions Pipeline</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/app" className="hover:text-[var(--color-brand)] transition-colors">Pipeline</Link>
        <Link href="/app/reports" className="hover:text-[var(--color-brand)] transition-colors">Reports</Link>
        {currentUser?.role === 'ADMIN' && (
          <Link href="/app/admin" className="hover:text-[var(--color-brand)] transition-colors">Admin Dashboard</Link>
        )}
        {currentUser?.role === 'SUPER_ADMIN' && (
          <Link href="/app/super-admin" className="hover:text-[var(--color-brand)] transition-colors">Super Admin</Link>
        )}
      </nav>

      <div className="flex items-center gap-sm">
        <button className="btn btn-ghost btn-sm" onClick={handleNotificationRequest} title="Enable Notifications">
          <Bell size={18} />
        </button>
        <button className="btn btn-ghost btn-sm" onClick={lock} title="Lock Application">
          <Lock size={18} />
        </button>
      </div>
    </header>
  );
}
