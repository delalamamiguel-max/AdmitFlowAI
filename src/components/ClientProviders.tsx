'use client';

import { LeadProvider } from '@/lib/store';
import React from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <LeadProvider>{children}</LeadProvider>;
}
