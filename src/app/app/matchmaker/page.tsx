'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { Target, Search, CheckCircle2, User, Building2 } from 'lucide-react';
import { Client, Therapist } from '@/lib/types';

interface MatchResult {
  client: Client;
  score: number;
  matchedTherapists: { therapist: Therapist, score: number }[];
}

export default function IntakeMatchmakerPage() {
  const { clients, globalSettings } = useLeads();
  
  // Patient Needs Input
  const [patientNeeds, setPatientNeeds] = useState({
    services: [] as string[],
    specialties: [] as string[],
    psychographics: [] as string[]
  });
  
  const [svcInput, setSvcInput] = useState('');
  const [specInput, setSpecInput] = useState('');
  const [psychInput, setPsychInput] = useState('');

  const [matches, setMatches] = useState<MatchResult[] | null>(null);

  const handleMatch = () => {
    const results: MatchResult[] = [];
    
    clients.forEach(client => {
      // Determine which weights to use (local if premium, else global)
      const config = client.premiumMatchmakingEnabled ? client.matchmakerConfig : globalSettings.matchmakerConfig;
      
      // Calculate Services Score
      let svcScore = 0;
      if (patientNeeds.services.length > 0) {
        const matches = patientNeeds.services.filter(s => client.services.includes(s)).length;
        svcScore = matches / patientNeeds.services.length;
      } else {
        svcScore = 1; // if no services specified, consider it a match
      }

      // Calculate Specialties Score
      let specScore = 0;
      if (patientNeeds.specialties.length > 0) {
        const matches = patientNeeds.specialties.filter(s => client.specialties.includes(s)).length;
        specScore = matches / patientNeeds.specialties.length;
      } else {
        specScore = 1;
      }

      // Calculate Personnel Score
      let bestPersonnelScore = 0;
      let matchedTherapists: { therapist: Therapist, score: number }[] = [];
      
      if (patientNeeds.psychographics.length > 0 && client.personnel) {
        client.personnel.forEach(therapist => {
          const tMatches = patientNeeds.psychographics.filter(p => therapist.psychographics?.includes(p)).length;
          const score = tMatches / patientNeeds.psychographics.length;
          if (score > 0) {
            matchedTherapists.push({ therapist, score: score * 100 });
          }
          if (score > bestPersonnelScore) {
            bestPersonnelScore = score;
          }
        });
        matchedTherapists.sort((a, b) => b.score - a.score);
      } else {
        bestPersonnelScore = 1;
      }

      // Total Score based on weights
      const totalScore = (
        (svcScore * config.servicesWeight) +
        (specScore * config.specialtiesWeight) +
        (bestPersonnelScore * config.personnelWeight)
      );

      if (totalScore > 0) {
        results.push({
          client,
          score: Math.round(totalScore),
          matchedTherapists
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    setMatches(results);
  };

  return (
    <div className="max-w-5xl mx-auto py-lg px-md">
      <div className="mb-xl">
        <h1 className="text-2xl font-bold flex items-center gap-xs">
          <Target className="text-brand" /> Global Patient Matchmaker
        </h1>
        <p className="text-muted mt-xs">Input patient needs and operational psychographics to find the best facility and personnel fit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-md border border-[var(--color-brand)]">
            <h3 className="font-semibold text-lg mb-md flex items-center gap-xs text-[var(--color-brand)]"><Search size={18} /> Patient Needs</h3>
            
            <div className="flex flex-col gap-md">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Required Services</label>
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="e.g. detox, residential (Press Enter)" 
                  value={svcInput}
                  onChange={e => setSvcInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && svcInput.trim()) {
                      setPatientNeeds({...patientNeeds, services: [...patientNeeds.services, svcInput.trim().toLowerCase()]});
                      setSvcInput('');
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {patientNeeds.services.map(s => (
                    <span key={s} className="px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium flex items-center gap-1 shadow-sm">
                      {s} <button className="text-muted hover:text-[var(--color-brand)] transition-colors" onClick={() => setPatientNeeds({...patientNeeds, services: patientNeeds.services.filter(x => x !== s)})}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Required Specialties</label>
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="e.g. trauma, dual_diagnosis (Press Enter)" 
                  value={specInput}
                  onChange={e => setSpecInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && specInput.trim()) {
                      setPatientNeeds({...patientNeeds, specialties: [...patientNeeds.specialties, specInput.trim().toLowerCase()]});
                      setSpecInput('');
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {patientNeeds.specialties.map(s => (
                    <span key={s} className="px-2 py-1 rounded-md bg-[var(--color-brand)]/10 text-[var(--color-brand)] border border-[var(--color-brand)]/20 text-sm font-medium flex items-center gap-1 shadow-sm">
                      {s} <button className="hover:opacity-70 transition-opacity" onClick={() => setPatientNeeds({...patientNeeds, specialties: patientNeeds.specialties.filter(x => x !== s)})}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Patient Psychographics</label>
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="e.g. direct, structured (Press Enter)" 
                  value={psychInput}
                  onChange={e => setPsychInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && psychInput.trim()) {
                      setPatientNeeds({...patientNeeds, psychographics: [...patientNeeds.psychographics, psychInput.trim().toLowerCase()]});
                      setPsychInput('');
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {patientNeeds.psychographics.map(p => (
                    <span key={p} className="px-2 py-1 rounded-md bg-[var(--color-sla-fresh)]/10 text-[var(--color-sla-fresh)] border border-[var(--color-sla-fresh)]/20 text-sm font-medium flex items-center gap-1 shadow-sm">
                      {p} <button className="hover:opacity-70 transition-opacity" onClick={() => setPatientNeeds({...patientNeeds, psychographics: patientNeeds.psychographics.filter(x => x !== p)})}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              <button 
                className="btn btn-primary w-full mt-sm"
                onClick={handleMatch}
                disabled={patientNeeds.services.length === 0 && patientNeeds.specialties.length === 0 && patientNeeds.psychographics.length === 0}
              >
                Find Matches
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {matches === null ? (
            <div className="h-full flex flex-col items-center justify-center text-muted border-2 border-dashed border-[var(--color-border)] rounded-xl p-xl bg-[var(--color-surface-glass)] backdrop-blur-md">
              <Target size={48} className="opacity-30 mb-sm" />
              <p>Input patient needs on the left to see matching facilities.</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted border-2 border-dashed border-[var(--color-border)] rounded-xl p-xl bg-[var(--color-surface-glass)] backdrop-blur-md">
              <p>No facilities match the criteria.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              <h3 className="font-semibold text-lg mb-xs text-[var(--color-text)]">Matching Facilities ({matches.length})</h3>
              
              {matches.map((match, idx) => (
                <div key={match.client.id} className="glass-panel p-md flex flex-col gap-md relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 bg-[var(--color-sla-fresh)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                      BEST MATCH
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg flex items-center gap-xs"><Building2 size={18} className="text-[var(--color-brand)]" /> {match.client.name}</h4>
                      <div className="flex gap-2 mt-2">
                        {match.client.services.map(s => <span key={s} className="text-[10px] uppercase tracking-wider text-muted font-medium bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)]">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-2xl font-black ${match.score >= 80 ? 'text-[var(--color-sla-fresh)]' : match.score >= 50 ? 'text-[var(--color-sla-warning)]' : 'text-[var(--color-sla-breached)]'}`}>
                        {match.score}%
                      </span>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Match Score</span>
                    </div>
                  </div>

                  {match.matchedTherapists.length > 0 && (
                    <div className="mt-sm pt-sm border-t border-[var(--color-border)]">
                      <h5 className="text-[10px] font-bold text-[var(--color-brand)] uppercase tracking-wider mb-sm">Personnel Matches</h5>
                      <div className="flex flex-col gap-sm">
                        {match.matchedTherapists.map(tMatch => (
                          <div key={tMatch.therapist.id} className="flex justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                                <User size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm leading-tight">{tMatch.therapist.name}</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted font-medium">{tMatch.therapist.role}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-[var(--color-surface-glass)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-sla-fresh)] rounded-full" style={{ width: `${Math.round(tMatch.score)}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-[var(--color-sla-fresh)] w-10 text-right">{Math.round(tMatch.score)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
