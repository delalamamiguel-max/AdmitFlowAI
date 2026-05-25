'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { MatchmakerSettings } from '@/components/MatchmakerSettings';
import { Building2, User, Plus, Lock } from 'lucide-react';
import { Therapist } from '@/lib/types';

export default function AdminMatchmakerPage() {
  const { clients, updateClient, addTherapist } = useLeads();
  // Assume for this MVP that the Admin belongs to 'client_1' (Serenity Rehab Center)
  const myClientId = 'client_1'; 
  const myClient = clients.find(c => c.id === myClientId);

  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [newTherapist, setNewTherapist] = useState<Partial<Therapist>>({ name: '', role: '', certifications: [], psychographics: [] });
  const [certInput, setCertInput] = useState('');
  const [psychInput, setPsychInput] = useState('');

  if (!myClient) return <div>Loading Facility...</div>;

  const handleSaveTherapist = () => {
    if (!newTherapist.name) return;
    
    const therapist: Therapist = {
      id: `t_${Math.random().toString(36).substr(2, 9)}`,
      name: newTherapist.name || '',
      role: newTherapist.role || 'Therapist',
      certifications: newTherapist.certifications || [],
      psychographics: newTherapist.psychographics || []
    };
    
    addTherapist(myClientId, therapist);
    setShowAddTherapist(false);
    setNewTherapist({ name: '', role: '', certifications: [], psychographics: [] });
  };

  return (
    <div className="max-w-5xl mx-auto py-lg px-md">
      <div className="mb-xl">
        <h1 className="text-2xl font-bold flex items-center gap-xs">
          <Building2 className="text-brand" /> Facility Matchmaker Settings
        </h1>
        <p className="text-muted mt-xs">Manage your facility's personnel and custom algorithm weights.</p>
      </div>

      {myClient.premiumMatchmakingEnabled ? (
        <MatchmakerSettings 
          servicesWeight={myClient.matchmakerConfig.servicesWeight}
          specialtiesWeight={myClient.matchmakerConfig.specialtiesWeight}
          personnelWeight={myClient.matchmakerConfig.personnelWeight}
          onChange={(config) => updateClient(myClientId, { matchmakerConfig: config })}
          title="Custom Facility Weights (Premium)"
          subtitle="Override the global matchmaking algorithm to prioritize your facility's unique strengths."
        />
      ) : (
        <div className="glass-panel p-lg mb-lg border border-[var(--color-border)] opacity-75">
          <div className="flex items-center gap-sm mb-xs">
            <Lock size={20} className="text-muted" />
            <h3 className="font-semibold text-lg text-[var(--color-text)]">Custom Facility Weights (Premium)</h3>
          </div>
          <p className="text-sm text-muted">Your facility is currently using the global matchmaking weights. Upgrade to Premium Matchmaking to unlock custom algorithm levers.</p>
        </div>
      )}

      <div className="glass-panel p-lg mb-lg border border-[var(--color-border)]">
        <div className="flex justify-between items-center mb-md border-b border-[var(--color-border)] pb-sm">
          <div>
            <h3 className="font-semibold text-lg text-[var(--color-text)]">My Personnel</h3>
            <p className="text-sm text-muted">Add therapists to be eligible for direct patient-to-therapist matchmaking.</p>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-xs" onClick={() => setShowAddTherapist(!showAddTherapist)}>
            <Plus size={16} /> Add Therapist
          </button>
        </div>

        {showAddTherapist && (
          <div className="mb-lg p-md bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm">
            <h5 className="font-semibold text-sm mb-sm text-[var(--color-text)]">Add New Therapist</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mb-sm">
              <input type="text" className="input" placeholder="Full Name" value={newTherapist.name} onChange={e => setNewTherapist({...newTherapist, name: e.target.value})} />
              <input type="text" className="input" placeholder="Role (e.g. Lead Therapist)" value={newTherapist.role} onChange={e => setNewTherapist({...newTherapist, role: e.target.value})} />
            </div>
            
            <div className="mb-sm">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Certifications (Press Enter)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="input flex-1" 
                  placeholder="e.g. LCSW" 
                  value={certInput} 
                  onChange={e => setCertInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && certInput.trim()) {
                      setNewTherapist({...newTherapist, certifications: [...(newTherapist.certifications || []), certInput.trim()]});
                      setCertInput('');
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {newTherapist.certifications?.map(c => <span key={c} className="px-2 py-1 rounded-md bg-[var(--color-brand)]/10 text-[var(--color-brand)] border border-[var(--color-brand)]/20 text-sm font-medium flex items-center shadow-sm">{c}</span>)}
              </div>
            </div>

            <div className="mb-sm">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Psychographics (Press Enter)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="input flex-1" 
                  placeholder="e.g. direct, nurturing" 
                  value={psychInput} 
                  onChange={e => setPsychInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && psychInput.trim()) {
                      setNewTherapist({...newTherapist, psychographics: [...(newTherapist.psychographics || []), psychInput.trim()]});
                      setPsychInput('');
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {newTherapist.psychographics?.map(p => <span key={p} className="px-2 py-1 rounded-md bg-[var(--color-sla-fresh)]/10 text-[var(--color-sla-fresh)] border border-[var(--color-sla-fresh)]/20 text-sm font-medium flex items-center shadow-sm">{p}</span>)}
              </div>
            </div>
            
            <div className="flex justify-end gap-sm mt-md">
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddTherapist(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleSaveTherapist}>Save Therapist</button>
            </div>
          </div>
        )}

        {myClient.personnel && myClient.personnel.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {myClient.personnel.map(p => (
              <div key={p.id} className="p-md border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] shadow-sm flex flex-col gap-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-lg text-[var(--color-text)] block leading-tight">{p.name}</span>
                    <span className="text-xs text-[var(--color-brand)] uppercase tracking-wider font-medium">{p.role}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                    <User size={20} />
                  </div>
                </div>
                
                <div className="mt-xs">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block mb-1.5">Certifications</span>
                  {p.certifications && p.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {p.certifications.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-surface-glass)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 shadow-sm">{c}</span>)}
                    </div>
                  ) : <span className="text-xs text-muted">None</span>}
                </div>

                <div className="mt-xs">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block mb-1.5">Psychographics</span>
                  {p.psychographics && p.psychographics.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {p.psychographics.map(ps => <span key={ps} className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-sla-fresh)]/10 text-[var(--color-sla-fresh)] border border-[var(--color-sla-fresh)]/20 shadow-sm">{ps}</span>)}
                    </div>
                  ) : <span className="text-xs text-muted">None</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-xl flex flex-col items-center justify-center text-muted bg-[var(--color-surface)] rounded-xl border border-dashed border-[var(--color-border)] shadow-sm">
            <User size={48} className="mb-sm opacity-30" />
            <p className="font-medium text-[var(--color-text)]">You have no personnel registered.</p>
            <p className="text-sm mt-1">Add therapists to enable precise patient-therapist matchmaking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
