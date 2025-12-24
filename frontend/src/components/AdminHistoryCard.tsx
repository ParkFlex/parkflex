import {Card} from "primereact/card";
import {formatTime, addMinutes, formatDate} from "../utils/dateUtils.ts";
import {useAdminHistory} from "../hooks/useAdminHistory.ts";

export function AdminHistoryCard({ plate, startTime }: { plate: string, startTime: Date }){

    const entries  = useAdminHistory();
    const entry = entries.find(e => (e.plate === plate && new Date(e.startTime).getTime() === new Date(startTime).getTime()));

    if(!entry){
        return (
            <div style={{textAlign:"left"}}>
                <Card title={`Rezerwacja nie znaleziona`}>
                </Card>
            </div>
        )
    }


    const endTime = addMinutes(new Date(entry.startTime), entry.durationMin);

    return (
        <div style={{textAlign:"left"}}>
            <Card title={`${formatDate(entry.startTime)}`} subTitle={`${formatTime(entry.startTime)}-${formatTime(endTime)}`} style={{marginBottom:'1.5rem', fontSize:"20px"}}>
                <div> Rejestracja użytkownika: {entry.plate} </div>
                <div> Miejsce parkingowe: {entry.spot} </div>
            </Card>
        </div>
    )
}