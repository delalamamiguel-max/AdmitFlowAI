'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, LeadStatus, User, LeadSource, IntakeChannel, Client, GlobalMatchmakerSettings, Therapist } from './types';
import { calculateSLADeadline, getSLAStatus } from './sla';

interface LeadContextType {
  leads: Lead[];
  users: User[];
  clients: Client[];
  globalSettings: GlobalMatchmakerSettings;
  isUnlocked: boolean;
  cryptoKey: CryptoKey | null;
  currentUser: User | null;
  addLead: (lead: Lead) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  updateGlobalSettings: (updates: Partial<GlobalMatchmakerSettings>) => void;
  generateMockData: () => void;
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
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalMatchmakerSettings>({
    baseServicesWeight: 50,
    baseSpecialtiesWeight: 30,
    basePersonnelWeight: 20
  });
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Load Clients
    const storedClients = localStorage.getItem('admitflow_clients');
    if (storedClients) {
      try {
        setClients(JSON.parse(storedClients));
      } catch (e) {
        console.error('Failed to parse clients', e);
      }
    } else {
      const defaultClients: Client[] = [
        { 
          id: 'client_1', 
          name: 'Serenity Rehab Center', 
          email: 'admin@serenity.com', 
          accessEmails: 'billing@serenity.com', 
          status: 'active', 
          users: 12, 
          mrr: 2400,
          premiumMatchmakingEnabled: true,
          services: ['detox', 'residential', 'php', 'iop'],
          specialties: ['dual_diagnosis', 'trauma', 'substance_abuse'],
          matchmakerConfig: { servicesWeight: 40, specialtiesWeight: 30, personnelWeight: 30 },
          personnel: [
            { id: 't1', name: 'Dr. Sarah Jenkins', role: 'Lead Therapist', certifications: ['LCSW', 'EMDR'], psychographics: ['direct', 'analytical', 'highly_structured'] },
            { id: 't2', name: 'Mark Rivers', role: 'Counselor', certifications: ['CADC'], psychographics: ['gentle', 'flexible', 'group_oriented'] }
          ]
        },
        { 
          id: 'client_2', 
          name: 'Oceanside Sober Living', 
          email: 'hello@oceanside.com', 
          accessEmails: '', 
          status: 'active', 
          users: 5, 
          mrr: 1000,
          premiumMatchmakingEnabled: false,
          services: ['sober_living', 'iop', 'op'],
          specialties: ['substance_abuse', 'mens_only'],
          matchmakerConfig: { servicesWeight: 70, specialtiesWeight: 30, personnelWeight: 0 },
          personnel: []
        }
      ];
      setClients(defaultClients);
      localStorage.setItem('admitflow_clients', JSON.stringify(defaultClients));
    }

    // 2. Load Global Settings
    const storedSettings = localStorage.getItem('admitflow_global_settings');
    if (storedSettings) {
      try {
        setGlobalSettings(JSON.parse(storedSettings));
      } catch (e) {}
    }

    // 3. Load Leads
    const stored = localStorage.getItem('admitflow_leads');
    if (stored) {
      try {
        const parsedLeads = JSON.parse(stored);
        setLeads(parsedLeads);
        if (parsedLeads.length === 0) {
          generateMockData();
        }
      } catch (e) {
        console.error('Failed to parse leads', e);
      }
    } else {
      generateMockData();
    }

    // 4. Load Users
    const storedUsers = localStorage.getItem('admitflow_users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error('Failed to parse users', e);
      }
    } else {
      const defaultUsers: User[] = [
        { id: 'user_1', locationId: 'client_1', email: 'intake@admitflow.com', name: 'Intake Rep (Serenity)', role: 'REP', status: 'active' },
        { id: 'admin_1', locationId: 'client_1', email: 'admin@admitflow.com', name: 'Admin (Serenity)', role: 'ADMIN', status: 'active' },
        { id: 'super_1', email: 'super@admitflow.com', name: 'Super Admin', role: 'SUPER_ADMIN', status: 'active' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('admitflow_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('admitflow_users', JSON.stringify(newUsers));
  };

  const addUser = (user: User) => {
    saveUsers([...users, user]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    saveUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const deleteUser = (userId: string) => {
    saveUsers(users.filter(u => u.id !== userId));
  };

  const generateMockData = () => {
    const mockLeads: Lead[] = Array.from({ length: 20 }).map((_, i) => {
      const statuses: LeadStatus[] = ['new', 'contacted', 'qualifying', 'tour_scheduled', 'admitted', 'lost'];
      const sources: LeadSource[] = ['google', 'therapist', 'hospital', 'family_referral'];
      const channels: IntakeChannel[] = ['phone', 'web_form', 'referral_partner'];
      
      const status = statuses[i % statuses.length];
      const slaStatus = i % 3 === 0 ? 'breached' : i % 2 === 0 ? 'warning' : 'fresh';
      
      const now = new Date();
      now.setDate(now.getDate() - (i % 15)); // Scatter dates over last 15 days

      return {
        leadId: `AF-${10000 + i}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        status,
        channel: channels[i % channels.length],
        source: sources[i % sources.length],
        assignedRepId: i % 2 === 0 ? 'user_1' : 'admin_1',
        preferredContactMethod: 'call',
        bestContactWindow: 'Morning',
        encryptedPayload: null, // Simulated decryption bypass for UI purposes
        callerRole: 'self',
        awareOfInquiry: true,
        permissionToLeaveVoicemail: true,
        serviceInterest: 'residential_referral',
        desiredLocation: null,
        admitTimeline: 'within_24_hours',
        transportationConcern: false,
        treatmentOrHousing: 'treatment',
        ageBand: '25_to_34',
        genderIdentity: 'Male',
        safePlaceToTalk: true,
        environment: 'at_home',
        employmentOrSchoolObligations: false,
        activeLegalRequirements: 'no',
        socialSupport: 'family',
        
        // Mock Psychographics
        communicationPreference: i % 2 === 0 ? 'direct' : 'gentle',
        structurePreference: i % 3 === 0 ? 'highly_structured' : 'flexible',
        groupComfort: i % 2 === 0 ? 'high' : 'low',

        urgencyLevel: 'immediate',
        recentSubstanceUse: 'yes',
        medicalSafetyConcern: 'no',
        immediateSafetyConcern: false,
        paymentPath: 'commercial_insurance',
        insuranceCarrier: 'Aetna',
        inNetworkRequired: 'yes',
        budgetSensitivity: 'moderate',
        needsBenefitsVerification: true,
        priorTreatment: ['none'],
        priorSoberLiving: false,
        promptForCall: 'family_request',
        biggestBarrier: 'cost',
        lastContactTimestamp: null,
        disposition: 'qualified',
        nextActionOwner: null,
        nextActionDue: null,
        followupCadence: 'same_day',
        followupChannel: 'call',
        logisticalNotes: 'Mock data generated for QA',
        tasks: [],
        slaDeadline: new Date(Date.now() + 3600000).toISOString(),
        slaStatus
      };
    });
    setLeads(mockLeads);
    localStorage.setItem('admitflow_leads', JSON.stringify(mockLeads));
  };

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem('admitflow_clients', JSON.stringify(newClients));
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    saveClients(clients.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  const updateGlobalSettings = (updates: Partial<GlobalMatchmakerSettings>) => {
    const newSettings = { ...globalSettings, ...updates };
    setGlobalSettings(newSettings);
    localStorage.setItem('admitflow_global_settings', JSON.stringify(newSettings));
  };

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
      leads, users, clients, globalSettings, isUnlocked, cryptoKey, currentUser, addLead, updateLead, moveLead, deleteLead, addUser, updateUser, deleteUser, updateClient, updateGlobalSettings, unlock, lock, generateLeadId, generateMockData
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
