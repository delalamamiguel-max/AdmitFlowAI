'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { User, UserRole, LeadStatus } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Edit, UserPlus, Trash2, ShieldOff, ShieldAlert, ArrowRightLeft } from 'lucide-react';

export default function AdminSettings() {
  const { leads, users, currentUser, updateLead, addUser, updateUser, deleteUser, generateLeadId } = useLeads();

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

    </main>
  );
}
