import type {AxiosInstance} from "axios";
import {useCallback, useState} from "react";
import type { QuickReservationModel } from "../models/QuickReservationModel";
import {formatTime} from "../utils/dateUtils.ts";

export const useQuickReservation = (token: string, axios: AxiosInstance) => {
    const [quickReservation, setQuickReservation] = useState<QuickReservationModel | null>(null);

    const sendQuickReservation = useCallback(async (time: Date) => {
        await axios
            .post(
                `/api/quickReservation/${token}`,
                {
                    params: {
                        end: formatTime(time)
                    }
                })
            .then(e => setQuickReservation(e.data));
    }, []);

    return { quickReservation, sendQuickReservation };
}