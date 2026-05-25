'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { User, UserRole, LeadStatus, Therapist } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Edit, UserPlus, Trash2, ShieldOff, ShieldAlert, ArrowRightLeft, Sparkles, Lock, X, Plus } from 'lucide-react';

export default function AdminSettings() {
  const { leads, users, clients, currentUser, updateLead, addUser, updateUser, deleteUser, updateClient } = useLeads();

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showSlaModal, setShowSlaModal] = useState(false);
  const [slaConfigs, setSlaConfigs] = useState({ new: 15, qualifying: 120 });

  if (currentUser?.role !== 'ADMIN') {
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-sla-breached)]">Unauthorized</h1>
        <p className="text-muted mb-8">You must be an Admin to view Admin Settings.</p>
        <Link href="/app" className="btn btn-primary">Return to Intake</Link>
      </main>
    );
  }

  // State for user management
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  // State for reassign leads
  const [reassignFrom, setReassignFrom] = useState('');
  const [reassignTo, setReassignTo] = useState('');

  // Matchmaker Configuration State
  const clientConfig = clients.find(c => c.id === currentUser?.locationId);
  const [newTherapist, setNewTherapist] = useState<Partial<Therapist>>({ psychographics: [], certifications: [] });
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [newService, setNewService] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser?.id) {
      updateUser(editingUser.id, editingUser);
    } else {
      const newUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: editingUser?.email || '',
        name: editingUser?.name || '',
        role: editingUser?.role || 'REP',
        status: 'active'
      };
      addUser(newUser);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignFrom || !reassignTo || reassignFrom === reassignTo) return;

    leads.forEach(l => {
      if (l.assignedRepId === reassignFrom) {
        updateLead(l.leadId, { assignedRepId: reassignTo });
      }
    });

    setShowReassignModal(false);
    setReassignFrom('');
    setReassignTo('');
    alert('Leads successfully reassigned!');
  };

  const handleAddTherapist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientConfig || !newTherapist.name || !newTherapist.role) return;

    const therapist: Therapist = {
      id: 't_' + Math.random().toString(36).substr(2, 9),
      name: newTherapist.name,
      role: newTherapist.role,
      certifications: newTherapist.certifications || [],
      psychographics: newTherapist.psychographics || []
    };

    updateClient(clientConfig.id, {
      personnel: [...clientConfig.personnel, therapist]
    });
    setShowTherapistModal(false);
    setNewTherapist({ psychographics: [], certifications: [] });
  };

  const handleDeleteTherapist = (id: string) => {
    if (!clientConfig) return;
    if (confirm('Remove this personnel member?')) {
      updateClient(clientConfig.id, {
        personnel: clientConfig.personnel.filter(t => t.id !== id)
      });
    }
  };

  const handleWeightChange = (field: 'servicesWeight' | 'specialtiesWeight' | 'personnelWeight', value: number) => {
    if (!clientConfig) return;
    updateClient(clientConfig.id, {
      matchmakerConfig: {
        ...clientConfig.matchmakerConfig,
        [field]: value
      }
    });
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientConfig || !newService.trim()) return;
    updateClient(clientConfig.id, { services: [...clientConfig.services, newService.trim()] });
    setNewService('');
  };

  const handleRemoveService = (service: string) => {
    if (!clientConfig) return;
    updateClient(clientConfig.id, { services: clientConfig.services.filter(s => s !== service) });
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientConfig || !newSpecialty.trim()) return;
    updateClient(clientConfig.id, { specialties: [...clientConfig.specialties, newSpecialty.trim()] });
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (specialty: string) => {
    if (!clientConfig) return;
    updateClient(clientConfig.id, { specialties: clientConfig.specialties.filter(s => s !== specialty) });
  };

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/app/admin" className="btn btn-ghost">
          <ArrowLeft size={20} /> Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted">Manage your team and configure platform rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Team Management */}
        <section className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-4">
            <div>
              <h2 className="text-xl font-bold">Team Members</h2>
              <p className="text-sm text-muted">Add, edit, or disable users.</p>
            </div>
            <button 
              className="btn btn-primary btn-sm flex items-center gap-2"
              onClick={() => {
                setEditingUser({ role: 'REP', status: 'active' });
                setShowUserModal(true);
              }}
            >
              <UserPlus size={16} /> Add Member
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {users.map(u => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{u.name}</span>
                    {u.status === 'disabled' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold">Disabled</span>}
                  </div>
                  <div className="text-sm text-muted">{u.email}</div>
                  <div className="text-xs font-medium uppercase mt-1 tracking-wider text-[var(--color-brand)]">{u.role.replace('_', ' ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditingUser(u); setShowUserModal(true); }}><Edit size={16} /></button>
                  <button className="btn btn-ghost btn-sm text-orange-500" onClick={() => updateUser(u.id, { status: u.status === 'active' ? 'disabled' : 'active' })}>
                    <ShieldOff size={16} />
                  </button>
                  <button className="btn btn-ghost btn-sm text-red-500" onClick={() => { if(confirm('Delete user?')) deleteUser(u.id); }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Reassignment & System Settings */}
        <div className="flex flex-col gap-8">
          
          <section className="glass-panel p-6">
            <div className="mb-4 border-b border-[var(--color-border)] pb-4">
              <h2 className="text-xl font-bold">Reassign Leads</h2>
              <p className="text-sm text-muted">Transfer all active leads from one rep to another.</p>
            </div>
            <button 
              className="btn btn-outline w-full flex items-center justify-center gap-2 py-4"
              onClick={() => setShowReassignModal(true)}
            >
              <ArrowRightLeft size={18} /> Open Reassignment Tool
            </button>
          </section>

          <section className="glass-panel p-6">
            <div className="mb-4 border-b border-[var(--color-border)] pb-4">
              <h2 className="text-xl font-bold">SLA Configurations</h2>
              <p className="text-sm text-muted">Adjust the breach timers for intake stages.</p>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center p-3 rounded bg-[var(--color-surface)]">
                <span>New Inquiry (Fresh)</span>
                <span className="font-bold">{slaConfigs.new} minutes</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-[var(--color-surface)]">
                <span>Qualifying</span>
                <span className="font-bold">{slaConfigs.qualifying} minutes</span>
              </div>
              <button 
                className="btn btn-ghost btn-sm text-[var(--color-brand)] mt-2"
                onClick={() => setShowSlaModal(true)}
              >
                Edit SLAs...
              </button>
            </div>
          </section>

          {/* Matchmaker Config */}
          {clientConfig && (
            <section className="glass-panel p-6 border border-[var(--color-brand)]">
              <div className="mb-4 border-b border-[var(--color-border)] pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--color-brand)]">
                    <Sparkles size={20} /> Matchmaker Configuration
                  </h2>
                  <p className="text-sm text-muted">Configure your local matching weights and personnel.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Local Weighting Levers */}
                <div className="relative">
                  <h3 className="font-semibold text-sm mb-3">Matching Weights (Levers)</h3>
                  
                  {!clientConfig.premiumMatchmakingEnabled && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-surface)]/60 backdrop-blur-[2px] rounded-lg border border-[var(--color-border)]">
                      <Lock size={20} className="text-muted mb-1" />
                      <p className="text-xs font-bold uppercase tracking-wider">Premium Feature</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 opacity-100">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Services Fit</span>
                        <span className="font-bold">{clientConfig.matchmakerConfig.servicesWeight}%</span>
                      </div>
                      <input type="range" min="0" max="100" className="w-full calc-slider" value={clientConfig.matchmakerConfig.servicesWeight} onChange={(e) => handleWeightChange('servicesWeight', parseInt(e.target.value))} disabled={!clientConfig.premiumMatchmakingEnabled} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Specialties Fit</span>
                        <span className="font-bold">{clientConfig.matchmakerConfig.specialtiesWeight}%</span>
                      </div>
                      <input type="range" min="0" max="100" className="w-full calc-slider" value={clientConfig.matchmakerConfig.specialtiesWeight} onChange={(e) => handleWeightChange('specialtiesWeight', parseInt(e.target.value))} disabled={!clientConfig.premiumMatchmakingEnabled} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-brand)] font-medium">Personnel Psychographics</span>
                        <span className="font-bold">{clientConfig.matchmakerConfig.personnelWeight}%</span>
                      </div>
                      <input type="range" min="0" max="100" className="w-full calc-slider" value={clientConfig.matchmakerConfig.personnelWeight} onChange={(e) => handleWeightChange('personnelWeight', parseInt(e.target.value))} disabled={!clientConfig.premiumMatchmakingEnabled} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--color-border)] pt-4">
                  {/* Services Management */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Facility Services</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {clientConfig.services.map(s => (
                        <span key={s} className="badge bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-1">
                          {s} <X size={12} className="cursor-pointer text-muted hover:text-[var(--color-sla-breached)]" onClick={() => handleRemoveService(s)} />
                        </span>
                      ))}
                    </div>
                    <form onSubmit={handleAddService} className="flex gap-2">
                      <input type="text" className="input flex-1 input-sm" placeholder="e.g. Detox, IOP" value={newService} onChange={e => setNewService(e.target.value)} />
                      <button type="submit" className="btn btn-ghost btn-sm">Add</button>
                    </form>
                  </div>

                  {/* Specialties Management */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Clinical Specialties</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {clientConfig.specialties.map(s => (
                        <span key={s} className="badge bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-1">
                          {s} <X size={12} className="cursor-pointer text-muted hover:text-[var(--color-sla-breached)]" onClick={() => handleRemoveSpecialty(s)} />
                        </span>
                      ))}
                    </div>
                    <form onSubmit={handleAddSpecialty} className="flex gap-2">
                      <input type="text" className="input flex-1 input-sm" placeholder="e.g. Dual Diagnosis" value={newSpecialty} onChange={e => setNewSpecialty(e.target.value)} />
                      <button type="submit" className="btn btn-ghost btn-sm">Add</button>
                    </form>
                  </div>
                </div>

                {/* Personnel Management */}
                <div className="relative border-t border-[var(--color-border)] pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-sm">Personnel (Therapists)</h3>
                    <button className="btn btn-ghost btn-sm text-[var(--color-brand)]" disabled={!clientConfig.premiumMatchmakingEnabled} onClick={() => setShowTherapistModal(true)}>
                      <Plus size={16} /> Add
                    </button>
                  </div>

                  {!clientConfig.premiumMatchmakingEnabled && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-surface)]/60 backdrop-blur-[2px] rounded-lg mt-8 border border-[var(--color-border)]">
                      <Lock size={20} className="text-muted mb-1" />
                      <p className="text-xs font-bold uppercase tracking-wider">Premium Feature</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {clientConfig.personnel.map(t => (
                      <div key={t.id} className="flex justify-between items-center p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                        <div>
                          <p className="font-semibold text-sm">{t.name}</p>
                          <p className="text-xs text-muted">{t.role} • {t.psychographics.join(', ')}</p>
                        </div>
                        <button className="btn btn-ghost btn-sm text-red-500" onClick={() => handleDeleteTherapist(t.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {clientConfig.personnel.length === 0 && (
                      <p className="text-sm text-muted italic">No personnel added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">{editingUser?.id ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <form onSubmit={handleUserSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                <input required type="text" className="input w-full" value={editingUser?.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Email</label>
                <input required type="email" className="input w-full" value={editingUser?.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Role</label>
                <select className="input w-full" value={editingUser?.role || 'REP'} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}>
                  <option value="REP">Intake Rep</option>
                  <option value="ADMIN">Co-Admin</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ArrowRightLeft size={24} /> Reassign Leads</h2>
            <form onSubmit={handleReassignSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Transfer From</label>
                <select required className="input w-full" value={reassignFrom} onChange={(e) => setReassignFrom(e.target.value)}>
                  <option value="">Select current owner...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Transfer To</label>
                <select required className="input w-full" value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                  <option value="">Select new owner...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowReassignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Reassign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLA Modal */}
      {showSlaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Edit SLAs</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowSlaModal(false);
              alert('SLA settings updated successfully!');
            }} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">New Inquiry (minutes)</label>
                <input required type="number" min="1" className="input w-full" value={slaConfigs.new} onChange={(e) => setSlaConfigs({ ...slaConfigs, new: parseInt(e.target.value) || 15 })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Qualifying (minutes)</label>
                <input required type="number" min="1" className="input w-full" value={slaConfigs.qualifying} onChange={(e) => setSlaConfigs({ ...slaConfigs, qualifying: parseInt(e.target.value) || 120 })} />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowSlaModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save SLAs</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Therapist Modal */}
      {showTherapistModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">Add Personnel</h2>
            <form onSubmit={handleAddTherapist} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Full Name *</label>
                <input required type="text" className="input w-full" value={newTherapist.name || ''} onChange={e => setNewTherapist({...newTherapist, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Role *</label>
                <input required type="text" className="input w-full" placeholder="e.g. Lead Therapist" value={newTherapist.role || ''} onChange={e => setNewTherapist({...newTherapist, role: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Psychographics (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['direct', 'gentle', 'analytical', 'highly_structured', 'flexible', 'group_oriented', 'one_on_one'].map(trait => (
                    <label key={trait} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={newTherapist.psychographics?.includes(trait) || false}
                        onChange={(e) => {
                          const current = newTherapist.psychographics || [];
                          if (e.target.checked) {
                            setNewTherapist({...newTherapist, psychographics: [...current, trait]});
                          } else {
                            setNewTherapist({...newTherapist, psychographics: current.filter(t => t !== trait)});
                          }
                        }}
                      />
                      <span className="capitalize">{trait.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setShowTherapistModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Personnel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
