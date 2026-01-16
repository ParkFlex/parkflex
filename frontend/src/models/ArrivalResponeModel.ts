export interface SuccessfulArrivalModel {
    status: "Ok";
    startTime: string;
    endTime: string;
    spot: number;
}

export interface NoPresentReservationModel {
    status: "NoReservation";
}

export type ArrivalResponseModel = SuccessfulArrivalModel | NoPresentReservationModel;
