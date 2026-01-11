package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.PenaltyEntity
import java.time.LocalDateTime

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
    val penalty : PenaltyEntity?

)
