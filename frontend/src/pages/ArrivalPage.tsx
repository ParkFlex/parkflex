import {useAxios} from "../hooks/useAxios.ts";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import type {ArrivalResponseModel} from "../models/ArrivalResponeModel.ts";
import {type AxiosResponse, isAxiosError} from "axios";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {useQuickReservation} from "../hooks/useQuickReservation.ts";
import {Card} from "primereact/card";
import {formatTime} from "../utils/dateUtils.ts";

export function ArrivalPage() {
    const axios = useAxios();
    const [data, setData] = useState<ArrivalResponseModel | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [time, setTime] = useState<Date | null>(null);

    const {token} = useParams();
    const {quickReservation, sendQuickReservation} = useQuickReservation(token!, axios);

    const dataComponent = (data: ArrivalResponseModel) => {
        switch (data.status) {
            case "Ok":
                return <a>{data.status}, {data.startTime} - {data.endTime}, miejsce: {data.spot}</a>;
            case "NoReservation":
                if (quickReservation)
                    return (
                        <Card>
                            <div>
                                Utworzono rezerwację do godz. {quickReservation.end},
                                miejsce parkingowe nr. {quickReservation.spot}.
                            </div>
                        </Card>
                    );
                else
                    return (
                        <Card>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                {data.status}
                                <Calendar timeOnly inline onChange={e => e.value && setTime(e.value)}/>
                                <Button onClick={() => time && sendQuickReservation(time)} label={"Akceptuj"}/>
                            </div>
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