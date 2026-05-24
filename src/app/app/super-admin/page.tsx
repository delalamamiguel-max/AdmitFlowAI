'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { Building, DollarSign, Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const { currentUser } = useLeads();
  const [timeframe, setTimeframe] = useState('monthly');
  
  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-sla-breached)]">Unauthorized</h1>
        <p className="text-muted mb-8">You must be a Super Admin to view this page.</p>
        <Link href="/app" className="btn btn-primary">Return to Pipeline</Link>
      </main>
    );
  }

  // Mock accounts and revenue
  const [accounts, setAccounts] = useState([
    { id: '1', name: 'Serenity Rehab Center', status: 'active', users: 12, mrr: 2400 },
    { id: '2', name: 'Oceanside Sober Living', status: 'active', users: 5, mrr: 1000 },
    { id: '3', name: 'Mountain View Detox', status: 'paused', users: 8, mrr: 0 },
    { id: '4', name: 'City Recovery', status: 'active', users: 3, mrr: 600 },
  ]);

  const handleAddLocation = () => {
    const name = window.prompt("Enter new location name:");
    if (name) {
      setAccounts([...accounts, { id: Date.now().toString(), name, status: 'active', users: 1, mrr: 0 }]);
    }
  };

  const handleToggleStatus = (id: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, status: acc.status === 'active' ? 'paused' : 'active' };
      }
      return acc;
    }));
  };

  const handleManage = (name: string) => {
    alert(`Managing settings for ${name}...`);
  };

  const totalMRR = accounts.reduce((acc, curr) => acc + curr.mrr, 0);
  const activeAccounts = accounts.filter(a => a.status === 'active').length;

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/app" className="btn btn-ghost">
          <ArrowLeft size={20} /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted">Manage locations, billing, and platform revenue.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 glass-panel p-1 rounded-lg w-fit">
        {['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'].map(tf => (
          <button
            key={tf}
            className={`btn btn-sm capitalize ${timeframe === tf ? 'bg-[var(--color-surface)] shadow text-[var(--color-text)] border-none' : 'btn-ghost border-transparent'}`}
            onClick={() => setTimeframe(tf)}
          >
            {tf.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 flex flex-col gap-2">
          <DollarSign size={28} className="text-[var(--color-brand)]" />
          <span className="text-4xl font-bold">${totalMRR.toLocaleString()}</span>
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Platform Revenue ({timeframe})</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2">
          <Building size={28} className="text-[var(--color-sla-fresh)]" />
          <span className="text-4xl font-bold">{activeAccounts}</span>
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Active Locations</span>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-2">
          <Activity size={28} className="text-[var(--color-sla-warning)]" />
          <span className="text-4xl font-bold">28</span>
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Total Users</span>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="text-xl font-bold">Locations & Clients</h2>
          <button className="btn btn-primary btn-sm" onClick={handleAddLocation}>Add Location</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr className="border-b border-[var(--color-border)] text-muted text-sm">
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Location Name</th>
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Status</th>
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Users</th>
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Revenue</th>
                <th className="pb-3 font-medium text-right" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                  <td className="py-4 font-medium" style={{ textAlign: 'left' }}>{acc.name}</td>
                  <td className="py-4" style={{ textAlign: 'left' }}>
                    <span className={`px-2 py-1 text-xs rounded-full ${acc.status === 'active' ? 'bg-[var(--color-sla-fresh)]/10 text-[var(--color-sla-fresh)]' : 'bg-[var(--color-sla-warning)]/10 text-[var(--color-sla-warning)]'}`}>
                      {acc.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4" style={{ textAlign: 'left' }}>{acc.users}</td>
                  <td className="py-4" style={{ textAlign: 'left' }}>${acc.mrr.toLocaleString()}</td>
                  <td className="py-4 text-right flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleManage(acc.name)}>Manage</button>
                    {acc.status === 'active' ? (
                      <button className="btn btn-ghost btn-sm text-[var(--color-sla-warning)]" onClick={() => handleToggleStatus(acc.id)}>Pause</button>
                    ) : (
                      <button className="btn btn-ghost btn-sm text-[var(--color-sla-fresh)]" onClick={() => handleToggleStatus(acc.id)}>Activate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
