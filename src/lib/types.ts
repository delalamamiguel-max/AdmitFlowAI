export type LeadStatus = 'inquiry_received' | 'intake_in_progress' | 'vob_pending' | 'scheduled_for_admit' | 'admitted' | 'closed_lost';

export type SLAStatus = 'fresh' | 'warning' | 'breached';

export type CallDisposition = 
  | 'spoke_to_lead'
  | 'spoke_to_family'
  | 'no_answer_voicemail'
  | 'busy_callback'
  | 'not_a_fit'
  | 'needs_higher_care';

export type LeadSource = 
  | 'google_ads'
  | 'organic_seo'
  | 'helpline'
  | 'alumni_referral'
  | 'local_consultant'
  | 'walk_in'
  | 'website_form'
  | 'phone_call'
  | 'other';

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

export interface Lead {
  leadId: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  assignedRepId: string;
  source: LeadSource;
  lastContactTimestamp: string | null;
  disposition: CallDisposition | null;
  slaDeadline: string;
  slaStatus: SLAStatus;
  encryptedPayload: EncryptedPayload | null;
  tasks: LeadTask[];
  logisticalNotes: string;
}

export interface DecryptedLeadInfo {
  clientName: string;
  phoneNumber: string;
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

export interface DailyReportMetrics {
  date: string;
  totalInquiries: number;
  totalAdmits: number;
  totalClosedLost: number;
  slaBreachCount: number;
  slaBreachPercentage: number;
  avgResponseMinutes: number;
  leadsBySource: Record<LeadSource, number>;
  leadsByDisposition: Record<string, number>;
}
