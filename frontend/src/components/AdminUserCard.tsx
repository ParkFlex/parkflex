import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { type ChangeEvent, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useUserList } from "../hooks/useUserList.ts";
import { formatDateTime } from "../utils/dateUtils.ts";

export function AdminUserCard({ plate }: { plate: string }){

    // include changePlate from the hook so we can send plate updates to backend
    const { userListEntries: users, cancelPenalty, changePlate }= useUserList();
    const user = users.find(u => u.plate === plate);
    const [visible, setVisible] = useState(false);
    const [newPlate, setNewPlate] = useState<string>('');
    const canSave = newPlate.trim().length > 0;
    const footerBan = (
        <>
            <Button severity='secondary' label="Odbanuj" onClick={() => {
                if (user && user.currentPenalty && user.currentPenalty.id) {
                    void cancelPenalty(user.currentPenalty.id);
                }
            }}/>
        </>
    );

    const footerEdit = (
        <>
            <Button label="Edytuj rejestrację" onClick={()=> setVisible(true)}/>
        </>
    );

    const footerDialog = (
        <div style={{ marginTop:'1rem', display:'flex', justifyContent:'center', gap:'1rem' }}>
            <Button label="Zapisz" severity="secondary" disabled={!canSave} onClick={()=> {
                if (user && user.id && canSave) {
                    void changePlate(user.id, newPlate.trim());
                }
                setNewPlate('');
                setVisible(false);
            }}/>
            <Button label="Anuluj" onClick={() => setVisible(false)}/>
        </div>
    );

    if(!user){
        return (
            <div style={{ textAlign:"left" }}>
                <Card title={`Użytkownik nie znaleziony`} style={{ marginTop:'1rem' }}>
                    Brak użytkownika o numerze {plate}
                </Card>
            </div>
        );
    }

    const banEnd = (
        user.currentPenalty ? formatDateTime(new Date(user.currentPenalty.due)) : ''
    );

    return (
        <div style={{ textAlign:"left" }}>
            <Card title={`${user.plate} - ${user.name}`} subTitle={user.mail} footer={footerEdit} style={{ marginBottom:'1.5rem' }}>
                {user.currentReservation && <div> Posiada aktywną rezerwację </div>}
                <div> Rezerwacje zakończone : {user.numberOfPastReservations} </div>
                <div> Rezerwacje zaplanowane : {user.numberOfFutureReservations} </div>
                <div> Zakończone bany : {user.numberOfPastBans} </div>
            </Card>
            {user.currentPenalty && <Card title="Użytkownik zbanowany" footer={footerBan} style={{ backgroundColor:'rgba(250,169,85,0.11)', color:"#faa955", marginBottom:'1.5rem' }}>
                <div> Data zakończenia banu: {banEnd}</div>
                <div> Kara pieniężna: {user.currentPenalty.fine}</div>
                <div> Powód banu: {user.currentPenalty.reason} </div>
            </Card>}

            <Dialog footer={footerDialog} visible={visible} onHide={() => setVisible(false)} style={{ width:'80%' }} showCloseIcon={false}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <InputText autoFocus={true} placeholder="Nowa rejestracja" value={newPlate} onChange={(e:ChangeEvent<HTMLInputElement>)=>setNewPlate(e.target.value)} style={{ border: '1px solid #ced4da', borderRadius: '4px', width: '100%', margin:'2px' }}/>
                </div>
            </Dialog>
        </div>
    );
}