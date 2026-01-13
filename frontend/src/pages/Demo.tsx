// Prime components
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

// Prime icons
import 'primeicons/primeicons.css';
import { useNote } from "../hooks/useNote.tsx";
import { DemoNoteModel } from "../models/DemoNoteModel.tsx";

/**
 * Strona demonstracyjna do testowania funkcjonalności notatek.
 * 
 * @remarks
 * Komponent demo umożliwiający:
 * - Wprowadzenie tytułu i treści notatki
 * - Zapis notatki do backendu (PUT /api/demo)
 * - Pobranie notatki po tytule (GET /api/demo)
 * 
 * Używany głównie do celów testowych i demonstracyjnych.
 * 
 * @example
 * ```tsx
 * <Route path="/demo" element={<Demo />} />
 * ```
 */
export function Demo() {
    const { saveNote, getNote, setNote, note } = useNote();

    const setTitle = (title: string) => {
        const newNote = new DemoNoteModel(title, note.contents);
        setNote(newNote);
    };

    const setContents = (contents: string) => {
        const newNote = new DemoNoteModel(note.title, contents);
        setNote(newNote);
    };

    return (
        <>
            <label htmlFor="note-title">title:</label>
            <InputText
                id="note-title"
                value={note.title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <br/>

            <label htmlFor="note-contents">contents:</label>
            <InputTextarea
                id="note-contents"
                value={note.contents}
                onChange={ev => setContents(ev.target.value)}
            />
            <br/>

            <Button icon="pi pi-save" onClick={saveNote} label="Save note"/>
            <Button icon="pi pi-expand" onClick={getNote} label="Get note"/>
        </>
    );
}
