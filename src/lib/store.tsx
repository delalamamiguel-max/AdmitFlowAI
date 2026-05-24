'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, LeadStatus, User } from './types';
import { calculateSLADeadline, getSLAStatus } from './sla';

interface LeadContextType {
  leads: Lead[];
  isUnlocked: boolean;
  cryptoKey: CryptoKey | null;
  currentUser: User | null;
  addLead: (lead: Lead) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  moveLead: (leadId: string, newStatus: LeadStatus) => void;
  deleteLead: (leadId: string) => void;
  unlock: (key: CryptoKey, user: User) => void;
  lock: () => void;
  generateLeadId: () => string;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('admitflow_leads');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLeads(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse leads', e);
      }
    }
  }, []);

  const saveLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
    localStorage.setItem('admitflow_leads', JSON.stringify(newLeads));
  };

  const addLead = (lead: Lead) => {
    saveLeads([...leads, lead]);
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    saveLeads(leads.map(l => l.leadId === leadId ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
  };

  const moveLead = (leadId: string, newStatus: LeadStatus) => {
    saveLeads(leads.map(l => {
      if (l.leadId === leadId) {
        const now = new Date().toISOString();
        const newDeadline = calculateSLADeadline(newStatus, now);
        return { 
          ...l, 
          status: newStatus, 
          updatedAt: now,
          slaDeadline: newDeadline,
          slaStatus: getSLAStatus(newDeadline)
        };
      }
      return l;
    }));
  };

  const deleteLead = (leadId: string) => {
    saveLeads(leads.filter(l => l.leadId !== leadId));
  };

  const unlock = (key: CryptoKey, user: User) => {
    setCryptoKey(key);
    setCurrentUser(user);
    setIsUnlocked(true);
  };

  const lock = () => {
    setCryptoKey(null);
    setCurrentUser(null);
    setIsUnlocked(false);
  };

  const generateLeadId = () => {
    return 'AF-' + Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Check SLA status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      const updatedLeads = leads.map(l => {
        const newStatus = getSLAStatus(l.slaDeadline);
        if (newStatus !== l.slaStatus) {
          changed = true;
          return { ...l, slaStatus: newStatus };
        }
        return l;
      });
      if (changed) {
        setLeads(updatedLeads);
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [leads]);

  return (
    <LeadContext.Provider value={{
      leads, isUnlocked, cryptoKey, currentUser, addLead, updateLead, moveLead, deleteLead, unlock, lock, generateLeadId
    }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
