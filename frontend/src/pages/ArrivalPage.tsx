import { useAxios } from "../hooks/useAxios.ts";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { ArrivalResponseModel } from "../models/ArrivalResponeModel.ts";
import { type AxiosResponse, isAxiosError } from "axios";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useQuickReservation } from "../hooks/useQuickReservation.ts";
import { Card } from "primereact/card";
import {usePrelude} from "../hooks/usePrelude.ts";

export function ArrivalPage() {
    const axios = useAxios();
    const [data, setData] = useState<ArrivalResponseModel | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [time, setTime] = useState<Date | null>(null);
    const navigate= useNavigate();

    const { token } = useParams();
    const { quickReservation, sendQuickReservation } = useQuickReservation(token!, axios);

    const { prelude } = usePrelude();

    const dataComponent = (data: ArrivalResponseModel) => {
        switch (data.status) {
            case "Ok":
                return (
                    <Card style={{ height:'fit-content', display:'flex', justifyContent:'center', alignItems:'center' }}>
                        <Card style={{ backgroundColor:'white', display:'flex', alignItems:'center',height:'468px' }}>
                            <h1 style={{ textAlign:'center', marginBottom:'60px' }}>Rezerwacja Aktywna</h1>
                            <div style={{ marginBottom:'15px',textAlign:'center', fontSize:'1.5rem' }}>Twoje miejsce to:<b> {data.spot}</b></div>
                        </Card>
                    </Card>
                );

            case "NoReservation":
                if (quickReservation)
                    return (
                        <Card style={{ height:'fit-content', display:'flex', justifyContent:'center', alignItems:'center' }}>
                            <Card style={{ backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center', height:'468px' }}>
                                <h1 style={{ textAlign:'center', marginBottom:'50px' }}>Utworzono Rezerwację</h1>
                                <div style={{ textAlign:'center', fontSize:'1.5rem' }}>
                                    Do godziny: <b>{quickReservation.end}</b>
                                </div>
                                <div style={{ textAlign:'center', fontSize:'1.5rem' }}>
                                    Twoje miejsce to: <b>{quickReservation.spot}</b>
                                </div>
                            </Card>
                        </Card>
                    );
                else
                    return (
                        <Card style={{ height:'fit-content' }}>
                            {/*{data.status}*/}
                            <h1 style={{ textAlign:'center', marginBottom:'45px' }}>Brak Aktywnej Rezerwacji</h1>
                            <Card style={{ display:'flex', flexDirection:'column', backgroundColor:'white' }}>
                                <div style={{ marginBottom:'15px', textAlign:'center', fontWeight:'bold', fontSize:'1.5rem' }}>Wbierz godzinę końcową:</div>
                                <div style={{ width:'100%', display:'flex', justifyContent:'center' }}>
                                    <Calendar
                                        timeOnly
                                        inline
                                        value={time || (() => {
                                            const now = new Date();
                                            // +5 just to be a bit more sure
                                            now.setMinutes(now.getMinutes() + prelude.minReservationTime + 5);
                                            now.setMilliseconds(0);

                                            return now;
                                        })()}
                                        onChange={e => e.value && setTime(e.value)}
                                        minDate={(() => {
                                           const now = new Date();
                                            // +5 just to be a bit more sure
                                           now.setMinutes(now.getMinutes() + prelude.minReservationTime + 5);
                                           now.setMilliseconds(0);

                                           return now;
                                        })()}
                                        maxDate={(() => {
                                            const now = new Date();
                                            // -5 just to be a bit more sure
                                            now.setMinutes(now.getMinutes() + prelude.maxReservationTime - 5);
                                            now.setMilliseconds(0);

                                            return now;
                                        })()}

                                    />
                                </div>
                                <div style={{ marginTop:'30px', width:'100%', display:'flex', justifyContent:'space-between' }}>
                                    <Button style={{ width:'48%', backgroundColor:'white', justifyContent:'center' }} outlined onClick={() => navigate('/parking')}>Anuluj</Button>
                                    <Button style={{ width:'48%', justifyContent:'center' }} onClick={() => time && sendQuickReservation(time)} >Akceptuj</Button>
                                </div>
                            </Card>
                        </Card>
                    );

        }
    };

    useEffect(() => {
        const onFulfilled = (x: AxiosResponse<ArrivalResponseModel>) =>
            setData(x.data);

        const onRejected = (e: unknown) =>
            (isAxiosError(e)) && setErr(e.response?.data?.message);

        axios
            .post<ArrivalResponseModel>(`/arrive/${token}`)
            .then(onFulfilled)
            .catch(onRejected);
    }, [axios, token]);

    return (
        <>
            <a>{err || ""}</a>
            <br/>
            {(data != null) && dataComponent(data)}
        </>
    );
}