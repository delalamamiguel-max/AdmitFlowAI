export const PHI_WARNING_MESSAGE = 'Keep notes operational. Do not enter diagnoses, symptoms, medications, policy numbers, IDs, or clinical documentation.';

// Simple regex patterns to detect common PHI formats
export const PHI_PATTERNS = [
  // DOB patterns (MM/DD/YYYY, MM-DD-YYYY, etc.)
  /\b(0[1-9]|1[0-2])[\/\-](0[1-9]|[12]\d|3[01])[\/\-](\d{4}|\d{2})\b/g,
  // SSN patterns (XXX-XX-XXXX)
  /\b\d{3}[\-]?\d{2}[\-]?\d{4}\b/g,
  // Email patterns
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Insurance ID / Policy number patterns (loose heuristics)
  /\b(policy|member|group|id)\s*(number|#)?\s*[:\-]?\s*[A-Z0-9]{5,15}\b/gi,
  // Common clinical terms (very basic heuristic)
  /\b(diagnosis|symptom|withdrawal|detox|medication|rx|therapy|psychiatric|lab result)\b/gi,
  // Phone numbers (simplistic)
  /\b(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g
];

export function containsPHI(text: string): { hasPHI: boolean, matches: string[] } {
  const matches: string[] = [];
  
  for (const pattern of PHI_PATTERNS) {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }
  
  return {
    hasPHI: matches.length > 0,
    matches: Array.from(new Set(matches))
  };
}

export function sanitizeText(text: string): string {
  let sanitized = text;
  for (const pattern of PHI_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  return sanitized;
}

