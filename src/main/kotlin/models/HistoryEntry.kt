package parkflex.models

import kotlinx.serialization.*
import java.time.LocalDateTime

/**
 * Represents a single entry in user's reservation history.
 *
 * @property startTime When the reservation started
 * @property durationMin Duration of the reservation in minutes
 * @property status Reservation status (TODO: define possible values)
 * @property spot Parking spot ID
 */
@Serializable
data class HistoryEntry(
    @Contextual
    val startTime: LocalDateTime,
    val durationMin:Int,
    val status: String,
    val spot: Long
)

