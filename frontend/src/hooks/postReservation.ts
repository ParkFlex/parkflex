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

export const postReservation = () => {
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
        ): Promise<CreateReservationSuccessResponse | null> => {
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
                if (isAxiosError(e)) {
                    const data = e.response?.data as
                        | { message?: unknown; context?: unknown }
                        | undefined;
                    if (
                        typeof data?.message === "string" &&
                        typeof data?.context === "string"
                    ) {
                        const apiError = new ApiErrorModel(
                            data.message,
                            data.context
                        );
                        setError(apiError);
                        console.error("Error response:", apiError.message);
                        return null;
                    }

                    console.error("Error response:", e.message);
                    return null;
                }

                console.error("Unexpected error:", e);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [axios]
    );

    return { reserve, reservation, loading, error };
};
