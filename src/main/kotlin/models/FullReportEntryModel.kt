package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import parkflex.db.PenaltyEntity
import java.time.LocalDateTime


@Serializable
data class FullReportEntryModel (
    val plate: String,
    val description : String,
    val image : String,
    @Contextual
    val timestamp: LocalDateTime,
    val penalty : PenaltyEntity?,
    val submitter: Long
    )