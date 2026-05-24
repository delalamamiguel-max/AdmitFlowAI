'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import { LockScreen } from '@/components/LockScreen';
import { Header } from '@/components/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isUnlocked, currentUser } = useLeads();

  if (!isUnlocked || !currentUser) {
    return <LockScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      <Header />
      {children}
    </div>
  );
}
