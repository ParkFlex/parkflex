import {useState, useEffect, useCallback} from 'react';

import { useAxios } from './useAxios';
import { isAxiosError } from "axios";
import type {AdminReportEntry} from "../models/AdminReportEntry.tsx";

export const useAdminReport = () => {
    const axios = useAxios();
    const [adminReportEntries, setAdminReportEntries] = useState<AdminReportEntry[]>([]);

    useEffect(() => {
        const fetchUserListEntries = async () => {

            try {
                const resp = await axios.get<AdminReportEntry[]>(
                    `/reports`,
                );
                setAdminReportEntries(resp.data);
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                        return;
                    }
                    console.error('Error fetching history entries', err);
                    setAdminReportEntries([]);
                } else {
                    console.error('Unexpected error occurred', err);
                }

            }
        };
        void fetchUserListEntries();
    }, [axios]);

    const approveReport = useCallback( async (reportId: number) => {
        try {
            await axios.post(`/penalty`, {reportId: reportId}, { headers: {'Content-Type': 'application/json'} });
            try {
                const resp = await axios.get<AdminReportEntry[]>(`/reports`);
                setAdminReportEntries(resp.data);
            } catch (err) {
                console.warn('Failed to refresh report list after approving report', err);
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                    return;
                }
                console.error('Error approving report', err);
            } else {
                console.error('Unexpected error occurred', err);
            }
        }
    }, [axios]);

    const changeReviewed = useCallback( async (reportId: number) => {
        try {
            await axios.patch(`/report/${reportId}/reviewed`, null, { headers: {'Content-Type': 'application/json'} });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                if (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError')) {
                    return;
                }
                console.error('Error changing reviewed status', err);
            } else {
                console.error('Unexpected error occurred', err);
            }
        }
    }, [axios]);

    return  {adminReportEntries, approveReport, changeReviewed};
}