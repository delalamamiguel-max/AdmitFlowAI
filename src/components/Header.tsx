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
        }
      });
    } else {
      setNotificationsEnabled(false);
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
        <span className="text-muted text-sm hidden sm:inline">Admissions Intake</span>
      </div>
      
      <nav className="hidden md:flex items-center text-sm font-medium" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {currentUser?.role !== 'SUPER_ADMIN' && (
          <Link href="/app" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Intake</Link>
        )}
        {currentUser?.role === 'ADMIN' && (
          <>
            <Link href="/app/reports" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Team Reports</Link>
            <Link href="/app/admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Admin Settings</Link>
          </>
        )}
        {currentUser?.role === 'SUPER_ADMIN' && (
          <Link href="/app/super-admin" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>Super Admin</Link>
        )}
      </nav>

      <div className="flex items-center gap-sm" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {currentUser?.role === 'SUPER_ADMIN' && (
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.875rem', textDecoration: 'none', color: 'var(--color-text)' }}>
            View Landing Page
          </a>
        )}
        <button 
          className="btn btn-sm" 
          onClick={toggleNotifications} 
          title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            backgroundColor: notificationsEnabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: notificationsEnabled ? '#22c55e' : '#ef4444', 
            border: `1px solid ${notificationsEnabled ? '#22c55e' : '#ef4444'}`,
            borderRadius: '20px', padding: '0.25rem 0.75rem'
          }}
        >
          {notificationsEnabled ? (
            <><Bell size={14} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ON</span></>
          ) : (
            <><BellOff size={14} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>OFF</span></>
          )}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleSignOut} title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
