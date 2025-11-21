import { useState, useEffect } from 'react';
import { HistoryEntry } from '../models/HistoryEntry.tsx';

export const useHistoryEntries = () => {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            setLoading(true);

            // Mock data - replace with actual API call
            const mockData: HistoryEntry[] = [
                {
                    startTime: new Date('2026-01-15T10:00:00'),
                    durationMin: 367,
                    status: 'completed',
                    spot: 12
                },
                {
                    startTime: new Date('2027-01-16T14:30:00'),
                    durationMin: 544,
                    status: 'parked',
                    spot: 7
                },
                {
                    startTime: new Date('2024-01-17T09:15:00'),
                    durationMin: 60,
                    status: 'cancelled',
                    spot: 23
                },
                {
                    startTime: new Date('2024-01-15T20:00:00'),
                    durationMin: 367,
                    status: 'completed',
                    spot: 12
                },
                {
                    startTime: new Date('2024-01-16T15:30:00'),
                    durationMin: 544,
                    status: 'parked',
                    spot: 7
                },
                {
                    startTime: new Date('2024-01-17T19:15:00'),
                    durationMin: 60,
                    status: 'cancelled',
                    spot: 23
                }
            ];

            setEntries(mockData);
            setLoading(false);
        };

        fetchEntries();
    }, []);

    const sortedEntries = [...entries].sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

    return { entries: sortedEntries, loading };
};

