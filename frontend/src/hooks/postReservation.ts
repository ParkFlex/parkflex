import { useAxios } from "./useAxios";
import type { ReservationResponse } from "../models/ReservationResponse.tsx";
import { use, useEffect, useState } from "react";
import { isAxiosError } from "axios";

export const postReservation = () => {
    const axios = useAxios();
    const [reservation, setReservation] = useState<ReservationResponse | null>(
        null
    );

    useEffect(() => {
        const fetchReservations = async () => {
            const spot_Id = 1;
            const start = "2025-12-08T10:00:00";
            const duration = 8;
            try {
                const resp = await axios.post<ReservationResponse>(
                    `/reservation`,
                    {
                        spot_id: spot_Id,
                        start: start,
                        duration: duration,
                    }
                );
                setReservation(resp.data);
            } catch (error: unknown) {
                if (isAxiosError(error)) {
                    console.error("Error response:", error.message);
                } else {
                    console.error("Unexpected error:", error);
                }
            }
        };
        fetchReservations();
    }, [axios]);

    return reservation;
};
