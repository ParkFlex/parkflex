import { useState, useEffect } from 'react';

import { useAxios } from '../useAxios.ts';
import { isAxiosError } from "axios";
import type { AdminHistoryEntry } from "../../models/admin/AdminHistoryEntry.tsx";

export const useAdminHistory = () => {
    const axios = useAxios();
    const [adminHistoryEntries, setAdminHistoryEntries] = useState<AdminHistoryEntry[]>([]);

    useEffect(() => {
        const fetchUserListEntries = async () => {

            try {
                const resp = await axios.get<AdminHistoryEntry[]>(
                    `/admin/users/history`,
                );

                setAdminHistoryEntries(resp.data);
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                        return;
                    }
                    console.error('Error fetching history entries', err);
                    setAdminHistoryEntries([]);
                } else {
                    console.error('Unexpected error occurred', err);
                }

            }
        };
        void fetchUserListEntries();
    }, [axios]);

    return  adminHistoryEntries;
};