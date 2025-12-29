import { useAxios } from "./useAxios";
import type {
    CreateReservationSuccessResponse,
    ReservationResponse,
} from "../models/ReservationResponse";
import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { ApiErrorModel } from "../models/ApiErrorModel";

const formatLocalDateTime = (date: Date): string => {
    const padding2 = (x: number) => String(x).padStart(2, "0");
    return `${date.getFullYear()}-${padding2(date.getMonth() + 1)}-${padding2(
        date.getDate()
    )}T${padding2(date.getHours())}:${padding2(date.getMinutes())}:${padding2(
        date.getSeconds()
    )}`;
};

export const usePostReservation = () => {
    const axios = useAxios();
    const [reservation, setReservation] = useState<ReservationResponse | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiErrorModel | null>(null);

    const reserve = useCallback(
        async (
            spotId: number,
            start: Date,
            durationMinutes: number
        ): Promise<CreateReservationSuccessResponse> => {
            setLoading(true);
            setError(null);

            try {
                const resp = await axios.post<CreateReservationSuccessResponse>(
                    `/reservation`,
                    {
                        spot_id: spotId,
                        start: formatLocalDateTime(start),
                        duration: durationMinutes,
                    }
                );

                setReservation(resp.data.reservation);
                return resp.data;
            } catch (e: unknown) {
                if (isAxiosError(e) && e.response) {
                    const data = e.response?.data as ApiErrorModel;
                    setError(data);
                    console.error("Error response:", data.message);
                    throw new Error(data.message);
                } else {
                    console.error("Unexpected error:", e);
                    throw e;
                }
            } finally {
                setLoading(false);
            }
        },
        [axios]
    );

    return { reserve, reservation, loading, error };
};
