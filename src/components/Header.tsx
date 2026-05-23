'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import { Lock, Bell } from 'lucide-react';

export function Header() {
  const { lock } = useLeads();

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
