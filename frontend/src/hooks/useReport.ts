import {useCallback, useState} from "react";
import {useAxios} from "./useAxios.ts";
import {isAxiosError} from "axios";
import type {ReportEntry} from "../models/ReportEntry.tsx";

export const useReport = () => {
    const axios=useAxios();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submitReport = useCallback (async (report: ReportEntry) => {
        if (!axios) {
            throw new Error("Axios instance is not available");
        }

        setLoading(true);
        setError(null);

        const form = new FormData();
        if (report.plate) form.append('plate', report.plate);
        if (report.issueTime) form.append('issueTime', report.issueTime.toISOString());
        if (report.comment) form.append('comment', report.comment);
        if (report.photo) form.append('base64data', report.photo);
        if (report.whoReported) form.append('whoReported', report.whoReported.toString());

        try {
            await axios.post('/reports', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (err) {
            if (isAxiosError(err)) {
                setError(new Error(err.response?.data?.message || 'Failed to submit report'));
            } else {
                setError(new Error('An unexpected error occurred'));
            }
        } finally {
            setLoading(false);
        }
    },[axios]);

    return {
        submitReport,
        loading,
        error,
    };

};