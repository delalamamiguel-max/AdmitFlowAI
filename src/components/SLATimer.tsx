'use client';

import React, { useState, useEffect } from 'react';
import { getSLAStatus, formatTimeRemaining } from '@/lib/sla';
import { Clock } from 'lucide-react';

export function SLATimer({ deadline }: { deadline: string }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const status = getSLAStatus(deadline);
  const formatted = formatTimeRemaining(deadline);

  return (
    <span className="sla-timer" data-status={status}>
      <Clock size={12} />
      {formatted}
    </span>
  );
}
