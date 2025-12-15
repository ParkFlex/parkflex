import { useCallback, useState } from "react";
import { DemoNoteModel } from "../models/DemoNoteModel.tsx";
import { ApiErrorModel } from "../models/ApiErrorModel.tsx";

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