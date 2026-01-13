import { useState, useEffect } from 'react';

import { useAxios } from './useAxios';
import type { HistoryEntry } from "../models/HistoryEntry.tsx";
import { isAxiosError } from "axios";

/**
 * Hook do pobierania historii rezerwacji użytkownika.
 * 
 * @returns Obiekt zawierający posortowane wpisy historii
 * 
 * @remarks
 * TODO: userId jest zahardkodowane na wartość 2.
 * Należy pobierać prawdziwe ID zalogowanego użytkownika z kontekstu/stanu.
 * 
 * Hook automatycznie:
 * 1. Pobiera dane z GET /api/historyEntry?userId=2
 * 2. Konwertuje stringi dat na obiekty Date
 * 3. Sortuje wpisy od najnowszych do najstarszych
 * 4. Obsługuje błędy (w tym anulowanie zapytań)
 * 
 * @example
 * ```tsx
 * function HistoryPage() {
 *   const { entries } = useHistoryEntries();
 *   
 *   return (
 *     <div>
 *       {entries.map(entry => (
 *         <div key={entry.id}>{entry.startTime.toLocaleString()}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useHistoryEntries = () => {
    const axios = useAxios();
    const [entries, setEntries] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const userId = 2;

            // const json = {
            //     "userId": userId
            // }
            // ===
            // const json = {userId}

            try {
                const resp = await axios.get<Array<HistoryEntry>>(
                    `/historyEntry`,
                    { params: { userId } }
                );
                for (const respElement of resp.data) {
                    respElement.startTime = new Date(respElement.startTime);
                }
                setEntries(resp.data);

            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                        return;
                    }
                    console.error('Error fetching history entries', err);
                    setEntries([]);
                } else {
                    console.error('Unexpected error occurred', err);
                }
            }
        };
        void fetchEntries();
    }, [axios]);

    const sortedEntries = [...entries].sort((a, b) => {
        return b.startTime.getTime() - a.startTime.getTime();
    });

    return { entries: sortedEntries };
};
