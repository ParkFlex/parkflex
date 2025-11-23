// mocki, pozniej fetch

export type SpotRole = "normal" | "blank"

export interface Spot {
  id: number;
  role: SpotRole;
  reservations: {
    start: string;
    time: number;
  }[]
}

export interface SpotState {
  id: number;
  role: SpotRole;
  occupied: boolean;
}

export const getSpot = async (id: number): Promise<Spot> => {
  const url = `/api/spot?spot_id=${id}`
  return {
    id: 1,
    role: "normal",
    reservations: [
      {
        start: "2025-11-16T7:30",
        time: 30000
      },
    ],
  }
}

export const getSpots = async (start: Date, end: Date): Promise<SpotState[]> => {
  const url = `/api/spots?start=${start}&end=${end}`
  return [
    { "id": 1, "role": "normal", "occupied": true },
    { "id": 2, "role": "normal", "occupied": false },
    { "id": 3, "role": "normal", "occupied": false }
  ]

}
