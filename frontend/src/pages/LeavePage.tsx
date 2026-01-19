import { useAxios } from "../hooks/useAxios.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { isAxiosError } from "axios";
import type { LeaveModel } from "../models/LeaveModel.ts";
import { Card } from "primereact/card";
import { formatDate } from "../utils/dateUtils.ts";
import { Divider } from "primereact/divider";

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
                ? <Card style={{ height:'500px', backgroundColor:'rgb(255, 172.87, 166.85)', display:'flex', justifyContent:'center', alignItems:'center' }}>
                    <Card style={{ height:'468px', backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center' }}>
                        <h1 style={{ textAlign:'center', marginBottom:'60px', color:'red' }}>Nałożono Karę</h1>
                        <div style={{ color:'red' }}>
                            Z powodu przekroczenia czasu parkowania o <b>{model.late} </b>min, system nałożył na Ciebie karę.
                        </div>
                        <Divider></Divider>
                        <div style={{ color:'red' }}>
                            Kara trwa do: <b>{formatDate(new Date(model.due))}</b>. Aby wcześniej ją zakończyć
                            możesz dokonać opłaty w wysokości <b>{model.fine}</b> PLN. Aby zapłacić przejdź do zakładki "Parking".
                        </div>
                    </Card>
                </Card>
                : <Card style={{ height: '500px', display:'flex', justifyContent:'center', alignItems:'center' }}>
                    <Card style={{ backgroundColor:'white', height:'468px', display:'flex', justifyContent:'center', alignItems:'center' }}>
                        <h1 style={{ display:'flex', textAlign:'center' }}>
                            Do zobaczenia następnym razem!
                        </h1>
                    </Card>
                </Card> }
        </>
    );
}