'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import Link from 'next/link';
import { Inbox, BarChart2, Settings, Users } from 'lucide-react';

export default function AdminCommandCenter() {
  const { currentUser } = useLeads();

  if (currentUser?.role !== 'ADMIN') {
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-sla-breached)]">Unauthorized</h1>
        <p className="text-muted mb-8">You must be an Admin to view this page.</p>
        <Link href="/app" className="btn btn-primary">Return to Intake</Link>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admissions Command Center</h1>
        <p className="text-muted">High-level overview and team management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/app" className="glass-panel p-8 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all text-center group cursor-pointer" style={{ textDecoration: 'none' }}>
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-brand)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Users size={32} className="text-white mx-auto" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Intake</h2>
            <p className="text-sm text-muted mt-2">Manage all incoming leads and inquiries.</p>
          </div>
        </Link>

        <Link href="/app/reports" className="glass-panel p-8 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all text-center group cursor-pointer" style={{ textDecoration: 'none' }}>
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-brand)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <BarChart2 size={32} className="text-white mx-auto" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Team Reports</h2>
            <p className="text-sm text-muted mt-2">High-level insights into team performance.</p>
          </div>
        </Link>

        <Link href="/app/admin/settings" className="glass-panel p-8 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all text-center group cursor-pointer" style={{ textDecoration: 'none' }}>
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-brand)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Settings size={32} className="text-white mx-auto" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Admin Settings</h2>
            <p className="text-sm text-muted mt-2">Configure SLAs, boards, and manage users.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
