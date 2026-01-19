export type HistoryEntryStatus = "Planned" |  "InProgress" |  "Past" |  "Penalty";

/**
 * Reprezentuje wpis w historii rezerwacji użytkownika.
 * 
 * @remarks
 * Interface definiujący strukturę pojedynczego wpisu historii,
 * zawierający informacje o czasie, czasie trwania, statusie i miejscu.
 * 
 * @example
 * ```typescript
 * const entry: HistoryEntry = {
 *   startTime: new Date(2026, 0, 12, 10, 0),
 *   durationMin: 120,
 *   status: "completed",
 *   spot: 42
 * };
 * ```
 */
export interface HistoryEntry {
    /** Data i czas rozpoczęcia rezerwacji */
    startTime: Date;
    /** Czas trwania rezerwacji w minutach */
    durationMin: number;
    /** Status rezerwacji */
    status: HistoryEntryStatus;
    /** Numer miejsca parkingowego */
    spot: number;
}