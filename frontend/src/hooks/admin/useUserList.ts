import { useState, useEffect, useCallback } from 'react';

import { useAxios } from '../useAxios.ts';
import { isAxiosError } from "axios";
import type { AdminUserEntry } from "../../models/admin/AdminUserEntry.tsx";

export const useUserList = () => {
    const axios = useAxios();
    const [userListEntries, setUserListEntries] = useState<AdminUserEntry[]>([]);

    useEffect(() => {
        const fetchUserListEntries = async () => {

            try {
                const resp = await axios.get<AdminUserEntry[]>(
                    `/admin/user`,
                );
                setUserListEntries(resp.data);
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                        return;
                    }
                    console.error('Error fetching history entries', err);
                    setUserListEntries([]);
                } else {
                    console.error('Unexpected error occurred', err);
                }

            }
        };
        void fetchUserListEntries();
    }, [axios]);

    const cancelPenalty = useCallback(async (penaltyId: number) => {
        if (!penaltyId) return;
        try {
            await axios.patch(`/admin/user/penalty/${penaltyId}/cancel`, null, { headers: { 'Content-Type': 'application/json' } });
            try {
                const resp = await axios.get<AdminUserEntry[]>(`/admin/user`);
                setUserListEntries(resp.data);
            } catch (err) {
                console.warn('Failed to refresh user list after cancelling penalty', err);
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                    return;
                }
                console.error('Error cancelling penalty', err);
            } else {
                console.error('Unexpected error occurred', err);
            }
        }
    }, [axios]);

    const changePlate = useCallback(async (userId: number, newPlate: string) => {
        if (!userId || !newPlate) return;
        try {
            await axios.patch(`/admin/user/${userId}`, { plate: newPlate }, { headers: { 'Content-Type': 'application/json' } });
            try {
                const resp = await axios.get<AdminUserEntry[]>(`/admin/user`);
                setUserListEntries(resp.data);
            } catch (err) {
                console.warn('Failed to refresh user list after changing plate', err);
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                    return;
                }
                console.error('Error changing plate', err);
            } else {
                console.error('Unexpected error occurred', err);
            }
        }
    }, [axios]);

    return { userListEntries, cancelPenalty, changePlate };
};