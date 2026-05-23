'use client';

import React, { useState, useEffect } from 'react';
import { Lead } from '@/lib/types';
import { useLeads } from '@/lib/store';
import { decryptData } from '@/lib/crypto';
import { SLATimer } from './SLATimer';

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
      } catch (e) {
        if (isMounted) setDecryptedName('[Decryption Error]');
      }
    }
    decrypt();
    return () => { isMounted = false; };
  }, [cryptoKey, lead.encryptedPayload]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.leadId);
  };

  const completedTasks = lead.tasks.filter(t => t.completed).length;

  return (
    <div 
      className="lead-card" 
      data-sla={lead.slaStatus}
      draggable={true}
      onDragStart={handleDragStart}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm">{lead.leadId}</span>
        <span className="text-xs text-muted">{formatRelativeTime(lead.lastContactTimestamp || lead.createdAt)}</span>
      </div>
      
      <div className="font-medium">
        {decryptedName}
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="badge">{lead.source.replace('_', ' ')}</span>
        {lead.tasks.length > 0 && (
          <span className="text-xs text-muted">Tasks: {completedTasks}/{lead.tasks.length}</span>
        )}
      </div>

      <div className="mt-2">
        <SLATimer deadline={lead.slaDeadline} />
      </div>

      {lead.disposition && (
        <div className="mt-2 text-xs text-muted border border-[var(--color-border)] rounded px-2 py-1 inline-block">
          {lead.disposition.replace(/_/g, ' ')}
        </div>
      )}
    </div>
  );
}
