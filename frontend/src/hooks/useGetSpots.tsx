import { useAxios } from "./useAxios.ts";
import type { SpotState } from "../api/spots.ts";
import { formatLocalDateTime } from "../utils/dateUtils.ts";
import { isAxiosError } from "axios";
import type { ApiErrorModel } from "../models/ApiErrorModel.tsx";
import { Toast } from "primereact/toast";
import { type RefObject, useCallback } from "react";

/**
 * Hook do pobierania listy miejsc parkingowych dla wybranego przedziału czasowego.
 * 
 * @param setSpots - Funkcja callback do aktualizacji stanu z listą miejsc
 * @param toast - Referencja do komponentu Toast do wyświetlania komunikatów o błędach
 * @returns Funkcja callback do pobierania miejsc dla wybranej daty i godzin
 * 
 * @remarks
 * Hook zwraca zmemoizowaną funkcję, która:
 * 1. Konstruuje przedział czasowy na podstawie dnia i godzin
 * 2. Wysyła zapytanie GET /api/spots z parametrami start i end
 * 3. Sortuje miejsca według displayOrder
 * 4. Aktualizuje stan przez callback setSpots
 * 5. Obsługuje błędy i wyświetla je przez Toast
 * 
 * @example
 * ```tsx
 * const [spots, setSpots] = useState<SpotState[]>([]);
 * const toast = useRef<Toast>(null);
 * const getSpots = useGetSpots(setSpots, toast);
 * 
 * // Pobierz miejsca na jutro, 8:00-16:00
 * const tomorrow = new Date();
 * tomorrow.setDate(tomorrow.getDate() + 1);
 * const start = new Date();
 * start.setHours(8, 0);
 * const end = new Date();
 * end.setHours(16, 0);
 * 
 * getSpots(tomorrow, start, end);
 * ```
 */
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