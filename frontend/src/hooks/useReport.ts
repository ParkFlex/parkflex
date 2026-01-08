import {useCallback, useState} from "react";
import {useAxios} from "./useAxios.ts";
import {isAxiosError} from "axios";
import type {ReportEntry} from "../models/ReportEntry.tsx";

export const useReport = () => {
    const axios=useAxios();
    const [loading, setLoading] = useState(false);

    const submitReport = useCallback (async (report: ReportEntry) => {
        if (!axios) {
            throw new Error("Axios instance is not available");
        }

        setLoading(true);

        const body = {
            plate: report.plate,
            comment: report.description,
            base64data: report.image,
        };

        try {
            await axios.post('/reports', body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            if (isAxiosError(err)) {
                console.error(err.response?.data?.message || 'Błąd podczas wysyłania zgłoszenia', err);
            } else {
                console.error('Nieoczekiwany błąd podczas wysyłania zgłoszenia', err);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    },[axios]);

    return {
        submitReport,
        loading,
    };

};