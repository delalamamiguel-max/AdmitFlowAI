'use client';

import React, { useState, useEffect } from 'react';
import { Unlock } from 'lucide-react';
import { useLeads } from '@/lib/store';
import { initializeEncryption } from '@/lib/crypto';
import { UserRole, User } from '@/lib/types';

export function LockScreen() {
  const { unlock } = useLeads();
  const [email, setEmail] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW reg failed', err));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !passphrase.trim()) {
      setError('Email and Password are required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Mock Authentication Logic
      let role: UserRole = 'REP';
      if (email.toLowerCase().includes('super')) role = 'SUPER_ADMIN';
      else if (email.toLowerCase().includes('admin')) role = 'ADMIN';

      const mockUser: User = {
        id: 'u_' + Math.random().toString(36).substring(2, 9),
        email,
        role,
        name: email.split('@')[0],
      };

      const key = await initializeEncryption(passphrase);
      unlock(key, mockUser);
      
      // Request notifications
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    } catch {
      setError('Failed to derive key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-surface)] p-4" style={{ 
      backgroundImage: 'radial-gradient(circle at top right, color-mix(in srgb, var(--color-brand) 15%, transparent), transparent 40%)' 
    }}>
      <div className="glass-panel w-full max-w-md p-8 text-center" style={{ animation: 'fade-in 0.5s ease-out' }}>
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-2" style={{ background: 'var(--color-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AdmitFlowAI
          </h1>
          <p className="text-muted">Sign in to your Admissions Command Center</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md text-left">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted">Email</label>
            <input 
              type="email" 
              className="input mb-4" 
              placeholder="name@center.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <label className="block text-sm font-medium mb-1 text-muted">Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Password..." 
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
            {error && <p className="text-xs text-[var(--color-sla-breached)] mt-1">{error}</p>}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Unlocking...' : <><Unlock size={18} /> Unlock</>}
          </button>
        </form>
      </div>
    </div>
  );
}
