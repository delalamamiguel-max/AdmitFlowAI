'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { TrendingUp, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Timeframe = 'daily' | 'weekly' | 'monthly';

export default function ReportsDashboard() {
  const { leads, currentUser } = useLeads();

  if (currentUser?.role !== 'ADMIN') {
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-sla-breached)]">Unauthorized</h1>
        <p className="text-muted mb-8">You must be an Admin to view Team Reports.</p>
        <Link href="/app" className="btn btn-primary">Return to Pipeline</Link>
      </main>
    );
  }
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  
  const now = new Date();
  const startDate = new Date();
  
  if (timeframe === 'daily') {
    startDate.setHours(0, 0, 0, 0);
  } else if (timeframe === 'weekly') {
    startDate.setDate(now.getDate() - 7);
  } else if (timeframe === 'monthly') {
    startDate.setDate(now.getDate() - 30);
  }
  
  const inTimeframe = leads.filter(l => new Date(l.createdAt) >= startDate);
  const admitted = inTimeframe.filter(l => l.status === 'admitted');
  const lost = inTimeframe.filter(l => l.status === 'lost');
  
  // Breaches are usually tracked actively, but we can filter by timeframe too if we want.
  // For simplicity, let's show all active breaches.
  const breachedCount = leads.filter(l => l.slaStatus === 'breached').length;
  const totalActive = leads.filter(l => l.status !== 'admitted' && l.status !== 'lost').length;
  const breachPercent = totalActive > 0 ? Math.round((breachedCount / totalActive) * 100) : 0;
  
  const sourceCount: Record<string, number> = {};
  inTimeframe.forEach(l => {
    sourceCount[l.source] = (sourceCount[l.source] || 0) + 1;
  });

  const navigateToFiltered = (filter: string) => {
    router.push(`/app?filter=${filter}&timeframe=${timeframe}`);
  };

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Team Reports</h1>
          <p className="text-muted">Analyze your team's pipeline performance</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-1 rounded-lg w-fit" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', gap: '0.5rem', padding: '0.25rem' }}>
        {(['daily', 'weekly', 'monthly'] as Timeframe[]).map(tf => (
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
            {tf}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          className="glass-panel p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigateToFiltered('all')}
        >
          <TrendingUp size={28} className="text-[var(--color-brand)]" />
          <span className="text-4xl font-bold">{inTimeframe.length}</span>
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Inquiries ({timeframe})</span>
        </div>
        
        <div 
          className="glass-panel p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigateToFiltered('admitted')}
        >
          <CheckCircle size={28} className="text-[var(--color-sla-fresh)]" />
          <span className="text-4xl font-bold">{admitted.length}</span>
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Admitted ({timeframe})</span>
        </div>
        
        <div 
          className="glass-panel p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigateToFiltered('lost')}
        >
          <XCircle size={28} className="text-[var(--color-sla-breached)]" />
          <span className="text-4xl font-bold">{lost.length}</span>
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Closed / Lost ({timeframe})</span>
        </div>
        
        <div 
          className="glass-panel p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-all border border-[var(--color-sla-breached)] bg-red-500/5"
          onClick={() => navigateToFiltered('breached')}
        >
          <AlertTriangle size={28} className="text-[var(--color-sla-breached)]" />
          <span className="text-4xl font-bold text-[var(--color-sla-breached)]">{breachedCount}</span>
          <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-sla-breached)]">Active Breaches ({breachPercent}%)</span>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-bold text-xl mb-4 border-b border-[var(--color-border)] pb-2">Top Lead Sources ({timeframe})</h3>
        <div className="flex flex-col gap-4">
          {Object.entries(sourceCount).sort((a,b) => b[1]-a[1]).map(([source, count]) => (
            <div key={source} className="flex items-center gap-4">
              <span className="w-48 font-medium truncate capitalize">{source.replace(/_/g, ' ')}</span>
              <div className="flex-1 h-6 bg-[var(--color-surface)] rounded overflow-hidden">
                <div className="h-full bg-[var(--color-brand)]" style={{ width: `${(count / inTimeframe.length) * 100}%` }}></div>
              </div>
              <span className="font-bold w-8 text-right">{count}</span>
            </div>
          ))}
          {Object.keys(sourceCount).length === 0 && <span className="text-muted">No leads in this timeframe.</span>}
        </div>
      </div>
    </main>
  );
}
