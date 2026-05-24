'use client';

import React, { useState, useEffect } from 'react';
import { useLeads } from '@/lib/store';
import { encryptData } from '@/lib/crypto';
import { containsPHI, PHI_WARNING_MESSAGE } from '@/lib/phi-guard';
import { AlertTriangle, X } from 'lucide-react';
import { calculateSLADeadline } from '@/lib/sla';
import { Lead, LeadSource, IntakeChannel, UrgencyLevel, PaymentPath, ServiceInterest, LeadStatus, CallerRole, PriorProgram } from '@/lib/types';

export function TwoLayerIntakeForm({ onClose }: { onClose: () => void }) {
  const { cryptoKey, addLead, generateLeadId } = useLeads();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [phiWarning, setPhiWarning] = useState('');

  // Layer 1 Fields (Fast First-Contact)
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channel, setChannel] = useState<IntakeChannel>('phone');
  const [source, setSource] = useState<LeadSource>('google');
  const [repId, setRepId] = useState('');
  const [stage, setStage] = useState<LeadStatus>('new');
  const [urgency, setUrgency] = useState<UrgencyLevel | ''>('');
  
  // Next Action fields (Layer 1)
  const [nextActionOwner, setNextActionOwner] = useState('');
  const [nextActionDue, setNextActionDue] = useState(''); // simplified date/time string for now
  
  // Layer 2 Fields (Fit & Follow Up)
  const [callerRole, setCallerRole] = useState<CallerRole | ''>('self');
  const [awareOfInquiry, setAwareOfInquiry] = useState<boolean | null>(null);
  const [callbackName, setCallbackName] = useState('');
  const [callbackNumber, setCallbackNumber] = useState('');
  const [permissionToLeaveVoicemail, setPermissionToLeaveVoicemail] = useState<boolean | null>(null);
  
  const [serviceInterest, setServiceInterest] = useState<ServiceInterest | ''>('');
  const [admitTimeline, setAdmitTimeline] = useState('');
  const [transportationConcern, setTransportationConcern] = useState<boolean | null>(null);
  
  const [paymentPath, setPaymentPath] = useState<PaymentPath | ''>('');
  const [insuranceCarrier, setInsuranceCarrier] = useState('');
  const [inNetworkRequired, setInNetworkRequired] = useState<boolean | null>(null);
  const [needsBenefitsVerification, setNeedsBenefitsVerification] = useState<boolean | null>(null);

  const [immediateSafetyConcern, setImmediateSafetyConcern] = useState(false);
  const [logisticalNotes, setLogisticalNotes] = useState('');

  const [priorTreatment, setPriorTreatment] = useState<PriorProgram[]>([]);

  const handleNotesBlur = () => {
    const check = containsPHI(logisticalNotes);
    if (check.hasPHI) {
      setPhiWarning(`PHI Detected: Please remove ${check.matches.join(', ')}`);
    } else {
      setPhiWarning('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !cryptoKey) return;
    
    const check = containsPHI(logisticalNotes);
    if (check.hasPHI) {
      setPhiWarning(`Cannot save with PHI. Please remove: ${check.matches.join(', ')}`);
      return;
    }

    setLoading(true);
    
    try {
      const payloadString = JSON.stringify({ 
        clientName, 
        phoneNumber,
        callbackName: callbackName || undefined,
        callbackNumber: callbackNumber || undefined
      });
      const encrypted = await encryptData(payloadString, cryptoKey);
      
      const now = new Date().toISOString();
      const newLeadId = generateLeadId();
      
      const lead: Lead = {
        leadId: newLeadId,
        createdAt: now,
        updatedAt: now,
        status: stage,
        channel,
        source,
        assignedRepId: repId,
        preferredContactMethod: null,
        bestContactWindow: null,
        encryptedPayload: encrypted,
        callerRole: (callerRole as CallerRole) || null,
        awareOfInquiry,
        permissionToLeaveVoicemail,
        serviceInterest: (serviceInterest as ServiceInterest) || null,
        desiredLocation: null,
        admitTimeline: null,
        transportationConcern,
        treatmentOrHousing: null,
        ageBand: null,
        genderIdentity: null,
        safePlaceToTalk: null,
        environment: null,
        employmentOrSchoolObligations: null,
        activeLegalRequirements: null,
        socialSupport: null,
        urgencyLevel: (urgency as UrgencyLevel) || null,
        recentSubstanceUse: null,
        medicalSafetyConcern: null,
        immediateSafetyConcern,
        paymentPath: (paymentPath as PaymentPath) || null,
        insuranceCarrier,
        inNetworkRequired: null,
        budgetSensitivity: null,
        needsBenefitsVerification,
        priorTreatment,
        priorSoberLiving: null,
        promptForCall: null,
        biggestBarrier: null,
        disposition: null,
        nextActionOwner,
        nextActionDue,
        followupCadence: null,
        followupChannel: null,
        logisticalNotes,
        tasks: [],
        slaDeadline: calculateSLADeadline(stage, now),
        slaStatus: 'fresh',
        lastContactTimestamp: now,
      };

      addLead(lead);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating lead');
    } finally {
      setLoading(false);
    }
  };

  const isUrgent = urgency === 'immediate' || immediateSafetyConcern;

  return (
    <div className="modal-overlay p-0 md:p-4" onClick={onClose}>
      <div className="modal-content glass-panel max-w-3xl w-full h-full md:h-auto flex flex-col md:rounded-xl rounded-none p-0 md:p-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="btn btn-ghost btn-sm absolute top-4 right-4 z-10 md:top-6 md:right-6">
          <X size={18} />
        </button>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-0">
          <h2 className="font-bold text-2xl mb-2">New Inquiry Intake</h2>
          
          {/* Stepper Progress */}
          <div className="flex gap-2 mb-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border)]'}`}></div>
          </div>

          {isUrgent && (
            <div className="p-4 bg-[var(--color-sla-breached)]/10 border border-[var(--color-sla-breached)] rounded-md mb-6 text-sm text-[var(--color-sla-breached)]">
              <strong>CRITICAL:</strong> For immediate danger or crisis, call 911 or 988. For treatment referral support, contact SAMHSA at 1-800-662-HELP.
            </div>
          )}

          <form id="intake-form" onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* LAYER 1: First Contact */}
          {step === 1 && (
            <div className="animate-fade-in flex flex-col gap-6">
              <h3 className="font-semibold text-lg border-b border-[var(--color-border)] pb-2">Layer 1: Fast First-Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Client Name *</label>
                  <input required type="text" className="input" value={clientName} onChange={e => setClientName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number</label>
                  <input type="tel" className="input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Urgency Level</label>
                  <select className="select" value={urgency} onChange={e => setUrgency(e.target.value as UrgencyLevel)}>
                    <option value="">Select...</option>
                    <option value="immediate">Immediate</option>
                    <option value="same_day">Same Day</option>
                    <option value="this_week">This Week</option>
                    <option value="future_planning">Future Planning</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" id="safety" checked={immediateSafetyConcern} onChange={e => setImmediateSafetyConcern(e.target.checked)} />
                  <label htmlFor="safety" className="text-sm text-[var(--color-sla-breached)] font-medium">Immediate Safety Concern?</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Channel</label>
                  <select className="select" value={channel} onChange={e => setChannel(e.target.value as IntakeChannel)}>
                    <option value="phone">Phone</option>
                    <option value="web_form">Web Form</option>
                    <option value="referral_partner">Referral Partner</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Source</label>
                  <select className="select" value={source} onChange={e => setSource(e.target.value as LeadSource)}>
                    <option value="google">Google</option>
                    <option value="therapist">Therapist</option>
                    <option value="alumni">Alumni</option>
                    <option value="hospital">Hospital</option>
                    <option value="family_referral">Family Referral</option>
                    <option value="sober_living_referral">Sober Living Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--color-surface-glass)] rounded-md border border-[var(--color-border)]">
                <div>
                  <label className="text-sm font-medium mb-1 block">Assigned Rep</label>
                  <input type="text" className="input" placeholder="e.g. rep123" value={repId} onChange={e => setRepId(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pipeline Stage</label>
                  <select className="select" value={stage} onChange={e => setStage(e.target.value as LeadStatus)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualifying">Qualifying</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Next Action Due</label>
                  <input type="datetime-local" className="input" value={nextActionDue} onChange={e => setNextActionDue(e.target.value)} required={isUrgent} />
                </div>
              </div>

            </div>
          )}

          {/* LAYER 2: Fit-and-Follow-Up */}
          {step === 2 && (
            <div className="animate-fade-in flex flex-col gap-6">
              <h3 className="font-semibold text-lg border-b border-[var(--color-border)] pb-2">Layer 2: Fit & Follow-Up</h3>
              
              {/* Caller Logic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Who is calling?</label>
                  <select className="select" value={callerRole} onChange={e => setCallerRole(e.target.value as CallerRole)}>
                    <option value="self">Self</option>
                    <option value="parent">Parent</option>
                    <option value="spouse_partner">Spouse / Partner</option>
                    <option value="family_member">Family Member</option>
                    <option value="friend">Friend</option>
                    <option value="case_manager">Case Manager</option>
                    <option value="treatment_provider">Treatment Provider</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {callerRole !== 'self' && callerRole !== '' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Is the prospective client aware?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="aware" checked={awareOfInquiry === true} onChange={() => setAwareOfInquiry(true)} /> Yes</label>
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="aware" checked={awareOfInquiry === false} onChange={() => setAwareOfInquiry(false)} /> No</label>
                    </div>
                  </div>
                )}
              </div>

              {callerRole !== 'self' && callerRole !== '' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--color-surface-glass)] p-4 rounded-md border border-[var(--color-border)]">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Callback Name</label>
                    <input type="text" className="input" value={callbackName} onChange={e => setCallbackName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Callback Number</label>
                    <input type="tel" className="input" value={callbackNumber} onChange={e => setCallbackNumber(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Service Interest Logic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Service Interest</label>
                  <select className="select" value={serviceInterest} onChange={e => setServiceInterest(e.target.value as ServiceInterest)}>
                    <option value="">Select...</option>
                    <option value="detox_referral">Detox Referral</option>
                    <option value="residential_referral">Residential</option>
                    <option value="php">PHP</option>
                    <option value="iop">IOP</option>
                    <option value="sober_living">Sober Living</option>
                  </select>
                </div>
              </div>

              {serviceInterest === 'sober_living' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[var(--color-brand)] rounded-md bg-[var(--color-surface-glass)]">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Transportation Concern?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="transpo" checked={transportationConcern === true} onChange={() => setTransportationConcern(true)} /> Yes</label>
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="transpo" checked={transportationConcern === false} onChange={() => setTransportationConcern(false)} /> No</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial / Insurance Logic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Payment Path</label>
                  <select className="select" value={paymentPath} onChange={e => setPaymentPath(e.target.value as PaymentPath)}>
                    <option value="">Select...</option>
                    <option value="commercial_insurance">Commercial Insurance</option>
                    <option value="private_pay">Private Pay</option>
                    <option value="scholarship">Scholarship / Funding</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>

              {paymentPath === 'commercial_insurance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[var(--color-brand)] rounded-md bg-[var(--color-surface-glass)]">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Insurance Carrier (Do NOT enter member ID)</label>
                    <input type="text" className="input" value={insuranceCarrier} onChange={e => setInsuranceCarrier(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Needs VOB?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="vob" checked={needsBenefitsVerification === true} onChange={() => setNeedsBenefitsVerification(true)} /> Yes</label>
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="vob" checked={needsBenefitsVerification === false} onChange={() => setNeedsBenefitsVerification(false)} /> No</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes with PHI Guard */}
              <div>
                <label className="text-sm font-medium text-muted mb-1 block">Logistical Notes</label>
                <div className="phi-warning mb-2 p-2 bg-amber-500/20 border border-amber-500/50 rounded-md flex gap-2 text-sm text-amber-500">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{PHI_WARNING_MESSAGE}</span>
                </div>
                <textarea 
                  className="textarea h-24" 
                  value={logisticalNotes} 
                  onChange={e => setLogisticalNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  placeholder="e.g. Prefers evening callback, needs women's housing..."
                />
                {phiWarning && <p className="text-xs text-[var(--color-sla-breached)] mt-1">{phiWarning}</p>}
              </div>

            </div>
          )}
        </form>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 left-0 right-0 bg-[var(--color-surface)]/90 backdrop-blur-md p-4 border-t border-[var(--color-border)] mt-auto flex justify-between items-center md:rounded-b-xl z-20 shadow-lg">
          {step === 1 ? (
            <>
              <button form="intake-form" type="submit" className="btn btn-ghost" disabled={loading}>
                Save & Exit
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                Continue to Fit & Details
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button form="intake-form" type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Encrypting & Saving...' : 'Complete Intake'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
