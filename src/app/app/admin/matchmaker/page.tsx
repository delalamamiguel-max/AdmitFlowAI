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
        <div className="card p-lg mb-lg bg-gray-50 border-gray-200 opacity-75">
          <div className="flex items-center gap-sm mb-xs">
            <Lock size={20} className="text-gray-500" />
            <h3 className="font-semibold text-lg text-gray-700">Custom Facility Weights (Premium)</h3>
          </div>
          <p className="text-sm text-gray-500">Your facility is currently using the global matchmaking weights. Upgrade to Premium Matchmaking to unlock custom algorithm levers.</p>
        </div>
      )}

      <div className="card p-lg mb-lg">
        <div className="flex justify-between items-center mb-md border-b pb-sm">
          <div>
            <h3 className="font-semibold text-lg">My Personnel</h3>
            <p className="text-sm text-muted">Add therapists to be eligible for direct patient-to-therapist matchmaking.</p>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-xs" onClick={() => setShowAddTherapist(!showAddTherapist)}>
            <Plus size={16} /> Add Therapist
          </button>
        </div>

        {showAddTherapist && (
          <div className="mb-lg p-md bg-gray-50 rounded border border-gray-200">
            <h5 className="font-semibold text-sm mb-sm">Add New Therapist</h5>
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
              <div className="flex flex-wrap gap-1 mt-2">
                {newTherapist.certifications?.map(c => <span key={c} className="badge bg-indigo-100 text-brand text-xs">{c}</span>)}
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
              <div className="flex flex-wrap gap-1 mt-2">
                {newTherapist.psychographics?.map(p => <span key={p} className="badge bg-green-100 text-green-800 text-xs">{p}</span>)}
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
              <div key={p.id} className="p-md border rounded bg-white shadow-sm flex flex-col gap-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-md block">{p.name}</span>
                    <span className="text-sm text-muted">{p.role}</span>
                  </div>
                  <User className="text-gray-300" size={24} />
                </div>
                
                <div className="mt-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Certifications</span>
                  {p.certifications && p.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {p.certifications.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">{c}</span>)}
                    </div>
                  ) : <span className="text-xs text-gray-400">None</span>}
                </div>

                <div className="mt-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Psychographics</span>
                  {p.psychographics && p.psychographics.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {p.psychographics.map(ps => <span key={ps} className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">{ps}</span>)}
                    </div>
                  ) : <span className="text-xs text-gray-400">None</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-xl flex flex-col items-center justify-center text-muted bg-gray-50 rounded border border-dashed border-gray-200">
            <User size={32} className="mb-sm text-gray-300" />
            <p>You have no personnel registered.</p>
          </div>
        )}
      </div>
    </div>
  );
}
