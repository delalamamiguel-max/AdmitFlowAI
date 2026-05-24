'use client';

import React, { useState, useEffect } from 'react';
import { useLeads } from '@/lib/store';
import { LogOut, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { lock, currentUser } = useLeads();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const toggleNotifications = () => {
    if (!notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          alert('Notifications enabled!');
        }
      });
    } else {
      setNotificationsEnabled(false);
      alert('Notifications disabled.');
    }
  };

  const handleSignOut = () => {
    lock();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admitflow_leads');
      window.location.href = '/';
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
      
      <nav className="hidden md:flex items-center text-sm font-medium" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {currentUser?.role !== 'SUPER_ADMIN' && (
          <>
            <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Pipeline</Link>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Reports</Link>
          </>
        )}
        {currentUser?.role === 'ADMIN' && (
          <Link href="/app/admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Admin Dashboard</Link>
        )}
        {currentUser?.role === 'SUPER_ADMIN' && (
          <Link href="/app/super-admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Super Admin</Link>
        )}
      </nav>

      <div className="flex items-center gap-sm">
        <button className="btn btn-ghost btn-sm" onClick={toggleNotifications} title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}>
          {notificationsEnabled ? <Bell size={18} className="text-[var(--color-brand)]" /> : <BellOff size={18} />}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleSignOut} title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
