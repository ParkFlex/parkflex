import {Card} from "primereact/card";
import {useState} from "react";
import type {AdminHistoryEntry} from "../models/AdminHistoryEntry.tsx";
import {mockHistoryList} from "../mocks/historyListMock.ts";

export function AdminHistoryCard({ plate, startTime }: { plate: string, startTime: Date }){

    const [entries] = useState<AdminHistoryEntry[]>(mockHistoryList);
    const entry = entries.find(e => (e.plate === plate && new Date(e.startTime).getTime() === new Date(startTime).getTime()));

    if(!entry){
        return (
            <div style={{textAlign:"left"}}>
                <Card title={`Rezerwacja nie znaleziona`}>
                </Card>
            </div>
        )
    }


    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };
    const addMinutes = (date: Date, minutes: number): Date => {
        return new Date(date.getTime() + minutes * 60000);
    };
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('pl-EU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
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