import { useAxios } from "../hooks/useAxios.ts";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { ArrivalResponseModel } from "../models/ArrivalResponeModel.ts";
import { type AxiosResponse, isAxiosError } from "axios";
import {Card} from "primereact/card";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";

export function ArrivalPage() {
    const axios = useAxios();
    const navigate = useNavigate();
    const [data, setData] = useState<ArrivalResponseModel | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const { token } = useParams();

    const dataComponent = (data: ArrivalResponseModel) => {
        switch (data.status) {
            case "Ok":
                return <a>{data.status}, {data.startTime}, {data.endTime}, {data.spot}</a>;
            case "NoReservation":
                return <Card>
                    {/*{data.status}*/}
                    <h1 style={{textAlign:'center', marginBottom:'45px'}}>Brak Aktywnej Rezerwacji</h1>
                    <Card style={{display:'flex', flexDirection:'column', backgroundColor:'white'}}>
                        <div style={{marginBottom:'15px', textAlign:'center', fontWeight:'bold' }}>Wbierz godzinę końcową:</div>
                        <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                            <Calendar inline timeOnly></Calendar>
                        </div>
                        <div style={{marginTop:'15px', width:'100%', display:'flex', justifyContent:'space-between'}}>
                            <Button style={{width:'48%', backgroundColor:'white', justifyContent:'center'}} outlined onClick={() => navigate('/parking')}>Anuluj</Button>
                            <Button style={{width:'48%', justifyContent:'center'}}>Akceptuj</Button>
                        </div>
                    </Card>
                </Card>;
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