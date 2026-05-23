export const PHI_PATTERNS = [
  // SSN: XXX-XX-XXXX
  /\\b\\d{3}-\\d{2}-\\d{4}\\b/g,
  // DOB: MM/DD/YYYY or MM-DD-YYYY
  /\\b(?:0?[1-9]|1[0-2])[-\\/](?:0?[1-9]|[12][0-9]|3[01])[-\\/](?:19|20)\\d{2}\\b/g,
  // Email (very basic)
  /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g,
  // Insurance ID rough pattern (mix of letters and numbers)
  /\\b[A-Z]{3}\\d{6,}\\b/g,
  // Phone numbers (simplistic)
  /\\b(?:\\+?1[-.\\s]?)?(?:\\(\\d{3}\\)|\\d{3})[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b/g
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

export const PHI_WARNING_MESSAGE = 'Do not enter PHI (names, SSNs, DOBs, medical details). Use this space strictly for logistical scheduling.';
