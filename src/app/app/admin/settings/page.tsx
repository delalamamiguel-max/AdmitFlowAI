'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import { Users, Settings, Inbox, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { leads, currentUser } = useLeads();
  
  if (currentUser?.role === 'REP') {
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-sla-breached)]">Unauthorized</h1>
        <p className="text-muted mb-8">You do not have permission to view the Admin Dashboard.</p>
        <Link href="/app" className="btn btn-primary">Return to Intake</Link>
      </main>
    );
  }

  const activeLeads = leads.filter(l => l.status !== 'admitted' && l.status !== 'lost');
  
  // Mock team members
  const teamMembers = [
    { id: '1', name: 'Alex Johnson', role: 'Intake Rep', leads: activeLeads.filter(l => l.assignedRepId === '1').length },
    { id: '2', name: 'Sarah Davis', role: 'Intake Rep', leads: activeLeads.filter(l => l.assignedRepId === '2').length },
    { id: '3', name: 'Mike Ross', role: 'Intake Rep', leads: activeLeads.filter(l => l.assignedRepId === '3').length },
  ];

  const unassigned = activeLeads.filter(l => !l.assignedRepId || l.status === 'new').length;

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/app" className="btn btn-ghost">
          <ArrowLeft size={20} /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted">Manage your team and SLA configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Team Overview */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Users size={20} className="text-[var(--color-brand)]"/> Team Workload</h2>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-[var(--color-sla-warning)] flex items-center gap-1"><Inbox size={16}/> {unassigned} Unassigned</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--color-text)] text-[var(--color-surface)] flex items-center justify-center font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{member.name}</div>
                    <div className="text-xs text-muted">{member.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{member.leads}</div>
                    <div className="text-xs text-muted uppercase tracking-wider">Active Leads</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Reassign Leads</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Configuration */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b border-[var(--color-border)] pb-4 mb-4"><Settings size={20} className="text-[var(--color-brand)]"/> SLA Config</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
              <div className="text-sm font-bold mb-1">New Inquiries</div>
              <div className="flex items-center gap-2">
                <input type="number" className="input py-1" defaultValue={15} />
                <span className="text-sm text-muted">Minutes</span>
              </div>
            </div>
            <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
              <div className="text-sm font-bold mb-1">Follow Ups</div>
              <div className="flex items-center gap-2">
                <input type="number" className="input py-1" defaultValue={120} />
                <span className="text-sm text-muted">Minutes</span>
              </div>
            </div>
            <div className="bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
              <div className="text-sm font-bold mb-1">Urgent Assessments</div>
              <div className="flex items-center gap-2">
                <input type="number" className="input py-1" defaultValue={30} />
                <span className="text-sm text-muted">Minutes</span>
              </div>
            </div>
            <button className="btn btn-primary w-full mt-2">Save Configuration</button>
          </div>
        </div>
      </div>
    </main>
  );
}
