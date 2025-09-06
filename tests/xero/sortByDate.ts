import type { GLRow } from './types';
export function sortJournalsByDate(rows: GLRow[]): GLRow[] {
  return [...rows].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
