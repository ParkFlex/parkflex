import { useAxios } from "../hooks/useAxios.ts";
import { useEffect, useState } from "react";
import type { ArrivalResponseModel } from "../models/ArrivalResponeModel.ts";
import { useParams } from "react-router";
import { isAxiosError } from "axios";

export function LeavePage() {
    const axios = useAxios();
    const [err, setErr] = useState<string | null>(null);

    const { token } = useParams();

    useEffect(() => {
        axios
            .post<ArrivalResponseModel>(`/leave/${token}`)
            .catch(e => (isAxiosError(e)) && setErr(e.response?.data?.message));
    }, [axios, token]);

    return (
        <>
            <a>{err || ""}</a>
        </>
    );
}