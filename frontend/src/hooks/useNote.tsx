import { useCallback, useState } from "react";
import { DemoNoteModel } from "../models/DemoNoteModel.tsx";
import { ApiErrorModel } from "../models/ApiErrorModel.tsx";

/**
 * Hook do zarządzania notatkami w sekcji demo.
 * 
 * @returns Obiekt z funkcjami saveNote, getNote, setNote oraz aktualną notatką
 * 
 * @remarks
 * TODO: Hook używa fetch API zamiast Axios (niespójność z resztą aplikacji).
 * Należy rozważyć refaktoryzację do useAxios.
 * 
 * Funkcjonalności:
 * - `saveNote()` - Zapisuje aktualną notatkę przez PUT /api/demo
 * - `getNote()` - Pobiera notatkę po tytule przez GET /api/demo
 * - `setNote()` - Ustawia lokalny stan notatki
 * - `note` - Aktualna notatka
 * 
 * @example
 * ```tsx
 * const { note, setNote, saveNote, getNote } = useNote();
 * 
 * // Zmień tytuł i zapisz
 * setNote(new DemoNoteModel("Nowy tytuł", "Zawartość"));
 * saveNote();
 * 
 * // Pobierz istniejącą notatkę
 * setNote(new DemoNoteModel("Szukany tytuł", ""));
 * getNote();
 * ```
 */
export function useNote() {
    const initialNote = new DemoNoteModel("", "");

    const [note, setNote] = useState(initialNote);

    const saveNote = useCallback(() => {
        const fetchAndSet = async () => {
            const noteJson: string = JSON.stringify(note);

            const requestURL: string = "/api/demo";

            const requestOptions: RequestInit = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: noteJson
            };

            const response = await fetch(requestURL, requestOptions);

            if (!response.ok) {
                const object = await response.json();

                alert(object.message);
            }
        };

        void fetchAndSet();
    }, [note]);

    const getNote = useCallback(() => {
        const getAndSet = async () => {
            const requestURL: string = `/api/demo?title=${note.title}`;

            const response = await fetch(requestURL);

            const object = await response.json();

            if (response.ok) {
                const newNote = new DemoNoteModel(object.title, object.contents);
                setNote(newNote);
            } else {
                const error = new ApiErrorModel(object.message, object.context);
                alert(error.message);
            }
        };

        void getAndSet();
    }, [note]);

    return { saveNote, getNote, setNote, note };
}