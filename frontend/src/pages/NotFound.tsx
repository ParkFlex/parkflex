import { Link } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle.ts";

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
    useDocumentTitle("404");
    return (
        <>
            <span>Not found</span>
            <Link to="/parking">Parking view</Link>
        </>
    );
}
