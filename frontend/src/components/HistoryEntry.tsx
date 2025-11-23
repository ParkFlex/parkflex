import { Card } from 'primereact/card';
import {addMinutes, formatTime, isActiveNow, isBeforeNow} from "../utils/dateUtils";
import type {HistoryEntry} from "../models/HistoryEntry.tsx";


export default function HistoryEntryComp({ entry }: {entry: HistoryEntry}) {
    const startDate = new Date(entry.startTime);
    const endTime = addMinutes(startDate, entry.durationMin);

    type StatusKey = 'kara' | 'aktywny' | 'zakończony' | 'zaplanowany' | 'brak';

    const hasPenalty = ('status' in entry) && entry.status === 'penalty';
    const activeNow = isActiveNow(entry.startTime, entry.durationMin);
    const beforeNow = isBeforeNow(entry.startTime);

    let statusKey: StatusKey;
    if (hasPenalty) {
        statusKey = 'kara';
    } else if (activeNow) {
        statusKey = 'aktywny';
    } else if (beforeNow) {
        statusKey = 'zakończony';
    } else {
        statusKey = 'zaplanowany';
    }


    let color: string;
    switch (statusKey) {
        case 'kara':
            color = 'red';
            break;
        case 'aktywny':
            color = '#2196f3';
            break;
        default:
            color = '#666';
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{ flex: 1 , }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem', fontFamily: 'monospace' }}>
                        <strong>{formatTime(startDate)}-{formatTime(endTime)}</strong>
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        color: '#666',
                        textTransform: 'capitalize'
                    }}>
                        {statusKey}
                    </div>
                </div>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: '#454f7e',
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
