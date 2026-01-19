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
export type SpotRole = "normal" | "blank" | "gate" | "arrow-RD" | "arrow-UR" | "arrow-LU" | "arrow-DL" | "special";