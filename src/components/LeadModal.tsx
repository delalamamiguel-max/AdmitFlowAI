'use client';

import React, { useState, useEffect } from 'react';
import { Lead, CallOutcome, LeadTask } from '@/lib/types';
import { useLeads } from '@/lib/store';
import { decryptData } from '@/lib/crypto';
import { SLATimer } from './SLATimer';
import { containsPHI, PHI_WARNING_MESSAGE } from '@/lib/phi-guard';
import { AlertTriangle, X, Trash2, Plus } from 'lucide-react';

export function LeadModal({ leadId, onClose }: { leadId: string, onClose: () => void }) {
  const { leads, updateLead, deleteLead, cryptoKey } = useLeads();
  const lead = leads.find(l => l.leadId === leadId);
  
  const [decryptedName, setDecryptedName] = useState('Loading...');
  const [decryptedPhone, setDecryptedPhone] = useState('');
  const [decryptedCallbackName, setDecryptedCallbackName] = useState('');
  const [decryptedCallbackPhone, setDecryptedCallbackPhone] = useState('');
  
  const [notes, setNotes] = useState('');
  const [phiWarning, setPhiWarning] = useState('');
  const [newTaskTodo, setNewTaskTodo] = useState('');

  useEffect(() => {
    if (lead) {
      setNotes(lead.logisticalNotes);
    }
  }, [lead]);

  useEffect(() => {
    let isMounted = true;
    async function decrypt() {
      if (!cryptoKey || !lead?.encryptedPayload) return;
      try {
        const jsonStr = await decryptData(lead.encryptedPayload.ciphertext, lead.encryptedPayload.iv, cryptoKey);
        const data = JSON.parse(jsonStr);
        if (isMounted) {
          setDecryptedName(data.clientName);
          setDecryptedPhone(data.phoneNumber);
          setDecryptedCallbackName(data.callbackName || '');
          setDecryptedCallbackPhone(data.callbackNumber || '');
        }
      } catch (e) {
        if (isMounted) setDecryptedName('[Decryption Error]');
      }
    }
    decrypt();
    return () => { isMounted = false; };
  }, [cryptoKey, lead?.encryptedPayload]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!lead) return null;

  const handleNotesBlur = () => {
    const check = containsPHI(notes);
    if (check.hasPHI) {
      setPhiWarning(`PHI Detected: Please remove ${check.matches.join(', ')}`);
    } else {
      setPhiWarning('');
      if (notes !== lead.logisticalNotes) {
        updateLead(lead.leadId, { logisticalNotes: notes });
      }
    }
  };

  const handleDispositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLead(lead.leadId, { 
      disposition: (e.target.value || null) as CallOutcome | null,
      lastContactTimestamp: new Date().toISOString()
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTodo.trim()) return;
    const newTask: LeadTask = {
      taskId: 'T-' + Date.now(),
      todo: newTaskTodo,
      completed: false,
      createdAt: new Date().toISOString()
    };
    updateLead(lead.leadId, { tasks: [...lead.tasks, newTask] });
    setNewTaskTodo('');
  };

  const toggleTask = (taskId: string) => {
    updateLead(lead.leadId, {
      tasks: lead.tasks.map(t => t.taskId === taskId ? { ...t, completed: !t.completed } : t)
    });
  };

  const removeTask = (taskId: string) => {
    updateLead(lead.leadId, {
      tasks: lead.tasks.filter(t => t.taskId !== taskId)
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to permanently delete this lead?')) {
      deleteLead(lead.leadId);
      onClose();
    }
  };

  return (
    <div className="modal-overlay p-0 md:p-4" onClick={onClose}>
      <div className="modal-content glass-panel md:rounded-xl rounded-none w-full h-full md:h-auto p-4 md:p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-bold text-2xl">{lead.leadId}</h2>
            <div className="text-xl font-medium mt-1">{decryptedName}</div>
            <div className="text-muted text-sm">{decryptedPhone}</div>
            {decryptedCallbackName && (
              <div className="mt-2 text-sm">
                <strong>Callback:</strong> {decryptedCallbackName} {decryptedCallbackPhone && `(${decryptedCallbackPhone})`}
              </div>
            )}
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-end gap-sm">
              <span className="badge text-white" style={{ background: 'var(--color-brand)' }}>{lead.status.replace(/_/g, ' ').toUpperCase()}</span>
              <SLATimer deadline={lead.slaDeadline} />
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm p-1 shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-6 p-4 bg-[var(--color-surface-glass)] border border-[var(--color-border)] rounded-md">
          <div>
            <label className="text-sm font-medium text-muted mb-1 block">Call Outcome</label>
            <select className="select" value={lead.disposition || ''} onChange={handleDispositionChange}>
              <option value="">-- No Outcome --</option>
              <option value="no_answer">No Answer</option>
              <option value="left_voicemail">Left Voicemail</option>
              <option value="wrong_number">Wrong Number</option>
              <option value="information_only">Information Only</option>
              <option value="qualified">Qualified</option>
              <option value="warm_transfer">Warm Transfer</option>
              <option value="tour_scheduled">Tour Scheduled</option>
              <option value="assessment_scheduled">Assessment Scheduled</option>
              <option value="admitted_elsewhere">Admitted Elsewhere</option>
              <option value="not_a_fit">Not a Fit</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted mb-1 block">Lead Source</label>
            <div className="input bg-transparent border-transparent px-0 font-medium capitalize">
              {lead.source.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-muted mb-1 block">Next Action Owner</label>
            <input 
              type="text" 
              className="input" 
              value={lead.nextActionOwner || ''} 
              onChange={e => updateLead(lead.leadId, { nextActionOwner: e.target.value })} 
              placeholder="e.g. rep123" 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted mb-1 block">Next Action Due</label>
            <input 
              type="datetime-local" 
              className="input" 
              value={lead.nextActionDue || ''} 
              onChange={e => updateLead(lead.leadId, { nextActionDue: e.target.value })} 
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-muted mb-2 block">Tasks (Legacy)</label>
          <div className="flex flex-col gap-2 mb-3">
            {lead.tasks.map(task => (
              <div key={task.taskId} className="flex items-center gap-sm">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.taskId)} />
                <span className={`flex-1 ${task.completed ? 'line-through text-muted' : ''}`}>{task.todo}</span>
                <button onClick={() => removeTask(task.taskId)} className="btn btn-ghost btn-sm text-[var(--color-sla-breached)]">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {lead.tasks.length === 0 && <span className="text-sm text-muted">No tasks added yet.</span>}
          </div>
          <form onSubmit={handleAddTask} className="flex gap-sm">
            <input type="text" className="input" placeholder="New task..." value={newTaskTodo} onChange={e => setNewTaskTodo(e.target.value)} />
            <button type="submit" className="btn btn-ghost">
              <Plus size={18} />
            </button>
          </form>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-muted mb-1 block">Logistical Notes</label>
          <div className="phi-warning p-2 bg-amber-500/20 border border-amber-500/50 rounded-md flex gap-2 text-sm text-amber-500 mb-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{PHI_WARNING_MESSAGE}</span>
          </div>
          <textarea 
            className="textarea h-24" 
            value={notes} 
            onChange={e => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
          />
          {phiWarning && <p className="text-xs text-[var(--color-sla-breached)] mt-1">{phiWarning}</p>}
        </div>

        <div className="flex justify-between mt-8 border-t border-[var(--color-border)] pt-4">
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={16} /> Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
}
