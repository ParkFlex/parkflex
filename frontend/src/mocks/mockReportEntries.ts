import type { ReportEntry } from "../models/ReportEntry";

// Mock data for testing
export const mockReportEntries: ReportEntry[] = [
    {
        plate: "WA12345",
        issueTime: new Date("2025-12-10T08:30:00"),
        banned: false,
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "KR98765",
        issueTime: new Date("2025-12-09T14:15:00"),
        banned: true,
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "GD55555",
        issueTime: new Date("2025-12-08T11:00:00"),
        banned: false,
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "PO11111",
        issueTime: new Date("2025-12-07T16:45:00"),
        banned: true,
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "WR22222",
        issueTime: new Date("2025-12-06T09:20:00"),
        banned: false,
        photoUrl: "https://http.cat/status/104"
    }
];

