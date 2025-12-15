import { useState, useEffect } from 'react';

import { useAxios } from './useAxios';
import { isAxiosError } from "axios";
import type {UserListEntry} from "../models/UserListEntry.tsx";

export const useUserListEntry = () => {
    const axios = useAxios();
    const [userListEntries, setUserListEntries] = useState<UserListEntry[]>([]);

    useEffect(() => {
        const fetchUserListEntries = async () => {

            try {
                const resp = await axios.get<UserListEntry[]>(
                    `/user`,
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

    return {userListEntries};
}