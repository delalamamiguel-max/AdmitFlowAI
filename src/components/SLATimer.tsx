'use client';

import React, { useState, useEffect } from 'react';
import { getSLAStatus, formatTimeRemaining } from '@/lib/sla';
import { Clock } from 'lucide-react';

export function SLATimer({ deadline }: { deadline: string }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
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
