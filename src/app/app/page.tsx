'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLeads } from '@/lib/store';
import { LeadStatus } from '@/lib/types';
import Link from 'next/link';
import { LeadCard } from '@/components/LeadCard';
import { LeadModal } from '@/components/LeadModal';
import { TwoLayerIntakeForm } from '@/components/TwoLayerIntakeForm';

import { Plus, BarChart2, LayoutList, Columns, AlertTriangle, Clock, Activity, Inbox } from 'lucide-react';

const COLUMNS = [
  { id: 'draft', title: 'Drafts', color: 'var(--color-text)' },
  { id: 'new', title: 'New', color: 'var(--color-sla-fresh)' },
  { id: 'contacted', title: 'Contacted', color: 'var(--color-brand)' },
  { id: 'qualifying', title: 'Qualifying', color: 'var(--color-brand)' },
  { id: 'pending_verification', title: 'Pending Verification', color: 'var(--color-sla-warning)' },
  { id: 'tour_scheduled', title: 'Tour Scheduled', color: 'var(--color-brand)' },
  { id: 'assessment_scheduled', title: 'Assessment Scheduled', color: 'var(--color-brand)' },
  { id: 'follow_up', title: 'Follow Up', color: 'var(--color-brand)' },
  { id: 'admitted', title: 'Admitted', color: 'var(--color-sla-fresh)' },
  { id: 'lost', title: 'Lost', color: 'var(--color-sla-breached)' },
] as const;

type ViewMode = 'worklist' | 'pipeline';

function DashboardContent() {
  const { leads, moveLead, currentUser } = useLeads();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const filter = searchParams?.get('filter');
  const timeframe = searchParams?.get('timeframe');

  // Filter leads based on query params
  const filteredLeads = useMemo(() => {
    let result = [...leads];
    
    if (filter && timeframe) {
      const now = new Date();
      const startDate = new Date();
      if (timeframe === 'daily') startDate.setHours(0, 0, 0, 0);
      else if (timeframe === 'weekly') startDate.setDate(now.getDate() - 7);
      else if (timeframe === 'monthly') startDate.setDate(now.getDate() - 30);
      
      if (filter === 'all') {
        result = result.filter(l => new Date(l.createdAt) >= startDate);
      } else if (filter === 'admitted') {
        result = result.filter(l => l.status === 'admitted' && new Date(l.createdAt) >= startDate);
      } else if (filter === 'lost') {
        result = result.filter(l => l.status === 'lost' && new Date(l.createdAt) >= startDate);
      } else if (filter === 'breached') {
        result = result.filter(l => l.slaStatus === 'breached'); // Active breaches
      }
    }
    
    return result;
  }, [leads, filter, timeframe]);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'SUPER_ADMIN') {
      router.push('/app/super-admin');
    }
  }, [currentUser, router]);

  if (currentUser?.role === 'SUPER_ADMIN') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Redirecting to Super Admin Dashboard...</div>;
  }

  const [viewMode, setViewMode] = useState<ViewMode>('worklist');

  // Drag and Drop handlers for Kanban
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLElement;
    currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLElement;
    currentTarget.classList.remove('drag-over');
    
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      moveLead(leadId, status);
    }
  };

  // Memoized lists for Worklist view
  const { urgentLeads, dueTodayLeads, newUnassigned, activeLeads } = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const active = filteredLeads.filter(l => l.status !== 'admitted' && l.status !== 'lost');
    
    const urgent = active.filter(l => l.urgencyLevel === 'immediate' || l.immediateSafetyConcern || l.slaStatus === 'breached');
    const dueToday = active.filter(l => !urgent.includes(l) && l.nextActionDue && new Date(l.nextActionDue) <= today);
    const unassigned = active.filter(l => !urgent.includes(l) && !dueToday.includes(l) && l.status === 'new' && !l.nextActionOwner);
    
    return { urgentLeads: urgent, dueTodayLeads: dueToday, newUnassigned: unassigned, activeLeads: active };
  }, [filteredLeads]);


  const renderDashboardCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-6">
      <div className="glass-panel p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-brand)]">
          <Inbox size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">New Inquiries</span>
        </div>
        <span className="text-3xl font-bold">{newUnassigned.length}</span>
        <span className="text-sm text-muted">Awaiting assignment</span>
      </div>
      <div className="glass-panel p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-sla-warning)]">
          <Clock size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">Due Today</span>
        </div>
        <span className="text-3xl font-bold">{dueTodayLeads.length}</span>
        <span className="text-sm text-muted">Follow-ups scheduled</span>
      </div>
      <div className="glass-panel p-4 flex flex-col gap-2 border border-[var(--color-sla-breached)] bg-red-500/5">
        <div className="flex items-center gap-2 text-[var(--color-sla-breached)]">
          <AlertTriangle size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">Urgent</span>
        </div>
        <span className="text-3xl font-bold text-[var(--color-sla-breached)]">{urgentLeads.length}</span>
        <span className="text-sm text-[var(--color-sla-breached)]">Requires immediate routing</span>
      </div>
      <div className="glass-panel p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-sla-fresh)]">
          <Activity size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">Active Intake</span>
        </div>
        <span className="text-3xl font-bold">{activeLeads.length}</span>
        <span className="text-sm text-muted">Total active leads</span>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', textAlign: 'center', margin: '2rem auto', maxWidth: '600px' }}>
      <button 
        onClick={() => setShowNewLeadForm(true)}
        style={{ width: '4rem', height: '4rem', background: 'var(--color-brand)', color: 'var(--color-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        title="New Intake"
      >
        <Plus size={32} />
      </button>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Start your first intake</h2>
      <p style={{ color: 'var(--color-text-sec)', maxWidth: '28rem', marginBottom: '2rem', lineHeight: '1.5' }}>
        Capture the caller, program interest, urgency, and next action in under two minutes. Give every inquiry a clear next step.
      </p>
      <button className="btn btn-primary btn-lg" onClick={() => setShowNewLeadForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plus size={20} /> New Intake
      </button>
    </div>
  );

  const renderWorklist = () => (
    <div className="flex flex-col gap-8">
      {urgentLeads.length > 0 && (
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-sla-breached)] mb-4 border-b border-[var(--color-border)] pb-2">
            <AlertTriangle size={18} /> Urgent Action Required
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentLeads.map(lead => <LeadCard key={lead.leadId} lead={lead} onSelect={() => setSelectedLeadId(lead.leadId)} />)}
          </div>
        </section>
      )}

      {dueTodayLeads.length > 0 && (
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-[var(--color-border)] pb-2">
            <Clock size={18} className="text-[var(--color-sla-warning)]" /> Due Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueTodayLeads.map(lead => <LeadCard key={lead.leadId} lead={lead} onSelect={() => setSelectedLeadId(lead.leadId)} />)}
          </div>
        </section>
      )}

      {newUnassigned.length > 0 && (
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-[var(--color-border)] pb-2">
            <Inbox size={18} className="text-[var(--color-brand)]" /> New & Unassigned
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newUnassigned.map(lead => <LeadCard key={lead.leadId} lead={lead} onSelect={() => setSelectedLeadId(lead.leadId)} />)}
          </div>
        </section>
      )}

      {urgentLeads.length === 0 && dueTodayLeads.length === 0 && newUnassigned.length === 0 && (
        <div className="text-center py-12 text-muted glass-panel">
          <p>No urgent tasks or follow-ups due today. Great job!</p>
        </div>
      )}
    </div>
  );

  const renderKanban = () => (
    <div className="kanban-board">
      {COLUMNS.map(col => {
        const colLeads = filteredLeads.filter(l => l.status === col.id);
        return (
          <div 
            key={col.id} 
            className="kanban-column"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id as LeadStatus)}
          >
            <div className="kanban-column-header">
              <div className="flex items-center gap-sm">
                <span>{col.title}</span>
                <span className="badge">{colLeads.length}</span>
              </div>
              {col.id === 'new' && (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowNewLeadForm(true)}>
                  <Plus size={16} /> Add
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-sm flex-1">
              {colLeads.map(lead => (
                <LeadCard 
                  key={lead.leadId} 
                  lead={lead} 
                  onSelect={() => setSelectedLeadId(lead.leadId)} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 bg-[var(--color-surface)]">
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              Admissions Command Center
              {filter && (
                <button 
                  className="btn btn-ghost btn-sm text-xs" 
                  onClick={() => router.push('/app')}
                >
                  Clear Filters
                </button>
              )}
            </h1>
            <p className="text-muted text-sm">
              {filter ? `Showing ${filter} leads (${timeframe})` : 'Track new inquiries, route urgent leads, and keep every follow-up moving.'}
            </p>
          </div>
          {leads.length > 0 && (<div className="flex items-center gap-2 glass-panel p-1 rounded-lg">
            <button 
              className={`btn btn-sm ${viewMode === 'worklist' ? 'bg-[var(--color-surface)] shadow text-[var(--color-text)] border-none' : 'btn-ghost border-transparent'}`}
              onClick={() => setViewMode('worklist')}
            >
              <LayoutList size={16} /> Worklist
            </button>
            <button 
              className={`btn btn-sm ${viewMode === 'pipeline' ? 'bg-[var(--color-surface)] shadow text-[var(--color-text)] border-none' : 'btn-ghost border-transparent'}`}
              onClick={() => setViewMode('pipeline')}
            >
              <Columns size={16} /> Intake
            </button>
          </div>)}
        </div>

        {filteredLeads.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderDashboardCards()}
            {viewMode === 'worklist' ? renderWorklist() : renderKanban()}
          </>
        )}
      </main>

      {leads.length > 0 && (<div className="fixed bottom-6 right-6 flex gap-sm z-40">

        <div className="tooltip-container">
          <button 
            className="btn btn-primary shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center" 
            onClick={() => setShowNewLeadForm(true)}
          >
            <Plus size={28} />
          </button>
          <span className="tooltip-text">New Intake</span>
        </div>
      </div>)}

      {selectedLeadId && (
        <LeadModal 
          leadId={selectedLeadId} 
          onClose={() => setSelectedLeadId(null)} 
        />
      )}
      {showNewLeadForm && (
        <TwoLayerIntakeForm onClose={() => setShowNewLeadForm(false)} />
      )}


    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
