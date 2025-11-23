import { useState, useEffect } from 'react';

import axios from 'axios';
import type {HistoryEntry} from "../models/HistoryEntry.tsx";

export const useHistoryEntries = () => {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const userId = 1;

            // const json = {
            //     "userId": userId
            // }
            // ===
            // const json = {userId}

            try {
                const resp = await axios.get<Array<HistoryEntry>>(`/api/historyEntry`, {params: {userId}});

                setEntries(resp.data);

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
        return b.startTime.getTime() - a.startTime.getTime();
    });

    return { entries: sortedEntries };
};
