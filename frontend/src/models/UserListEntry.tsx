import type {Penalty} from "./Penalty.tsx";

export interface UserListEntry{
    plate:string;
    role:string;
    blocked:boolean;
    name:string;
    mail:string;
    currentPenalty?:Penalty;
    numberOfPastReservations?:number;
    numberOfFutureReservations?:number;
    numberOfPastBans?:number;
    currentReservation:boolean;

}
