import type { PenaltyReason } from "./PenaltyReason.ts";

export interface PenaltyInformation {
    fine: number,
    due: Date,
    reason: PenaltyReason,
}

/**
 * General information required by multiple views.
 */
export interface PreludeModel {
    /** Minimal reservation time imposed by the server. */
    minReservationTime: number,

    /** Minimal reservation time imposed by the server. */
    maxReservationTime: number,

    /**
     * Information about the current user penalty. `null`
     * if no penalty is active.
     */
    penaltyInformation: PenaltyInformation | null
}
