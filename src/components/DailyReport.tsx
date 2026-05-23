'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import { TrendingUp, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

export function DailyReport({ onClose }: { onClose: () => void }) {
  const { leads } = useLeads();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const createdToday = leads.filter(l => new Date(l.createdAt) >= today);
  const admittedToday = createdToday.filter(l => l.status === 'admitted');
  const lostToday = createdToday.filter(l => l.status === 'closed_lost');
  
  const breachedCount = leads.filter(l => l.slaStatus === 'breached').length;
  const totalActive = leads.filter(l => l.status !== 'admitted' && l.status !== 'closed_lost').length;
  const breachPercent = totalActive > 0 ? Math.round((breachedCount / totalActive) * 100) : 0;
  
  const sourceCount: Record<string, number> = {};
  createdToday.forEach(l => {
    sourceCount[l.source] = (sourceCount[l.source] || 0) + 1;
  });

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md glass-panel z-50 border-r-0 border-y-0 rounded-none shadow-2xl flex flex-col animate-slide-left" style={{ animation: 'fade-in 0.3s' }}>
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
        <h2 className="font-bold text-xl">Daily Report</h2>
        <button onClick={onClose} className="btn btn-ghost btn-sm">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-lg">
        <div className="grid grid-cols-2 gap-sm">
          <div className="glass-panel p-4 flex flex-col gap-2">
            <TrendingUp size={24} className="text-muted" />
            <span className="text-3xl font-bold">{createdToday.length}</span>
            <span className="text-sm text-muted">Inquiries Today</span>
          </div>
          <div className="glass-panel p-4 flex flex-col gap-2">
            <CheckCircle size={24} className="text-[var(--color-sla-fresh)]" />
            <span className="text-3xl font-bold">{admittedToday.length}</span>
            <span className="text-sm text-muted">Admitted</span>
          </div>
          <div className="glass-panel p-4 flex flex-col gap-2">
            <XCircle size={24} className="text-[var(--color-sla-breached)]" />
            <span className="text-3xl font-bold">{lostToday.length}</span>
            <span className="text-sm text-muted">Closed / Lost</span>
          </div>
          <div className="glass-panel p-4 flex flex-col gap-2">
            <AlertTriangle size={24} className="text-[var(--color-sla-warning)]" />
            <span className="text-3xl font-bold">{breachedCount}</span>
            <span className="text-sm text-muted">Total Breaches ({breachPercent}%)</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-3 border-b border-[var(--color-border)] pb-2">Sources (Today)</h3>
          <div className="flex flex-col gap-2">
            {Object.entries(sourceCount).sort((a,b) => b[1]-a[1]).map(([source, count]) => (
              <div key={source} className="flex items-center gap-2">
                <span className="w-1/3 text-sm truncate">{source.replace(/_/g, ' ')}</span>
                <div className="flex-1 h-4 bg-[var(--color-surface)] rounded overflow-hidden">
                  <div className="h-full bg-[var(--color-brand)]" style={{ width: `${(count / createdToday.length) * 100}%` }}></div>
                </div>
                <span className="text-sm font-medium w-8 text-right">{count}</span>
              </div>
            ))}
            {Object.keys(sourceCount).length === 0 && <span className="text-sm text-muted">No leads today.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
