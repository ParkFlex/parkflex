// mocki, pozniej fetch

export type SpotRole = "normal" | "blank" | "gate";

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

export const getSpots = async (
    start: Date,
    end: Date
): Promise<SpotState[]> => {
    const url = `/api/spots?start=${start}&end=${end}`;
    console.log("Fetching spots from ", url);
    const mockData = [
        { id: 1, role: "normal", displayOrder: 1, occupied: false },
        { id: 2, role: "normal", displayOrder: 2, occupied: false },
        { id: 3, role: "normal", displayOrder: 3, occupied: false },
        { id: 4, role: "normal", displayOrder: 4, occupied: false },
        { id: 5, role: "normal", displayOrder: 6, occupied: false },
        { id: 6, role: "normal", displayOrder: 7, occupied: false },
        { id: 7, role: "normal", displayOrder: 8, occupied: false },
        { id: 8, role: "normal", displayOrder: 9, occupied: false },
        { id: 9, role: "normal", displayOrder: 20, occupied: false },
        { id: 10, role: "normal", displayOrder: 22, occupied: false },
        { id: 11, role: "normal", displayOrder: 23, occupied: false },
        { id: 12, role: "normal", displayOrder: 24, occupied: false },
        { id: 13, role: "normal", displayOrder: 26, occupied: false },
        { id: 14, role: "normal", displayOrder: 27, occupied: false },
        { id: 15, role: "normal", displayOrder: 28, occupied: false },
        { id: 16, role: "normal", displayOrder: 29, occupied: false },
        { id: 17, role: "normal", displayOrder: 30, occupied: false },
        { id: 18, role: "normal", displayOrder: 32, occupied: false },
        { id: 19, role: "normal", displayOrder: 33, occupied: false },
        { id: 20, role: "normal", displayOrder: 34, occupied: false },
        { id: 21, role: "normal", displayOrder: 36, occupied: false },
        { id: 22, role: "normal", displayOrder: 37, occupied: false },
        { id: 23, role: "normal", displayOrder: 38, occupied: false },
        { id: 24, role: "normal", displayOrder: 39, occupied: false },
        { id: 25, role: "normal", displayOrder: 50, occupied: false },
        { id: 26, role: "normal", displayOrder: 51, occupied: false },
        { id: 27, role: "normal", displayOrder: 52, occupied: false },
        { id: 28, role: "normal", displayOrder: 53, occupied: false },
        { id: 29, role: "normal", displayOrder: 54, occupied: false },
        { id: 30, role: "normal", displayOrder: 56, occupied: false },
        { id: 31, role: "normal", displayOrder: 57, occupied: false },
        { id: 32, role: "normal", displayOrder: 58, occupied: false },
        { id: 33, role: "normal", displayOrder: 59, occupied: false },
        { id: 34, role: "gate", displayOrder: 0, occupied: false },
        { id: 35, role: "blank", displayOrder: 5, occupied: false },
        { id: 36, role: "blank", displayOrder: 10, occupied: false },
        { id: 37, role: "blank", displayOrder: 11, occupied: false },
        { id: 38, role: "blank", displayOrder: 12, occupied: false },
        { id: 39, role: "blank", displayOrder: 13, occupied: false },
        { id: 40, role: "blank", displayOrder: 14, occupied: false },
        { id: 41, role: "blank", displayOrder: 15, occupied: false },
        { id: 42, role: "blank", displayOrder: 16, occupied: false },
        { id: 43, role: "blank", displayOrder: 17, occupied: false },
        { id: 44, role: "blank", displayOrder: 18, occupied: false },
        { id: 45, role: "blank", displayOrder: 19, occupied: false },
        { id: 46, role: "blank", displayOrder: 21, occupied: false },
        { id: 47, role: "blank", displayOrder: 25, occupied: false },
        { id: 48, role: "blank", displayOrder: 31, occupied: false },
        { id: 49, role: "blank", displayOrder: 35, occupied: false },
        { id: 50, role: "blank", displayOrder: 40, occupied: false },
        { id: 51, role: "blank", displayOrder: 41, occupied: false },
        { id: 52, role: "blank", displayOrder: 42, occupied: false },
        { id: 53, role: "blank", displayOrder: 43, occupied: false },
        { id: 54, role: "blank", displayOrder: 44, occupied: false },
        { id: 55, role: "blank", displayOrder: 45, occupied: false },
        { id: 56, role: "blank", displayOrder: 46, occupied: false },
        { id: 57, role: "blank", displayOrder: 47, occupied: false },
        { id: 58, role: "blank", displayOrder: 48, occupied: false },
        { id: 59, role: "blank", displayOrder: 49, occupied: false },
        { id: 60, role: "blank", displayOrder: 55, occupied: false },
    ];

    mockData.sort((a, b) => a.displayOrder - b.displayOrder);
    console.log("Sorted mock data: ", mockData);
    return mockData as SpotState[];
};
