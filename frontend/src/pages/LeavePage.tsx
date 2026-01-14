import { useAxios } from "../hooks/useAxios.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { isAxiosError } from "axios";
import type {LeaveModel} from "../models/LeaveModel.ts";
import {Card} from "primereact/card";
import {formatDate} from "../utils/dateUtils.ts";

export function LeavePage() {
    const axios = useAxios();
    const [err, setErr] = useState<string | null>(null);
    const [model, setModel] = useState<LeaveModel | null>(null);

    const { token } = useParams();

    useEffect(() => {
        axios
            .post<LeaveModel>(`/leave/${token}`)
            .then(resp => setModel(resp.data))
            .catch(e => (isAxiosError(e)) && setErr(e.response?.data?.message));
    }, [axios, token]);

    return (
        <>
            <a>{err || ""}</a>
            {model
                ? <Card header={"Nałożono karę"}>
                    <p>
                        Z powodu przekroczenia czasu parkowania o {model.late}min, system nałożył na Ciebie karę.
                    </p>
                    <p>
                        Kara trwa do: {formatDate(new Date(model.due))}. Aby wcześniej ją zakończyć
                        możesz dokonać opłaty w wysokości {model.fine}PLN. Aby zapłacić przejdź do zakładki "Parking".
                    </p>
                  </Card>
                : <Card> Dziękujemy za przyjazd </Card> }
        </>
    );
}