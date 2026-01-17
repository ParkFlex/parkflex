import { useAxios } from "./useAxios";
import type {
    CreateReservationSuccessResponse,
    ReservationResponse,
} from "../models/reservation/ReservationResponse.tsx";
import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { ApiErrorModel } from "../models/ApiErrorModel";
import { formatLocalDateTime } from "../utils/dateUtils.ts";

/**
 * Hook do tworzenia rezerwacji miejsc parkingowych.
 * 
 * @returns Obiekt z funkcją reserve oraz stanem rezerwacji, ładowania i błędów
 * 
 * @remarks
 * Hook zarządza całym cyklem życia rezerwacji:
 * - Stan ładowania podczas zapytania
 * - Obsługę błędów z API
 * - Zapis ostatniej utworzonej rezerwacji
 * 
 * Zwracany obiekt zawiera:
 * - `reserve` - Funkcja async do tworzenia rezerwacji
 * - `reservation` - Ostatnio utworzona rezerwacja lub null
 * - `loading` - Flaga czy trwa ładowanie
 * - `error` - Obiekt błędu lub null
 * 
 * @example
 * ```tsx
 * const { reserve, loading, error } = usePostReservation();
 * 
 * const handleReserve = async () => {
 *   try {
 *     const start = new Date(2026, 0, 13, 10, 0);
 *     const response = await reserve(42, start, 120);
 *     console.log(response.message);
 *   } catch (err) {
 *     console.error('Rezerwacja nieudana');
 *   }
 * };
 * ```
 */
export const usePostReservation = () => {
    const axios = useAxios();
    const [reservation, setReservation] = useState<ReservationResponse | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiErrorModel | null>(null);

    /**
     * Tworzy nową rezerwację miejsca parkingowego.
     * 
     * @param spotId - ID miejsca parkingowego do zarezerwowania
     * @param start - Data i czas rozpoczęcia rezerwacji
     * @param durationMinutes - Czas trwania rezerwacji w minutach
     * @returns Promise z odpowiedzią zawierającą utworzoną rezerwację
     * @throws {Error} Błąd z komunikatem z API lub ogólny błąd
     * 
     * @remarks
     * Funkcja wykonuje POST /api/reservation z danymi:
     * - spot_id: ID miejsca
     * - start: Data w formacie ISO (local time)
     * - duration: Czas trwania w minutach
     * 
     * Automatycznie aktualizuje stany: loading, error, reservation
     */
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
