import { DateTime } from 'luxon';
import type { LockInfo } from './types';

const PRAGUE_TZ = 'Europe/Prague';

export function getLockInfo(seasonYear: number): LockInfo {
  const cutoff = DateTime.fromObject(
    { year: seasonYear, month: 3, day: 1, hour: 0, minute: 0 },
    { zone: PRAGUE_TZ }
  );
  const now = DateTime.now().setZone(PRAGUE_TZ);
  const locked = now >= cutoff;

  return {
    locked,
    cutoff: cutoff.toISO() ?? cutoff.toUTC().toISO() ?? '',
    lockedSince: locked ? cutoff.toISO() ?? undefined : undefined,
  };
}
