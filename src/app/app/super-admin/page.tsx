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
    { id: '1', name: 'Serenity Rehab Center', email: 'admin@serenity.com', accessEmails: 'billing@serenity.com, owner@serenity.com', status: 'active', users: 12, mrr: 2400 },
    { id: '2', name: 'Oceanside Sober Living', email: 'hello@oceanside.com', accessEmails: 'info@oceanside.com', status: 'active', users: 5, mrr: 1000 },
    { id: '3', name: 'Mountain View Detox', email: 'contact@mountainview.com', accessEmails: '', status: 'paused', users: 8, mrr: 0 },
    { id: '4', name: 'City Recovery', email: 'admin@cityrecovery.org', accessEmails: 'staff@cityrecovery.org', status: 'active', users: 3, mrr: 600 },
  ]);

  const [showAddClient, setShowAddClient] = useState(false);
  const [managingClient, setManagingClient] = useState<any>(null);
  
  const [newClientData, setNewClientData] = useState({ name: '', email: '', accessEmails: '' });

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientData.name) {
      setAccounts([...accounts, { 
        id: Date.now().toString(), 
        name: newClientData.name, 
        email: newClientData.email,
        accessEmails: newClientData.accessEmails,
        status: 'active', 
        users: 1, 
        mrr: 0 
      }]);
      setShowAddClient(false);
      setNewClientData({ name: '', email: '', accessEmails: '' });
    }
  };

  const handleManageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (managingClient) {
      setAccounts(accounts.map(acc => acc.id === managingClient.id ? managingClient : acc));
      setManagingClient(null);
    }
  };

  const handleToggleStatus = (id: string, newStatus?: string) => {
    setAccounts(accounts.map(acc => {
      if (acc.id === id) {
        if (newStatus) return { ...acc, status: newStatus };
        return { ...acc, status: acc.status === 'active' ? 'paused' : 'active' };
      }
      return acc;
    }));
  };


  const totalMRR = accounts.reduce((acc, curr) => acc + curr.mrr, 0);
  const activeAccounts = accounts.filter(a => a.status === 'active').length;
  const activeClientsList = accounts.filter(a => a.status !== 'archived');
  const archivedClientsList = accounts.filter(a => a.status === 'archived');

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted">Manage locations, billing, and platform revenue.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-1 rounded-lg w-fit" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', gap: '0.5rem', padding: '0.25rem' }}>
        {['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'].map(tf => (
          <button
            key={tf}
            className={`capitalize`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: timeframe === tf ? 'var(--color-brand)' : 'transparent',
              color: timeframe === tf ? 'var(--color-surface)' : 'var(--color-text)',
              transition: 'all 0.2s ease',
              boxShadow: timeframe === tf ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}
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

      <div className="glass-panel p-6 mb-8">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="text-xl font-bold">Active Clients</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddClient(true)}>Add Client</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr className="border-b border-[var(--color-border)] text-muted text-sm">
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Client Name</th>
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Status</th>
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Users</th>
                <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Revenue</th>
                <th className="pb-3 font-medium text-right" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeClientsList.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-center text-muted">No active clients.</td></tr>
              )}
              {activeClientsList.map(acc => (
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
                    <button className="btn btn-ghost btn-sm" onClick={() => setManagingClient(acc)}>Manage</button>
                    {acc.status === 'active' ? (
                      <button className="btn btn-ghost btn-sm text-[var(--color-sla-warning)]" onClick={() => handleToggleStatus(acc.id)}>Pause</button>
                    ) : (
                      <button className="btn btn-ghost btn-sm text-[var(--color-sla-fresh)]" onClick={() => handleToggleStatus(acc.id)}>Activate</button>
                    )}
                    <button className="btn btn-ghost btn-sm text-[var(--color-sla-breached)]" onClick={() => handleToggleStatus(acc.id, 'archived')}>Archive</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {archivedClientsList.length > 0 && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="text-xl font-bold">Archived Clients</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ width: '100%', textAlign: 'left', opacity: 0.7 }}>
              <thead>
                <tr className="border-b border-[var(--color-border)] text-muted text-sm">
                  <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Client Name</th>
                  <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Status</th>
                  <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Users</th>
                  <th className="pb-3 font-medium" style={{ textAlign: 'left', paddingRight: '1rem' }}>Revenue</th>
                  <th className="pb-3 font-medium text-right" style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {archivedClientsList.map(acc => (
                  <tr key={acc.id} className="border-b border-[var(--color-border)]">
                    <td className="py-4 font-medium" style={{ textAlign: 'left' }}>{acc.name}</td>
                    <td className="py-4" style={{ textAlign: 'left' }}>
                      <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-sla-breached)]/10 text-[var(--color-sla-breached)]">
                        ARCHIVED
                      </span>
                    </td>
                    <td className="py-4" style={{ textAlign: 'left' }}>{acc.users}</td>
                    <td className="py-4" style={{ textAlign: 'left' }}>${acc.mrr.toLocaleString()}</td>
                    <td className="py-4 text-right flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                      <button className="btn btn-ghost btn-sm text-[var(--color-sla-fresh)]" onClick={() => handleToggleStatus(acc.id, 'active')}>Restore</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50 }}>
          <div className="glass-panel w-full max-w-md p-6" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
            <form onSubmit={handleAddClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Client Name *</label>
                <input required type="text" className="input w-full" value={newClientData.name} onChange={e => setNewClientData({...newClientData, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Primary Email</label>
                <input type="email" className="input w-full" value={newClientData.email} onChange={e => setNewClientData({...newClientData, email: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Additional Access Emails</label>
                <input type="text" placeholder="Comma separated" className="input w-full" value={newClientData.accessEmails} onChange={e => setNewClientData({...newClientData, accessEmails: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
              </div>
              <div className="flex gap-3 justify-end mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddClient(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {managingClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50 }}>
          <div className="glass-panel w-full max-w-md p-6" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 className="text-2xl font-bold mb-6">Manage Client: {managingClient.name}</h2>
            <form onSubmit={handleManageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Client Name</label>
                <input required type="text" className="input w-full" value={managingClient.name} onChange={e => setManagingClient({...managingClient, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Primary Email</label>
                <input type="email" className="input w-full" value={managingClient.email} onChange={e => setManagingClient({...managingClient, email: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Access Emails (comma separated)</label>
                <input type="text" className="input w-full" value={managingClient.accessEmails} onChange={e => setManagingClient({...managingClient, accessEmails: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }} />
              </div>
              <div className="flex gap-3 justify-end mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setManagingClient(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}