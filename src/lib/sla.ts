import { LeadStatus, SLAStatus, SLAConfig } from './types';

export const SLA_CONFIGS: Record<LeadStatus, number> = {
  inquiry_received: 15,
  intake_in_progress: 1440,
  vob_pending: 240,
  scheduled_for_admit: 1440,
  admitted: 1440,
  closed_lost: 1440,
};

export function calculateSLADeadline(status: LeadStatus, createdAt: string): string {
  const duration = SLA_CONFIGS[status] || 1440;
  const deadline = new Date(new Date(createdAt).getTime() + duration * 60000);
  return deadline.toISOString();
}

export function getTimeRemaining(deadline: string): { minutes: number, seconds: number, total: number, isBreached: boolean } {
  const total = new Date(deadline).getTime() - Date.now();
  const isBreached = total < 0;
  const absTotal = Math.abs(total);
  const minutes = Math.floor((absTotal / 1000 / 60) % 60);
  const seconds = Math.floor((absTotal / 1000) % 60);
  
  return {
    total,
    minutes,
    seconds,
    isBreached
  };
}

export function getSLAStatus(deadline: string): SLAStatus {
  const remaining = new Date(deadline).getTime() - Date.now();
  if (remaining < 0) return 'breached';
  
  // Assumes warning if < 30 mins remaining, else fresh
  if (remaining < 30 * 60000) return 'warning';
  
  return 'fresh';
}

export function formatTimeRemaining(deadline: string): string {
  const { total, minutes, seconds, isBreached } = getTimeRemaining(deadline);
  
  if (isBreached) {
    const hours = Math.floor(Math.abs(total) / (1000 * 60 * 60));
    const mins = Math.floor((Math.abs(total) / (1000 * 60)) % 60);
    return `BREACHED ${hours > 0 ? `${hours}h ` : ''}${mins}m ago`;
  }
  
  const hours = Math.floor(total / (1000 * 60 * 60));
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  
  return `${minutes}m ${seconds}s left`;
}
