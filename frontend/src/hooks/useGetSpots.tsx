import { useAxios } from "./useAxios.ts";
import type { SpotState } from "../api/spots.ts";
import { formatLocalDateTime } from "../utils/dateUtils.ts";
import { isAxiosError } from "axios";
import type { ApiErrorModel } from "../models/ApiErrorModel.tsx";
import { Toast } from "primereact/toast";
import { type RefObject, useCallback } from "react";

export const useGetSpots = (
    setSpots: (xs: SpotState[]) => void,
    toast: RefObject<Toast | null>
) => {
    const axios = useAxios();
    return useCallback((
        day: Date,
        startTime: Date,
        endTime: Date,
    ) => {
        const startDate = new Date(day);
        startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0);

        const endDate = new Date(day);
        endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0);

        axios.get<{ "spots": SpotState[] }>(
            "/spots",
            {
                params: {
                    "start": formatLocalDateTime(startDate),
                    "end": formatLocalDateTime(endDate)
                }
            }
        ).then(resp => {
            const spots = resp.data.spots;
            spots.sort((a, b) => a.displayOrder - b.displayOrder);

            setSpots(spots);
        }).catch(e => {
            let summary: string;
            let detail: string;
            if (isAxiosError(e) && e.response) {
                const msg = e.response.data as ApiErrorModel;
                summary = "Nie można pobrać danych o miejscach";
                detail = msg.message;
            } else {
                summary = "Nieznany błąd";
                detail = e.response;
            }

            toast.current?.show(
                {
                    sticky: false,
                    life: 3000,
                    summary: summary,
                    detail: detail,
                    severity: "error",
                    closable: false,
                }
            );
        });
    }, [setSpots, toast, axios]);
};