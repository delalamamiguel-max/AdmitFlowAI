'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { encryptData } from '@/lib/crypto';
import { LeadSource } from '@/lib/types';
import { containsPHI, PHI_WARNING_MESSAGE } from '@/lib/phi-guard';
import { AlertTriangle, X } from 'lucide-react';
import { calculateSLADeadline } from '@/lib/sla';

export function NewLeadForm({ onClose }: { onClose: () => void }) {
  const { cryptoKey, addLead, generateLeadId } = useLeads();
  
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [source, setSource] = useState<LeadSource>('phone_call');
  const [repId, setRepId] = useState('');
  const [notes, setNotes] = useState('');
  const [phiWarning, setPhiWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotesBlur = () => {
    const check = containsPHI(notes);
    if (check.hasPHI) {
      setPhiWarning(`PHI Detected: Please remove ${check.matches.join(', ')}`);
    } else {
      setPhiWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !cryptoKey) return;
    
    const check = containsPHI(notes);
    if (check.hasPHI) {
      setPhiWarning(`Cannot save with PHI. Please remove: ${check.matches.join(', ')}`);
      return;
    }

    setLoading(true);
    
    try {
      const payloadString = JSON.stringify({ clientName, phoneNumber });
      const encrypted = await encryptData(payloadString, cryptoKey);
      
      const now = new Date().toISOString();
      const newLeadId = generateLeadId();
      
      addLead({
        leadId: newLeadId,
        createdAt: now,
        updatedAt: now,
        status: 'inquiry_received',
        assignedRepId: repId,
        source: source,
        lastContactTimestamp: now,
        disposition: null,
        slaDeadline: calculateSLADeadline('inquiry_received', now),
        slaStatus: 'fresh',
        encryptedPayload: encrypted,
        tasks: [],
        logisticalNotes: notes
      });
      
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <X size={18} />
        </button>
        
        <h2 className="font-bold text-xl mb-4">New Lead Inquiry</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="flex gap-md">
            <div className="w-full">
              <label className="text-sm font-medium text-muted mb-1 block">Client Name *</label>
              <input required type="text" className="input" value={clientName} onChange={e => setClientName(e.target.value)} />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-muted mb-1 block">Phone Number</label>
              <input type="tel" className="input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            </div>
          </div>
          
          <div className="flex gap-md">
            <div className="w-full">
              <label className="text-sm font-medium text-muted mb-1 block">Lead Source *</label>
              <select className="select" value={source} onChange={e => setSource(e.target.value as LeadSource)}>
                <option value="phone_call">Phone Call</option>
                <option value="website_form">Website Form</option>
                <option value="google_ads">Google Ads</option>
                <option value="organic_seo">Organic SEO</option>
                <option value="helpline">Helpline</option>
                <option value="alumni_referral">Alumni Referral</option>
                <option value="local_consultant">Local Consultant</option>
                <option value="walk_in">Walk In</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-muted mb-1 block">Assigned Rep</label>
              <input type="text" className="input" placeholder="e.g. rep123" value={repId} onChange={e => setRepId(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted mb-1 block">Initial Notes</label>
            <div className="phi-warning">
              <AlertTriangle size={16} />
              <span>{PHI_WARNING_MESSAGE}</span>
            </div>
            <textarea 
              className="textarea" 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Logistical details only..."
            />
            {phiWarning && <p className="text-xs text-[var(--color-sla-breached)] mt-1">{phiWarning}</p>}
          </div>
          
          <div className="flex justify-end mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Encrypting...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
