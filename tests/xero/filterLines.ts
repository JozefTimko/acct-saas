import type { GLRow } from './types';
export function filterJournalsByNominals(rows: GLRow[], nominals: string[]): GLRow[] {
  if (!Array.isArray(rows) || !rows.length) return [];
  if (!Array.isArray(nominals) || !nominals.length) return rows;
  const set = new Set(nominals.map(String));
  return rows.filter(r => set.has(String(r.accountCode)));
}
