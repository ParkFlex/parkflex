export interface Penalty{
    id: number;
    reservation: number;
    reason: string;
    paid: boolean;
    due: Date;
    fine: number;
}