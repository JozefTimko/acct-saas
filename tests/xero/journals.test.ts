import { describe, it, expect } from 'vitest';
import type { GLRow } from './types';
import { filterJournalsByNominals } from './filterLines';
import { sortJournalsByDate } from './sortByDate';

describe('journals — filter & sort', () => {
  it('filters by nominals and sorts by date asc', () => {
    const rows: GLRow[] = [
      { accountCode: '260', date: '2024-01-03' } as any,
      { accountCode: '200', date: '2024-01-01' } as any,
      { accountCode: '200', date: '2024-01-02' } as any,
    ];
    const filtered = filterJournalsByNominals(rows, ['200']);
    expect(filtered.every(r => String(r.accountCode) === '200')).toBe(true);
    const sorted = sortJournalsByDate(filtered);
    expect(sorted.map(r => r.date)).toEqual(['2024-01-01', '2024-01-02']);
  });
});
