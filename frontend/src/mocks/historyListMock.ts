import type { AdminHistoryEntry } from "../models/AdminHistoryEntry.tsx";

export const mockHistoryList: AdminHistoryEntry[] = [
  { plate: 'PO11111', startTime: new Date('2025-12-06T11:30:00'), durationMin: 180, status: 'ok', spot: 42 },
  { plate: 'KR67890', startTime: new Date('2025-12-06T10:00:00'), durationMin: 60, status: 'ok', spot: 23 },
  { plate: 'WA12345', startTime: new Date('2025-12-05T20:30:00'), durationMin: 120, status: 'ok', spot: 15 },
  { plate: 'WR33333', startTime: new Date('2025-12-05T16:15:00'), durationMin: 45, status: 'ok', spot: 31 },
  { plate: 'GD22222', startTime: new Date('2025-12-03T14:00:00'), durationMin: 90, status: 'ok', spot: 8 },
  { plate: 'LU55555', startTime: new Date('2025-12-02T13:30:00'), durationMin: 150, status: 'ok', spot: 27 },
  { plate: 'KA44444', startTime: new Date('2025-12-02T09:00:00'), durationMin: 240, status: 'penalty', spot: 12 },
  { plate: 'SZ66666', startTime: new Date('2025-12-01T07:45:00'), durationMin: 60, status: 'penalty', spot: 5 }
];

