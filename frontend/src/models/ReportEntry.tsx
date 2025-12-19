import type {Penalty} from "./Penalty.tsx";

export interface ReportEntry{
    plate: string;
    issueTime: Date;
    comment: string;
    whoReported: string;
    image: string;
    reviewed: boolean;
    penalty?: Penalty;
}
