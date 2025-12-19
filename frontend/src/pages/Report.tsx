import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {useRef, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {ConfirmDialog} from "primereact/confirmdialog";
import {useReport} from "../hooks/useReport.ts";
import type {ReportEntry} from "../models/ReportEntry.tsx";


export function Report(){
    const [plate, setPlate] = useState('');
    const [comment, setComment] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { submitReport, loading, error } = useReport();

    const onChoose = () => inputRef.current?.click();

    // Build a ReportEntry object from current state. issueTime is set to now on submit.
    const buildReport = (): ReportEntry => ({
        plate: plate,
        issueTime: new Date(),
        comment: comment,
        whoReported: "1",
        photo: photo || undefined,
    });

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);

        if (f) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(f);
        } else {
            setPhoto(null);
        }
    };

    const doSubmit = async () => {

        try {
            const report = buildReport();
            await submitReport(report);
            setVisible(false);
            setPlate('');
            setComment('');
            setFile(null);
            setPhoto(null);
        } catch (e) {
            console.error('Submit failed', e);
        }
    };

    return(
        <Card>
            <h1 style={{fontSize:'24px', margin:'0rem', marginBottom:'32px', textAlign:'center'}}>Zgłoś użytkownika</h1>
            <div style={{display:'flex',flexDirection:'column', gap:'24px'}}>
                <FloatLabel>
                    <InputText id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} style={{width:'100%'}}/>
                    <label htmlFor="plate">Rejestracja osoby zgłaszanej</label>
                </FloatLabel>
                <FloatLabel>
                    <InputTextarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={5} cols={30} style={{width:'100%'}}/>
                    <label htmlFor="comment">Komentarz i uwagi</label>
                </FloatLabel>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                    <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={onFileChange}/>
                    <Button label={file ? "Zmień zdjęcie" : "Wybierz zdjęcie"} onClick={onChoose} style={{width:'100%'}}/>
                </div>
                {!file && (
                    <div style={{ backgroundColor:'white', padding:'10px', borderRadius:'3px'}}>
                        <span style={{fontSize:'1rem', color:'#666'}}>Nie wybrano zdjęcia</span>
                    </div>
                )}
                {file && (
                    <div style={{ backgroundColor:'white', padding:'10px', borderRadius:'3px', border:'2px solid #4b807b'}}>
                        <div style={{fontSize:'1rem', color:'#666'}}>Wybrane zdjęcie to: {file.name}</div>
                    </div>
                )}
                {error && (
                    <div style={{color:'red'}}>{error.message}</div>
                )}
                <Button severity='secondary' style={{justifyContent:'center'}} onClick={()=>setVisible(true)} disabled={loading}>{loading ? 'Wysyłanie...' : 'ZGŁOŚ UŻYTKOWNIKA'}</Button>
                <ConfirmDialog  visible={visible} onHide={() => setVisible(false)} header={"Czy na pewno chcesz zgłosić tego użytkownika?"} acceptLabel={'Tak'} rejectLabel={'Nie'} style={{width:'90%'}} accept={doSubmit} />
            </div>

        </Card>
    )
}