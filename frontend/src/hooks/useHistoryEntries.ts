import { useState, useEffect } from 'react';
import { HistoryEntry } from '../models/HistoryEntry.tsx';
import axios from 'axios';

export const useHistoryEntries = () => {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const userId = 1;

            try {
                const resp = await axios.get(`/api/historyEntry?userId=${userId}`);

                const data: Array<{ startTime: string; durationMin: number; status: string; spot: number }> = resp.data;
                const mapped: HistoryEntry[] = data.map(d => new HistoryEntry(new Date(d.startTime), d.durationMin, d.status, d.spot));
                setEntries(mapped);

            } catch (err: any) {
                if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                    return;
                }
                console.error('Error fetching history entries', err);
                setEntries([]);
            }
        };
        fetchEntries();
    }, []);

    const sortedEntries = [...entries].sort((a, b) => {
        // entries now have Date objects for startTime
        return b.startTime.getTime() - a.startTime.getTime();
    });

    return { entries: sortedEntries };
};
