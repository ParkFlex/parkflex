import type { ReportEntry } from "../models/ReportEntry";

// Mock data for testing
export const mockReportEntries: ReportEntry[] = [
    {
        plate: "WA12345",
        issueTime: new Date("2025-12-10T08:30:00"),
        whoReported: "124567",
        comment: "Parked in a no-parking zone",
        image: "https://http.cat/status/104",
        reviewed: true

    },
    {
        plate: "KR98765",
        issueTime: new Date("2025-12-09T14:15:00"),
        whoReported: "124567",
        comment: "Blocking driveway entrance",
        image: "https://http.cat/status/104",
        reviewed: false
    },
    {
        plate: "GD55555",
        issueTime: new Date("2025-12-08T11:00:00"),
        whoReported: "124567",
        comment: "Double parked on main street",
        image: "https://http.cat/status/104",
        reviewed: true
    },
    {
        plate: "PO11111",
        issueTime: new Date("2025-12-07T16:45:00"),
        whoReported: "124567",
        comment: "",
        image: "https://http.cat/status/104",
        reviewed: false
    },
    {
        plate: "WR22222",
        issueTime: new Date("2025-12-06T09:20:00"),
        whoReported: "124567",
        comment: "Expired parking meter",
        image: "https://http.cat/status/104",
        reviewed: true,
        penalty: {
            reservation: 2,
            reason: "stupid",
            paid: false,
            due: new Date("2025-12-20T00:00:00"),
            fine: 360
        }

    }
];

