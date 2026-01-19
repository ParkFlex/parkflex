import { type AxiosResponse } from "axios";
import type { PenaltyInformation, PreludeModel } from "../models/PreludeModel.ts";
import { useCallback, useEffect, useState } from "react";
import { useAxios } from "./useAxios.ts";

export const usePrelude = () => {
    const axios = useAxios();
    const [prelude, setPrelude] = useState<PreludeModel | null>(null);

    const emptyPrelude: PreludeModel = {
        minReservationTime: 30,
        maxReservationTime: 720,
        penaltyInformation: null
    };

    const onThen = (x: AxiosResponse) => {
        const data = x.data;
        const penaltyInformation: PenaltyInformation | null = data.penaltyInformation && ({
            fine: Number(data.penaltyInformation.fine),
            due: new Date(data.penaltyInformation.due),
            reason: data.penaltyInformation.fine
        });

        const got: PreludeModel = {
            minReservationTime: Number(data.minReservationTime),
            maxReservationTime: Number(data.maxReservationTime),
            penaltyInformation: penaltyInformation
        };

        setPrelude(got);
    };

    const getPrelude = useCallback(() => {
        axios.get("/prelude").then(onThen);
    }, [axios]);

    useEffect(() => {
        getPrelude();
    }, []);


    return { prelude: prelude || emptyPrelude, getPrelude };
};