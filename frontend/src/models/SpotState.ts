import type { SpotRole } from "./SpotRole.ts";

export interface SpotState {
    id: number;
    role: SpotRole;
    displayOrder: number;
    occupied: boolean;
}