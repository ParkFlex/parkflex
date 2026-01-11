import type {Penalty} from "./Penalty.tsx";

export interface AdminUserEntry {
    id:number;
    plate:string;
    role:string;
    name:string;
    mail:string;
    currentPenalty?:Penalty;
    numberOfPastReservations?:number;
    numberOfFutureReservations?:number;
    numberOfPastBans?:number;
    currentReservation:boolean;
}
