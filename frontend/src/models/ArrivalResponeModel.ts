export interface SuccessfulArrivalModel {
    status: "Ok";
    startTime: string;
    endTime: string;
    spot: number;
}

export interface TimeSpan {
    start: Date,
    end: Date
}

export interface TimeTableEntry {
    spot: number;
    spans: Array<TimeSpan>;
    //start: Date;
    //end: Date;
}

export interface NoPresentReservationModel {
    status: "NoReservation";
    reservations: Array<TimeTableEntry>;
}

export type ArrivalResponseModel = SuccessfulArrivalModel | NoPresentReservationModel;
