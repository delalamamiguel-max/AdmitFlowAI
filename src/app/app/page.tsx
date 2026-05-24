'use client';

import React, { useState, useMemo } from 'react';
import { useLeads } from '@/lib/store';
import { LeadStatus, Lead } from '@/lib/types';
import { Header } from '@/components/Header';
import { LockScreen } from '@/components/LockScreen';
import { LeadCard } from '@/components/LeadCard';
import { LeadModal } from '@/components/LeadModal';
import { TwoLayerIntakeForm } from '@/components/TwoLayerIntakeForm';
import { DailyReport } from '@/components/DailyReport';
import { Plus, BarChart2, LayoutList, Columns, AlertTriangle, Clock, Activity, Inbox } from 'lucide-react';

const COLUMNS = [
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

export default function Dashboard() {
  const { isUnlocked, leads, moveLead } = useLeads();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
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
    const active = leads.filter(l => l.status !== 'admitted' && l.status !== 'lost');
    
    const urgent = active.filter(l => l.urgencyLevel === 'immediate' || l.immediateSafetyConcern || l.slaStatus === 'breached');
    const dueToday = active.filter(l => !urgent.includes(l) && l.nextActionDue && new Date(l.nextActionDue) <= today);
    const unassigned = active.filter(l => !urgent.includes(l) && !dueToday.includes(l) && l.status === 'new' && !l.nextActionOwner);
    
    return { urgentLeads: urgent, dueTodayLeads: dueToday, newUnassigned: unassigned, activeLeads: active };
  }, [leads]);

  if (!isUnlocked) {
    return <LockScreen />;
  }

  const renderDashboardCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-8">
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-brand)]">
          <Inbox size={20} />
          <span className="font-semibold text-xs tracking-wider uppercase">New Inquiries</span>
        </div>
        <span className="text-3xl font-bold">{newUnassigned.length}</span>
        <span className="text-sm text-muted">Awaiting assignment</span>
      </div>
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-sla-warning)]">
          <Clock size={20} />
          <span className="font-semibold text-xs tracking-wider uppercase">Due Today</span>
        </div>
        <span className="text-3xl font-bold">{dueTodayLeads.length}</span>
        <span className="text-sm text-muted">Follow-ups scheduled</span>
      </div>
      <div className="bg-red-500/5 border border-[var(--color-sla-breached)] rounded-xl p-5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-sla-breached)]">
          <AlertTriangle size={20} />
          <span className="font-semibold text-xs tracking-wider uppercase">Urgent</span>
        </div>
        <span className="text-3xl font-bold text-[var(--color-sla-breached)]">{urgentLeads.length}</span>
        <span className="text-sm text-[var(--color-sla-breached)]">Requires immediate routing</span>
      </div>
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[var(--color-sla-fresh)]">
          <Activity size={20} />
          <span className="font-semibold text-xs tracking-wider uppercase">Active Pipeline</span>
        </div>
        <span className="text-3xl font-bold">{activeLeads.length}</span>
        <span className="text-sm text-muted">Total active leads</span>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl mt-6">
      <div className="w-16 h-16 bg-[var(--color-brand)]/10 text-[var(--color-brand)] rounded-full flex items-center justify-center mb-6">
        <Plus size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-3">Start your first intake</h2>
      <p className="text-muted max-w-md mb-8">
        Capture the caller, program interest, urgency, and next action in under two minutes. Give every inquiry a clear next step.
      </p>
      <button className="btn btn-primary btn-lg" onClick={() => setShowNewLeadForm(true)}>
        <Plus size={20} /> New Intake
      </button>
    </div>
  );

  const renderWorklist = () => (
    <div className="flex flex-col gap-10">
      {urgentLeads.length > 0 && (
        <section>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--color-sla-breached)]">
              <AlertTriangle size={18} /> Urgent Action Required
            </h3>
            <span className="text-sm font-semibold text-[var(--color-sla-breached)]">{urgentLeads.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentLeads.map(lead => <LeadCard key={lead.leadId} lead={lead} onSelect={() => setSelectedLeadId(lead.leadId)} />)}
          </div>
        </section>
      )}

      {dueTodayLeads.length > 0 && (
        <section>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-sla-warning)]" /> Due Today
            </h3>
            <span className="text-sm font-semibold text-muted">{dueTodayLeads.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueTodayLeads.map(lead => <LeadCard key={lead.leadId} lead={lead} onSelect={() => setSelectedLeadId(lead.leadId)} />)}
          </div>
        </section>
      )}

      {newUnassigned.length > 0 && (
        <section>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Inbox size={18} className="text-[var(--color-brand)]" /> New & Unassigned
            </h3>
            <span className="text-sm font-semibold text-muted">{newUnassigned.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newUnassigned.map(lead => <LeadCard key={lead.leadId} lead={lead} onSelect={() => setSelectedLeadId(lead.leadId)} />)}
          </div>
        </section>
      )}

      {urgentLeads.length === 0 && dueTodayLeads.length === 0 && newUnassigned.length === 0 && (
        <div className="text-center py-12 text-muted bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl">
          <CheckCircle2 size={40} className="mx-auto text-[var(--color-sla-fresh)] mb-4 opacity-50" />
          <p className="font-medium text-lg">Inbox Zero</p>
          <p className="text-sm mt-1">No urgent tasks or follow-ups due today. Great job!</p>
        </div>
      )}
    </div>
  );

  const renderKanban = () => (
    <div className="kanban-board bg-[var(--color-surface-card)] rounded-xl border border-[var(--color-border)]">
      {COLUMNS.map(col => {
        const colLeads = leads.filter(l => l.status === col.id);
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
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      <Header />
      
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admissions Command Center</h1>
            <p className="text-muted text-sm">Track new inquiries, route urgent leads, and keep every follow-up moving.</p>
          </div>
          <div className="flex items-center gap-1 bg-[var(--color-surface-card)] border border-[var(--color-border)] p-1 rounded-lg">
            <button 
              className={`btn btn-sm ${viewMode === 'worklist' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]' : 'btn-ghost border-transparent'}`}
              onClick={() => setViewMode('worklist')}
            >
              <LayoutList size={16} /> Worklist
            </button>
            <button 
              className={`btn btn-sm ${viewMode === 'pipeline' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-text)]' : 'btn-ghost border-transparent'}`}
              onClick={() => setViewMode('pipeline')}
            >
              <Columns size={16} /> Pipeline
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderDashboardCards()}
            {viewMode === 'worklist' ? renderWorklist() : renderKanban()}
          </>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-md z-40">
        <button 
          className="btn shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]" 
          onClick={() => setShowReport(true)}
          title="Daily Report"
        >
          <BarChart2 size={24} />
        </button>
        <button 
          className="btn btn-primary shadow-lg rounded-full h-14 w-14 p-0 flex items-center justify-center" 
          onClick={() => setShowNewLeadForm(true)}
          title="New Intake"
        >
          <Plus size={28} />
        </button>
      </div>

      {selectedLeadId && (
        <LeadModal 
          leadId={selectedLeadId} 
          onClose={() => setSelectedLeadId(null)} 
        />
      )}
      {showNewLeadForm && (
        <TwoLayerIntakeForm onClose={() => setShowNewLeadForm(false)} />
      )}

      {showReport && (
        <DailyReport onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}

// Ensure lucide icon is imported for the empty state
import { CheckCircle2 } from 'lucide-react';
