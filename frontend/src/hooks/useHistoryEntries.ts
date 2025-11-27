import { useState, useEffect } from 'react';

import { useAxios } from './useAxios';
import type {HistoryEntry} from "../models/HistoryEntry.tsx";

export const useHistoryEntries = () => {
    const axios = useAxios();
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
                const resp = await axios.get<Array<HistoryEntry>>(`/historyEntry`, {params: {userId}});
                for (const respElement of resp.data) {
                    respElement.startTime = new Date(respElement.startTime);
                }
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
