import type {Penalty} from "./Penalty.tsx";

export interface ReportEntry{
    id: number;
    plate: string;
    timestamp: Date;
    description: string;
    submitterPlate: string;
    image: string;
    reviewed: boolean;
    penalty?: Penalty;
}
