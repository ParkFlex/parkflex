import type { SpotRole } from "./SpotRole.ts";

/**
 * Stan miejsca parkingowego w danym momencie.
 *
 * @remarks
 * Używane do wyświetlania aktualnego statusu miejsc w siatce parkingu.
 * Zawiera informację czy miejsce jest zajęte w wybranym przedziale czasowym.
 */
export interface SpotState {
    id: number;
    role: SpotRole;
    displayOrder: number;
    occupied: boolean;
}