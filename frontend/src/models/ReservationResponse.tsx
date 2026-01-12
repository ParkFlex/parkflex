/**
 * Reprezentuje rezerwację miejsca parkingowego zwróconą przez API.
 * 
 * @remarks
 * Interface definiujący strukturę danych rezerwacji otrzymywanej z backendu.
 * Zawiera ID rezerwacji, ID miejsca oraz przedział czasowy w formacie ISO.
 */
export interface ReservationResponse {
    /** Unikalny identyfikator rezerwacji */
    id: number;
    /** ID miejsca parkingowego */
    spot_id: number;
    /** Data i czas rozpoczęcia rezerwacji (ISO format) */
    start: string;
    /** Data i czas zakończenia rezerwacji (ISO format) */
    end: string;
}

/**
 * Odpowiedź API po pomyślnym utworzeniu rezerwacji.
 * 
 * @remarks
 * Zwracana przez endpoint POST /api/reservation.
 * Zawiera komunikat potwierdzający oraz pełne dane utworzonej rezerwacji.
 * 
 * @example
 * ```typescript
 * // Przykładowa odpowiedź:
 * {
 *   message: "Rezerwacja została utworzona pomyślnie",
 *   reservation: {
 *     id: 123,
 *     spot_id: 42,
 *     start: "2026-01-13T10:00:00",
 *     end: "2026-01-13T12:00:00"
 *   }
 * }
 * ```
 */
export interface CreateReservationSuccessResponse {
    /** Komunikat potwierdzający utworzenie rezerwacji */
    message: string;
    /** Dane utworzonej rezerwacji */
    reservation: ReservationResponse;
}
