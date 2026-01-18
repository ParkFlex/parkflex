import {Card} from 'primereact/card';
import {addMinutes, formatTime, isActiveNow, endsBeforeNow} from "../utils/dateUtils";
import type {HistoryEntry, HistoryEntryStatus} from "../models/history/HistoryEntry.tsx";

/**
 * Komponent wyświetlający pojedynczy wpis w historii rezerwacji.
 *
 * @param props - Właściwości komponentu
 * @param props.entry - Dane wpisu historii do wyświetlenia
 *
 * @remarks
 * Komponent automatycznie określa status rezerwacji:
 * - **Kara** (czerwony) - jeśli status === 'penalty'
 * - **Aktywny** (niebieski) - jeśli rezerwacja jest w trakcie
 * - **Zakończony** (zielony) - jeśli rezerwacja się zakończyła
 * - **Zaplanowany** (zielony) - jeśli rezerwacja jest w przyszłości
 *
 * TODO: Funkcja endsBeforeNow może nie działać poprawnie - wymaga weryfikacji.
 *
 * @example
 * ```tsx
 * const entry: HistoryEntry = {
 *   startTime: new Date(),
 *   durationMin: 120,
 *   status: "active",
 *   spot: 42
 * };
 *
 * <HistoryEntryComp entry={entry} />
 * ```
 */
export default function HistoryEntryComp({entry}: { entry: HistoryEntry }) {
    const startDate = new Date(entry.startTime);
    const endTime = addMinutes(startDate, entry.durationMin);

    const statusShowable = (status: HistoryEntryStatus) => {
        switch(status) {
            case 'Penalty': return "Kara";
            case "InProgress": return "W trakcie";
            case "Past": return "Zakończona"
            case "Planned": return "Zaplanowana";
        }
    };

    let color: string;
    switch (entry.status) {
        case 'Penalty':
            color = '#f63a3a';
            break;
        case 'InProgress':
            color = '#4caae6';
            break;
        case "Planned":
            color = '#32aa9c';
            break;
        case "Past":
            color = '#4b807b';
            break;
    }

    return (
        <Card
            className="entry"
            style={{
                marginBottom: '1.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: '10px solid ' + color,
            }}
        >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{flex: 1,}}>
                    <div style={{
                        fontSize: '1.3rem',
                        marginBottom: '0.3rem',
                        fontFamily: 'monospace'
                    }}>
                        <strong>{formatTime(startDate)}-{formatTime(endTime)}</strong>
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        color: '#666',
                        textTransform: 'capitalize'
                    }}>
                        {statusShowable(entry.status)}
                    </div>
                </div>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: '#4b807b',
                    marginLeft: '2rem',
                    minWidth: '100px',
                    textAlign: 'center'
                }}>
                    {entry.spot}
                </div>
            </div>
        </Card>
    );
}
