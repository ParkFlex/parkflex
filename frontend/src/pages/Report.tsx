import {Card} from "primereact/card";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {useRef, useState} from "react";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {ConfirmDialog} from "primereact/confirmdialog";
import axios from "axios";

export function Report(){
    const [plate, setPlate] = useState('');
    const [comment, setComment] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [base64Data, setBase64Data] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    // const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const onChoose = () => inputRef.current?.click();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);

        // Convert file to base64 when selected
        if (f) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Data(reader.result as string);
            };
            reader.readAsDataURL(f);
        } else {
            setBase64Data(null);
        }
    };

    // const onUpload = async () => {
    //     if (!file || !base64Data) return;
    //
    //     setUploading(true);
    //     try {
    //         await axios.post('/api/upload', {
    //             filename: file.name,
    //             data: base64Data,
    //             plate: plate,
    //             comment: comment
    //         });
    //     } finally {
    //         setUploading(false);
    //     }
    // };

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
                    {/*<Button label="Wyślij zdjęcie" onClick={onUpload} disabled={!base64Data || uploading} loading={uploading} style={{width:'50%'}}/>*/}
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
                <Button severity='secondary' style={{justifyContent:'center'}} onClick={()=>setVisible(true)}>ZGŁOŚ UŻYTKOWNIKA</Button>
                <ConfirmDialog  visible={visible} onHide={() => setVisible(false)} header={"Czy na pewno chcesz zgłosić tego użytkownika?"} acceptLabel={'Tak'} rejectLabel={'Nie'} style={{width:'90%'}}/>
            </div>

        </Card>
    )
}