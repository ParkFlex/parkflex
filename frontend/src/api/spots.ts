// mocki, pozniej fetch

export type SpotRole = "normal" | "blank" | "gate" | "arrow-RD" | "arrow-UR" | "arrow-LU" | "arrow-DL";

export interface Spot {
    id: number;
    role: SpotRole;
    displayOrder: number;
    reservations: {
        start: string;
        time: number;
    }[];
}

export interface SpotState {
    id: number;
    role: SpotRole;
    displayOrder: number;
    occupied: boolean;
}

export const getSpot = async (id: number): Promise<Spot> => {
    const url = `/api/spot?spot_id=${id}`;
    console.log("Fetching spot from ", url);
    return {
        id: 1,
        role: "normal",
        displayOrder: 1,
        reservations: [
            {
                start: "2025-11-16T7:30",
                time: 30000,
            },
        ],
    };
};