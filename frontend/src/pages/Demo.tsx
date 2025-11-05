import {type ChangeEvent, useState} from "react";
import {DemoNoteModel} from "../models/DemoNoteModel.tsx";
import {ApiErrorModel} from "../models/ApiErrorModel.tsx";

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
            title:
            <input type="text" defaultValue={note.title} onChange={setTitle}/>
            <br/>

            contents:
            <textarea value={note.contents} onChange={setContents}/>
            <br/>

            <button onClick={saveNote}>Save note</button>
            <button onClick={getNote}>Get note</button>
        </>
    );
}
