import {type ChangeEvent, useState} from "react";
import {DemoNoteModel} from "../models/DemoNoteModel.tsx";
import {ApiErrorModel} from "../models/ApiErrorModel.tsx";

// Prime components
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";

// Prime icons
import 'primeicons/primeicons.css';

export function Demo() {
    const initialNote = new DemoNoteModel("", "");

    const [note, setNote] = useState(initialNote);

    function setTitle(event: ChangeEvent<HTMLInputElement>) {
        const newNote = new DemoNoteModel(event.target.value, note.contents)
        setNote(newNote)
    }

    function setContents(event: ChangeEvent<HTMLTextAreaElement>) {
        const newNote = new DemoNoteModel(note.title, event.target.value)
        setNote(newNote)
    }

    async function saveNote() {
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
    }

    async function getNote() {
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
    }

    return (
        <>
            <label htmlFor="note-title">title:</label>
            <InputText id="note-title" value={note.title} onChange={setTitle}/>
            <br/>

            <label htmlFor="note-contents">contents:</label>
            <InputTextarea id="note-contents" value={note.contents} onChange={setContents}/>
            <br/>

            <Button icon="pi pi-save" onClick={saveNote} label="Save note"/>
            <Button icon="pi pi-expand" onClick={getNote} label="Get note"/>
        </>
    );
}
