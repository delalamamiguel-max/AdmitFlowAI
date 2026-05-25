'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { MatchmakerSettings } from '@/components/MatchmakerSettings';
import { ShieldCheck, Plus, Building2, User, ChevronRight } from 'lucide-react';
import { Therapist } from '@/lib/types';

export default function SuperAdminMatchmakerPage() {
  const { globalSettings, updateGlobalSettings, clients, addTherapist, addClient } = useLeads();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  
  // New Therapist State
  const [newTherapist, setNewTherapist] = useState<Partial<Therapist>>({ name: '', role: '', certifications: [], psychographics: [] });
  const [certInput, setCertInput] = useState('');
  const [psychInput, setPsychInput] = useState('');

  // New Client State
  const [newClientName, setNewClientName] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleSaveTherapist = () => {
    if (!selectedClientId || !newTherapist.name) return;
    
    const therapist: Therapist = {
      id: `t_${Math.random().toString(36).substr(2, 9)}`,
      name: newTherapist.name || '',
      role: newTherapist.role || 'Therapist',
      certifications: newTherapist.certifications || [],
      psychographics: newTherapist.psychographics || []
    };
    
    addTherapist(selectedClientId, therapist);
    setShowAddTherapist(false);
    setNewTherapist({ name: '', role: '', certifications: [], psychographics: [] });
  };

  const handleSaveClient = () => {
    if (!newClientName) return;
    addClient({
      id: `c_${Math.random().toString(36).substr(2, 9)}`,
      name: newClientName,
      email: '',
      accessEmails: '',
      status: 'active',
      users: 1,
      mrr: 0,
      premiumMatchmakingEnabled: false,
      services: [],
      specialties: [],
      personnel: [],
      matchmakerConfig: { servicesWeight: 34, specialtiesWeight: 33, personnelWeight: 33 }
    });
    setShowAddClient(false);
    setNewClientName('');
  };

  return (
    <div className="max-w-5xl mx-auto py-lg px-md">
      <div className="flex justify-between items-center mb-xl">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-xs">
            <ShieldCheck className="text-brand" /> Super Admin Matchmaker Control
          </h1>
          <p className="text-muted mt-xs">Manage global algorithmic weights and the rehab/therapist database.</p>
        </div>
      </div>

      <MatchmakerSettings 
        servicesWeight={globalSettings.matchmakerConfig.servicesWeight}
        specialtiesWeight={globalSettings.matchmakerConfig.specialtiesWeight}
        personnelWeight={globalSettings.matchmakerConfig.personnelWeight}
        onChange={(config) => updateGlobalSettings({ matchmakerConfig: config })}
        title="Global Algorithmic Weights"
        subtitle="These weights apply system-wide as the baseline matching algorithm unless overridden locally."
      />

      <div className="card p-lg mb-lg">
        <div className="flex justify-between items-center mb-md">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-xs"><Building2 size={20} /> Global Rehab Database</h3>
            <p className="text-sm text-muted">View and manage all registered rehab centers and their therapists.</p>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-xs" onClick={() => setShowAddClient(true)}>
            <Plus size={16} /> Add Rehab
          </button>
        </div>

        {showAddClient && (
          <div className="mb-md p-md border rounded bg-gray-50 flex gap-sm items-center">
            <input 
              type="text" 
              placeholder="Rehab Center Name" 
              className="input flex-1"
              value={newClientName}
              onChange={e => setNewClientName(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSaveClient}>Save</button>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAddClient(false)}>Cancel</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="col-span-1 border rounded overflow-hidden">
            <div className="bg-gray-100 p-sm font-semibold border-b text-sm">Facilities</div>
            <ul className="divide-y max-h-96 overflow-y-auto">
              {clients.map(client => (
                <li 
                  key={client.id} 
                  className={`p-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedClientId === client.id ? 'bg-indigo-50 border-l-4 border-brand' : ''}`}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  <span className="text-sm font-medium truncate">{client.name}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 border rounded overflow-hidden p-md bg-white">
            {!selectedClient ? (
              <div className="h-full flex flex-col items-center justify-center text-muted">
                <User size={32} className="mb-sm text-gray-300" />
                <p>Select a facility to view personnel</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-md border-b pb-sm">
                  <h4 className="font-bold text-lg">{selectedClient.name} Personnel</h4>
                  <button className="btn btn-outline btn-sm flex items-center gap-xs" onClick={() => setShowAddTherapist(!showAddTherapist)}>
                    <Plus size={14} /> Add Therapist
                  </button>
                </div>

                {showAddTherapist && (
                  <div className="mb-md p-md bg-gray-50 rounded border border-gray-200">
                    <h5 className="font-semibold text-sm mb-sm">Add New Therapist</h5>
                    <div className="grid grid-cols-2 gap-sm mb-sm">
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

                {selectedClient.personnel && selectedClient.personnel.length > 0 ? (
                  <div className="flex flex-col gap-sm">
                    {selectedClient.personnel.map(p => (
                      <div key={p.id} className="p-sm border rounded bg-white shadow-sm flex flex-col gap-xs">
                        <div className="flex justify-between">
                          <span className="font-semibold text-sm">{p.name}</span>
                          <span className="text-xs text-muted">{p.role}</span>
                        </div>
                        {p.certifications && p.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.certifications.map(c => <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">{c}</span>)}
                          </div>
                        )}
                        {p.psychographics && p.psychographics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.psychographics.map(ps => <span key={ps} className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">{ps}</span>)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted italic">No personnel registered for this facility.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
