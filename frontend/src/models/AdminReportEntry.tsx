import type {Penalty} from "./Penalty.tsx";

export interface AdminReportEntry {
    id: number;
    plate: string;
    timestamp: string;
    description: string;
    submitterPlate: string;
    image: string;
    reviewed: boolean;
    penalty?: Penalty;
}
