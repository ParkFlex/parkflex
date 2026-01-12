/**
 * Moduł do zarządzania danymi o miejscach parkingowych.
 * TODO: Zastąpić mocki prawdziwym fetchem z API
 * @module api/spots
 */

/**
 * Typ określający rolę/typ miejsca parkingowego.
 * 
 * @remarks
 * Dostępne typy:
 * - `normal` - Standardowe miejsce parkingowe
 * - `blank` - Puste miejsce (np. droga)
 * - `gate` - Brama/wjazd
 * - `arrow-RD` - Strzałka w prawo-dół (oznaczenie kierunku)
 * - `arrow-UR` - Strzałka w górę-prawo
 * - `arrow-LU` - Strzałka w lewo-górę
 * - `arrow-DL` - Strzałka w dół-lewo
 */
export type SpotRole = "normal" | "blank" | "gate" | "arrow-RD" | "arrow-UR" | "arrow-LU" | "arrow-DL";

/**
 * Pełne dane miejsca parkingowego z historią rezerwacji.
 * 
 * @remarks
 * Używane do pobierania szczegółowych informacji o pojedynczym miejscu,
 * włączając w to listę wszystkich rezerwacji.
 */
export interface Spot {
    /** Unikalny identyfikator miejsca */
    id: number;
    /** Typ/rola miejsca */
    role: SpotRole;
    /** Kolejność wyświetlania w gridzie */
    displayOrder: number;
    /** Lista rezerwacji dla tego miejsca */
    reservations: {
        /** Data i czas rozpoczęcia rezerwacji (ISO format) */
        start: string;
        /** Czas trwania rezerwacji w milisekundach */
        time: number;
    }[];
}

/**
 * Stan miejsca parkingowego w danym momencie.
 * 
 * @remarks
 * Używane do wyświetlania aktualnego statusu miejsc w siatce parkingu.
 * Zawiera informację czy miejsce jest zajęte w wybranym przedziale czasowym.
 */
export interface SpotState {
    /** Unikalny identyfikator miejsca */
    id: number;
    /** Typ/rola miejsca */
    role: SpotRole;
    /** Kolejność wyświetlania w gridzie */
    displayOrder: number;
    /** Czy miejsce jest zajęte w wybranym czasie */
    occupied: boolean;
}

/**
 * Pobiera szczegółowe informacje o miejscu parkingowym.
 * 
 * @param id - ID miejsca parkingowego
 * @returns Obiekt Spot z pełnymi danymi miejsca
 * 
 * @remarks
 * TODO: Aktualnie zwraca mockowane dane. Należy zaimplementować prawdziwe zapytanie do API.
 * 
 * @example
 * ```typescript
 * const spot = await getSpot(42);
 * console.log(spot.reservations);
 * ```
 */
export const getSpot = async (id: number): Promise<Spot> => {
    const url = `/api/spot?spot_id=${id}`;
    console.log("Fetching spot from ", url);
    return {
        id: 1,
        role: "normal",
        displayOrder: 1,
        reservations: [
            {
                start: "2025-11-16T7:30",
                time: 30000,
            },
        ],
    };
};