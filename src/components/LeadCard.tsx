'use client';

import React, { useState, useEffect } from 'react';
import { Lead } from '@/lib/types';
import { useLeads } from '@/lib/store';
import { decryptData } from '@/lib/crypto';
import { SLATimer } from './SLATimer';
import { User, Clock, AlertCircle } from 'lucide-react';

function formatRelativeTime(timestamp: string | null): string {
  if (!timestamp) return 'Never';
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatUrgency(urgency: string | null): { label: string, colorClass: string } | null {
  if (!urgency) return null;
  switch (urgency) {
    case 'immediate': return { label: 'Immediate', colorClass: 'text-[var(--color-sla-breached)] bg-[var(--color-sla-breached)]/10' };
    case 'same_day': return { label: 'Same Day', colorClass: 'text-[var(--color-sla-warning)] bg-[var(--color-sla-warning)]/10' };
    case 'this_week': return { label: 'This Week', colorClass: 'text-[var(--color-brand)] bg-[var(--color-brand)]/10' };
    default: return { label: urgency.replace('_', ' '), colorClass: 'text-muted bg-[var(--color-border)]' };
  }
}

export function LeadCard({ lead, onSelect }: { lead: Lead, onSelect: () => void }) {
  const { cryptoKey } = useLeads();
  const [decryptedName, setDecryptedName] = useState<string>('Loading...');

  useEffect(() => {
    let isMounted = true;
    async function decrypt() {
      if (!cryptoKey) {
        if (isMounted) setDecryptedName('[Locked]');
        return;
      }
      if (!lead.encryptedPayload) {
        if (isMounted) setDecryptedName('Unknown Client');
        return;
      }
      try {
        const jsonStr = await decryptData(lead.encryptedPayload.ciphertext, lead.encryptedPayload.iv, cryptoKey);
        const data = JSON.parse(jsonStr);
        if (isMounted) setDecryptedName(data.clientName);
      } catch {
        if (isMounted) setDecryptedName('[Decryption Error]');
      }
    }
    decrypt();
    return () => { isMounted = false; };
  }, [cryptoKey, lead.encryptedPayload]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.leadId);
  };

  const urgencyProps = formatUrgency(lead.urgencyLevel);

  return (
    <div 
      className="lead-card" 
      data-sla={lead.slaStatus}
      draggable={true}
      onDragStart={handleDragStart}
      onClick={onSelect}
    >
      {/* Header: ID, Source, Time */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{lead.leadId}</span>
          <span className="text-xs uppercase font-bold text-muted bg-[var(--color-surface)] px-1 rounded border border-[var(--color-border)]">
            {lead.source.replace('_', ' ')}
          </span>
        </div>
        <span className="text-xs text-muted" title="Last Contact">
          {formatRelativeTime(lead.lastContactTimestamp || lead.createdAt)}
        </span>
      </div>
      
      {/* Client Name & Stage */}
      <div className="flex justify-between items-start mb-3">
        <div className="font-bold text-lg leading-tight">
          {decryptedName}
        </div>
        <span className="badge text-xs capitalize whitespace-nowrap ml-2 shrink-0">
          {lead.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Meta: Urgency & Owner */}
      <div className="flex items-center gap-3 mb-3">
        {urgencyProps && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${urgencyProps.colorClass}`}>
            <AlertCircle size={12} />
            {urgencyProps.label}
          </div>
        )}
        {(lead.nextActionOwner || lead.assignedRepId) && (
          <div className="flex items-center gap-1 text-xs text-muted">
            <User size={12} />
            {lead.nextActionOwner || lead.assignedRepId || 'Unassigned'}
          </div>
        )}
      </div>

      {/* Next Action & SLA */}
      <div className="border-t border-[var(--color-border)] pt-3 mt-auto">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted flex items-center gap-1">
              <Clock size={12} /> NEXT ACTION
            </span>
            <span className="text-sm font-medium">
              {lead.logisticalNotes ? (lead.logisticalNotes.length > 30 ? lead.logisticalNotes.substring(0, 30) + '...' : lead.logisticalNotes) : 'No action set'}
            </span>
          </div>
          <SLATimer deadline={lead.slaDeadline} />
        </div>
      </div>
    </div>
  );
}
