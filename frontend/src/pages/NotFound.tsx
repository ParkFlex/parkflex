import { Link } from "react-router";

/**
 * Strona 404 - wyświetlana dla nieznanych ścieżek.
 * 
 * @remarks
 * Prosty komponent wyświetlający komunikat o nieznalezionej stronie
 * z linkiem powrotnym do strony parkingu.
 * 
 * @example
 * ```tsx
 * <Route path="*" element={<NotFound />} />
 * ```
 */
export function NotFound() {
    return (
        <>
            <span>Not found</span>
            <Link to="/parking">Parking view</Link>
        </>
    );
}
