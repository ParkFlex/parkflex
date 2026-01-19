package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.PenaltyReason
import java.time.LocalDateTime


/**
 * General information required by multiple views.
 */
@Serializable
data class PreludeModel(
    /** Minimal reservation time imposed by the server. */
    val minReservationTime: Long,

    /** Minimal reservation time imposed by the server. */
    val maxReservationTime: Long,

    /**
     * Information about the current user penalty. `null`
     * if no penalty is active.
     */
    val penaltyInformation: PenaltyInformation?
) {
    @Serializable
    data class PenaltyInformation(
        val fine: Long,
        @Contextual
        val due: LocalDateTime,
        val reason: PenaltyReason
    )
}