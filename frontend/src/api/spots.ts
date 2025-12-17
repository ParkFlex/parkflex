// mocki, pozniej fetch

export type SpotRole = "normal" | "blank";

export interface Spot {
    id: number;
    role: SpotRole;
    reservations: {
        start: string;
        time: number;
    }[];
}

export interface SpotState {
    id: number;
    role: SpotRole;
    occupied: boolean;
}

export interface SpotProps {
    id: number;
    role: SpotRole;
    occupied: boolean;
    selectedId: number | null;
    onSelect: (id: number) => void;
}

export const getSpot = async (id: number): Promise<Spot> => {
    const url = `/api/spot?spot_id=${id}`;
    console.log("Fetching spot from ", url);
    return {
        id: 1,
        role: "normal",
        reservations: [
            {
                start: "2025-11-16T7:30",
                time: 30000,
            },
        ],
    };
};

export const getSpots = async (
    start: Date,
    end: Date
): Promise<SpotState[]> => {
    const url = `/api/spots?start=${start}&end=${end}`;
    console.log("Fetching spots from ", url);
    return [
        { id: 1, role: "normal", occupied: false },
        { id: 2, role: "normal", occupied: false },
        { id: 3, role: "normal", occupied: false },
        { id: 4, role: "normal", occupied: false },
        { id: 5, role: "normal", occupied: false },
        { id: 6, role: "normal", occupied: false },
        { id: 7, role: "normal", occupied: false },
        { id: 8, role: "normal", occupied: false },
        { id: 9, role: "normal", occupied: false },
        { id: 10, role: "normal", occupied: false },
        { id: 11, role: "normal", occupied: false },
        { id: 12, role: "normal", occupied: false },
        { id: 13, role: "normal", occupied: false },
        { id: 14, role: "normal", occupied: false },
        { id: 15, role: "normal", occupied: false },
        { id: 16, role: "normal", occupied: false },
        { id: 17, role: "normal", occupied: false },
        { id: 18, role: "normal", occupied: false },
        { id: 19, role: "normal", occupied: true },
        { id: 20, role: "normal", occupied: false },
        { id: 21, role: "normal", occupied: false },
        { id: 22, role: "normal", occupied: false },
        { id: 23, role: "normal", occupied: false },
        { id: 24, role: "normal", occupied: true },
        { id: 25, role: "normal", occupied: false },
        { id: 26, role: "normal", occupied: false },
        { id: 27, role: "normal", occupied: false },
        { id: 28, role: "normal", occupied: true },
        { id: 29, role: "normal", occupied: false },
        { id: 30, role: "normal", occupied: true },
        { id: 31, role: "normal", occupied: false },
        { id: 32, role: "normal", occupied: false },
        { id: 33, role: "normal", occupied: false },
        { id: 34, role: "normal", occupied: true },
        { id: 35, role: "normal", occupied: false },
        { id: 36, role: "normal", occupied: false },
        { id: 37, role: "normal", occupied: false },
        { id: 38, role: "normal", occupied: true },
        { id: 39, role: "normal", occupied: false },
        { id: 40, role: "normal", occupied: true },
    ];
};
