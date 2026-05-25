export type LeadStatus = 'draft' | 'new' | 'contacted' | 'qualifying' | 'pending_verification' | 'tour_scheduled' | 'assessment_scheduled' | 'follow_up' | 'admitted' | 'lost';
export type SLAStatus = 'fresh' | 'warning' | 'breached';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'REP';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  locationId?: string; // Links to Client.id
  name: string;
  status?: 'active' | 'disabled';
}

// --- Matchmaker & Client Configuration ---

export interface Therapist {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  psychographics: string[];
}

export interface MatchmakerConfig {
  servicesWeight: number;       // e.g. 40
  specialtiesWeight: number;    // e.g. 30
  personnelWeight: number;      // e.g. 30 (requires premium)
}

export interface Client {
  id: string;
  name: string;
  email: string;
  accessEmails: string;
  status: 'active' | 'paused' | 'archived';
  users: number;
  mrr: number;
  premiumMatchmakingEnabled: boolean;
  
  // Matchmaker Data
  services: string[];
  specialties: string[];
  personnel: Therapist[];
  matchmakerConfig: MatchmakerConfig;
}

// Global Architectural Settings (Super Admin)
export interface GlobalMatchmakerSettings {
  baseServicesWeight: number;
  baseSpecialtiesWeight: number;
  basePersonnelWeight: number;
}


export type IntakeChannel = 'phone' | 'web_form' | 'referral_partner' | 'walk_in' | 'text';
export type LeadSource = 'google' | 'therapist' | 'alumni' | 'hospital' | 'family_referral' | 'sober_living_referral' | 'other';
export type PreferredContactMethod = 'call' | 'text' | 'email';

export type CallerRole = 'self' | 'parent' | 'spouse_partner' | 'family_member' | 'friend' | 'case_manager' | 'treatment_provider' | 'other';

export type ServiceInterest = 'detox_referral' | 'residential_referral' | 'php' | 'iop' | 'op' | 'sober_living' | 'transitional_living' | 'not_sure_yet';
export type AdmitTimeline = 'today' | 'within_24_hours' | '2_to_7_days' | '1_to_2_weeks' | 'just_researching';
export type TreatmentOrHousing = 'treatment' | 'housing' | 'both' | 'not_sure';

export type AgeBand = '18_to_24' | '25_to_34' | '35_to_44' | '45_to_54' | '55_plus';
export type Environment = 'at_home' | 'hospital' | 'treatment_center' | 'sober_home' | 'jail_court' | 'other';
export type SocialSupport = 'family' | 'partner' | 'sponsor' | 'none' | 'other';

export type UrgencyLevel = 'immediate' | 'same_day' | 'this_week' | 'future_planning';
export type YesNoUnknown = 'yes' | 'no' | 'unknown';
export type YesNoDeclined = 'yes' | 'no' | 'declined';
export type YesNoUnclear = 'yes' | 'no' | 'unclear';

export type PaymentPath = 'commercial_insurance' | 'private_pay' | 'scholarship' | 'unknown';
export type BudgetSensitivity = 'low' | 'moderate' | 'high';

export type PriorProgram = 'none' | 'detox' | 'residential' | 'php' | 'iop' | 'sober_living' | 'multiple';
export type PromptForCall = 'relapse_concern' | 'discharge_planning' | 'family_request' | 'housing_need' | 'court_pressure' | 'work_issue' | 'other';
export type BarrierCode = 'cost' | 'transportation' | 'motivation' | 'no_beds' | 'work_family_schedule' | 'not_ready' | 'unknown';

export type CallOutcome = 'no_answer' | 'left_voicemail' | 'wrong_number' | 'information_only' | 'qualified' | 'warm_transfer' | 'tour_scheduled' | 'assessment_scheduled' | 'admitted_elsewhere' | 'not_a_fit';
export type FollowupCadence = '2_hours' | 'same_day' | 'next_day' | '3_days' | '7_days';
export type FollowupChannel = 'call' | 'text' | 'email';

export interface LeadTask {
  taskId: string;
  todo: string;
  completed: boolean;
  createdAt: string;
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
}

export interface DecryptedLeadInfo {
  clientName: string;
  phoneNumber: string;
  callbackName?: string;
  callbackNumber?: string;
}

export interface Lead {
  // 1. Lead Record
  leadId: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  channel: IntakeChannel;
  source: LeadSource;
  assignedRepId: string;
  preferredContactMethod: PreferredContactMethod | null;
  bestContactWindow: string | null;

  // Encrypted Payload (Client Name, Phone, Callback Name, Callback Number)
  encryptedPayload: EncryptedPayload | null;

  // 2. Caller Relationship
  callerRole: CallerRole | null;
  awareOfInquiry: boolean | null;
  permissionToLeaveVoicemail: boolean | null;

  // 3. Program Interest
  serviceInterest: ServiceInterest | null;
  desiredLocation: string | null;
  admitTimeline: AdmitTimeline | null;
  transportationConcern: boolean | null;
  treatmentOrHousing: TreatmentOrHousing | null;

  // 4. Fit Screening & Psychographics
  ageBand: AgeBand | null;
  genderIdentity: string | null;
  safePlaceToTalk: boolean | null;
  environment: Environment | null;
  employmentOrSchoolObligations: boolean | null;
  activeLegalRequirements: YesNoUnknown | null;
  socialSupport: SocialSupport | null;
  
  // Patient Psychographics (HIPAA-compliant, behavioral/preference traits)
  communicationPreference: 'direct' | 'gentle' | 'analytical' | null;
  structurePreference: 'highly_structured' | 'flexible' | 'moderate' | null;
  groupComfort: 'high' | 'medium' | 'low' | null;


  // 5. Urgency and Routing
  urgencyLevel: UrgencyLevel | null;
  recentSubstanceUse: YesNoDeclined | null;
  medicalSafetyConcern: YesNoUnclear | null;
  immediateSafetyConcern: boolean | null;

  // 6. Coverage and Payment
  paymentPath: PaymentPath | null;
  insuranceCarrier: string | null;
  inNetworkRequired: YesNoUnknown | null;
  budgetSensitivity: BudgetSensitivity | null;
  needsBenefitsVerification: boolean | null;

  // 7. History Without Clinical Detail
  priorTreatment: PriorProgram[];
  priorSoberLiving: boolean | null;
  promptForCall: PromptForCall | null;
  biggestBarrier: BarrierCode | null;

  // 8. Outcome and Next Step
  disposition: CallOutcome | null;
  nextActionOwner: string | null;
  nextActionDue: string | null; // ISO DateTime
  followupCadence: FollowupCadence | null;
  followupChannel: FollowupChannel | null;
  logisticalNotes: string;
  
  // Tasks (legacy support / generic)
  tasks: LeadTask[];

  // SLA tracking
  slaDeadline: string;
  slaStatus: SLAStatus;
  lastContactTimestamp: string | null;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
}

export interface SLAConfig {
  stage: LeadStatus;
  durationMinutes: number;
}
