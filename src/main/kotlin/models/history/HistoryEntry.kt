package parkflex.models.history

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
enum class HistoryEntryStatus {
    Planned,
    InProgress,
    Past,
    Penalty
}

/**
 * Represents a single entry in user's reservation history.
 *
 * @property startTime When the reservation started
 * @property durationMin Duration of the reservation in minutes
 * @property status Reservation status
 * @property spot Parking spot ID
 */
@Serializable
data class HistoryEntry(
    @Contextual
    val startTime: LocalDateTime,
    val durationMin:Int,
    val status: HistoryEntryStatus,
    val spot: Long
)