import type { ReportEntry } from "../models/ReportEntry";

// Mock data for testing
export const mockReportEntries: ReportEntry[] = [
    {
        plate: "WA12345",
        issueTime: new Date("2025-12-10T08:30:00"),
        whoReported: "124567",
        comment: "Parked in a no-parking zone",
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "KR98765",
        issueTime: new Date("2025-12-09T14:15:00"),
        whoReported: "124567",
        comment: "Blocking driveway entrance",
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "GD55555",
        issueTime: new Date("2025-12-08T11:00:00"),
        whoReported: "124567",
        comment: "Double parked on main street",
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "PO11111",
        issueTime: new Date("2025-12-07T16:45:00"),
        whoReported: "124567",
        comment: "",
        photoUrl: "https://http.cat/status/104"
    },
    {
        plate: "WR22222",
        issueTime: new Date("2025-12-06T09:20:00"),
        whoReported: "124567",
        comment: "Expired parking meter",
        photoUrl: "https://http.cat/status/104"
    }
];

