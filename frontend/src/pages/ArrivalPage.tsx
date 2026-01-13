import { useAxios } from "../hooks/useAxios.ts";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { ArrivalResponseModel } from "../models/ArrivalResponeModel.ts";
import { type AxiosResponse, isAxiosError } from "axios";

export function ArrivalPage() {
    const axios = useAxios();
    const [data, setData] = useState<ArrivalResponseModel | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const { token } = useParams();

    const dataComponent = (data: ArrivalResponseModel) => {
        switch (data.status) {
            case "Ok":
                return <a>{data.status}, {data.startTime}, {data.endTime}, {data.spot}</a>;
            case "NoReservation":
                return <a>
                    {data.status},
                    {
                        data.reservations.reduce((acc, value) => {
                            const spans = value.spans.map(s => `${s.start}-${s.end}`).join(", ");
                            return acc + `${value.spot}, ${spans}`;
                        }, "")
                    }</a>;
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