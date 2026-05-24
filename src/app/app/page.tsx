'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { LeadStatus } from '@/lib/types';
import { Header } from '@/components/Header';
import { LockScreen } from '@/components/LockScreen';
import { LeadCard } from '@/components/LeadCard';
import { LeadModal } from '@/components/LeadModal';
import { TwoLayerIntakeForm } from '@/components/TwoLayerIntakeForm';
import { DailyReport } from '@/components/DailyReport';
import { Plus, BarChart2 } from 'lucide-react';

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

export default function Dashboard() {
  const { isUnlocked, leads, moveLead } = useLeads();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [showReport, setShowReport] = useState(false);

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

  if (!isUnlocked) {
    return <LockScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 kanban-board">
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
      </main>

      <div className="fixed bottom-6 right-6 flex gap-sm z-40">
        <button 
          className="btn btn-primary shadow-lg rounded-full h-12 w-12 p-0" 
          onClick={() => setShowReport(true)}
          title="Daily Report"
        >
          <BarChart2 size={24} />
        </button>
        <button 
          className="btn btn-primary shadow-lg rounded-full h-12 w-12 p-0" 
          onClick={() => setShowNewLeadForm(true)}
          title="New Lead"
        >
          <Plus size={24} />
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
