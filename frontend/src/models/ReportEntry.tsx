export interface ReportEntry{
    plate: string;
    issueTime: Date;
    comment: string;
    whoReported: string;
    photo?: Base64URLString;
}