package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.PenaltyReason
import java.time.LocalDateTime

@Serializable
data class AdminReportEntryPenalty(
    val id: Long,
    val reservation: Long,
    val reason: PenaltyReason,
    val paid: Boolean,
    @Contextual
    val due: LocalDateTime,
    val fine: Long
)

@Serializable
data class AdminReportEntry(
    val id: Long,
    val plate: String,
    @Contextual
    val timestamp: LocalDateTime,
    val description: String,
    val submitterPlate: String,
    val image: String,
    val reviewed: Boolean,
    val penalty : AdminReportEntryPenalty?
)
