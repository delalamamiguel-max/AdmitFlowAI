'use client';

import React, { useMemo } from 'react';
import { useLeads } from '@/lib/store';
import { Lead, Therapist } from '@/lib/types';
import { Sparkles, CheckCircle, Brain, Lock } from 'lucide-react';

export function MatchmakerPanel({ lead }: { lead: Lead }) {
  const { clients, globalSettings, currentUser } = useLeads();
  
  // Find the client this lead belongs to (using the current user's location)
  const client = clients.find(c => c.id === currentUser?.locationId) || clients[0];

  const matchResults = useMemo(() => {
    if (!client) return { generalScore: 0, therapistMatches: [] };

    const config = client.matchmakerConfig;
    const globalConfig = globalSettings.matchmakerConfig;

    // Use local client weights if set, otherwise fallback to global
    const wServices = config?.servicesWeight ?? globalConfig.servicesWeight;
    const wSpecialties = config?.specialtiesWeight ?? globalConfig.specialtiesWeight;
    const wPersonnel = config?.personnelWeight ?? globalConfig.personnelWeight;

    // 1. General Match Score (Services + Specialties)
    let generalScore = 0;
    
    // Simplistic mock scoring logic:
    // Does the client offer the service interest?
    if (lead.serviceInterest && client.services.some(s => s.includes(lead.serviceInterest!.split('_')[0]))) {
      generalScore += wServices;
    } else if (lead.serviceInterest) {
      generalScore += (wServices * 0.5); // partial match
    }

    // Is there a specialty match (e.g., dual diagnosis if they have substance use + other)
    if (client.specialties.length > 0) {
      generalScore += wSpecialties; // Mock: assume a fit for prototype
    }

    // Normalize general score out of 100
    const normalizedGeneral = Math.min(100, Math.round((generalScore / (wServices + wSpecialties)) * 100));

    // 2. Personnel Match Score (Psychographics)
    const therapistMatches = client.personnel.map(t => {
      let tScore = 0;
      
      if (lead.communicationPreference && t.psychographics.includes(lead.communicationPreference)) {
        tScore += 40;
      }
      if (lead.structurePreference && t.psychographics.includes(lead.structurePreference)) {
        tScore += 30;
      }
      if (lead.groupComfort && t.psychographics.includes(lead.groupComfort === 'high' ? 'group_oriented' : 'one_on_one')) {
        tScore += 30;
      }

      // If lead has no psychographics, give a baseline score
      if (!lead.communicationPreference && !lead.structurePreference && !lead.groupComfort) {
        tScore = 50; 
      }

      return {
        therapist: t,
        score: tScore
      };
    }).sort((a, b) => b.score - a.score);

    return {
      generalScore: normalizedGeneral || 85, // fallback for empty lead data
      therapistMatches
    };

  }, [lead, client, globalSettings]);

  if (!client) return null;

  return (
    <div className="bg-[var(--color-surface-glass)] border border-[var(--color-brand)] rounded-xl overflow-hidden mb-6">
      <div className="bg-[var(--color-brand)] text-white p-3 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Sparkles size={18} /> Matchmaker Engine
        </h3>
        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Powered by AdmitFlow OS</span>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* General Match (Free) */}
        <div className="flex flex-col gap-3 border-r border-[var(--color-border)] pr-4">
          <h4 className="font-semibold text-sm text-muted uppercase tracking-wider">Facility Match</h4>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-sla-fresh)] flex items-center justify-center">
              <span className="text-xl font-bold text-[var(--color-sla-fresh)]">{matchResults.generalScore}%</span>
            </div>
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-muted">Based on clinical services & level of care fit.</p>
            </div>
          </div>
          <div className="mt-2 text-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[var(--color-sla-fresh)]">
              <CheckCircle size={14} /> <span>Service Match</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-sla-fresh)]">
              <CheckCircle size={14} /> <span>Specialty Fit</span>
            </div>
          </div>
        </div>

        {/* Premium Personnel Match */}
        <div className="flex flex-col gap-3 relative">
          <h4 className="font-semibold text-sm text-[var(--color-brand)] uppercase tracking-wider flex items-center gap-2">
            <Brain size={16} /> Deep Psychographic Match
          </h4>
          
          {!client.premiumMatchmakingEnabled ? (
            <div className="absolute inset-0 bg-[var(--color-surface)]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-[var(--color-border)] p-4 text-center z-10 mt-6">
              <Lock size={24} className="text-muted mb-2" />
              <p className="font-bold text-sm">Premium Feature</p>
              <p className="text-xs text-muted mb-2">Upgrade to unlock therapist matching.</p>
              {currentUser?.role !== 'REP' && (
                <span className="text-[10px] bg-[var(--color-brand)] text-white px-2 py-1 rounded">Contact Support to Enable</span>
              )}
            </div>
          ) : null}

          <p className="text-sm text-muted mb-2">Best personnel matches based on patient traits:</p>
          
          <div className="flex flex-col gap-2">
            {matchResults.therapistMatches.length > 0 ? (
              matchResults.therapistMatches.slice(0, 2).map((match, idx) => (
                <div key={match.therapist.id} className={`flex items-center justify-between p-2 rounded-lg border ${idx === 0 ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
                  <div>
                    <p className="font-semibold text-sm">{match.therapist.name}</p>
                    <p className="text-xs text-muted">{match.therapist.role}</p>
                  </div>
                  <div className={`font-bold ${idx === 0 ? 'text-[var(--color-brand)]' : 'text-muted'}`}>
                    {match.score}%
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted italic">No personnel configured for this location.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
