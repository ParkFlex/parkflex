import type { AdminHistoryEntry } from "../models/AdminHistoryEntry.tsx";

export const mockHistoryList: AdminHistoryEntry[] = [
  { plate: 'WA12345', startTime: new Date('2024-12-04T08:30:00'), durationMin: 120, status: 'ok', spot: 15 },
  { plate: 'KR67890', startTime: new Date('2024-12-04T10:00:00'), durationMin: 60, status: 'ok', spot: 23 },
  { plate: 'PO11111', startTime: new Date('2024-12-04T11:30:00'), durationMin: 180, status: 'penalty', spot: 42 },
  { plate: 'GD22222', startTime: new Date('2024-12-03T14:00:00'), durationMin: 90, status: 'ok', spot: 8 },
  { plate: 'WR33333', startTime: new Date('2024-12-03T16:15:00'), durationMin: 45, status: 'ok', spot: 31 },
  { plate: 'KA44444', startTime: new Date('2024-12-02T09:00:00'), durationMin: 240, status: 'penalty', spot: 12 },
  { plate: 'LU55555', startTime: new Date('2024-12-02T13:30:00'), durationMin: 150, status: 'ok', spot: 27 },
  { plate: 'SZ66666', startTime: new Date('2024-12-01T07:45:00'), durationMin: 60, status: 'penalty', spot: 5 }
];

