export interface Penalty{
    id: number;
    reservation: number;
    reason: string;
    paid: boolean;
    due: string;
    fine: number;
}