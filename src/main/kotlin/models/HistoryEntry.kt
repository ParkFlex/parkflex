package parkflex.models

import kotlinx.serialization.*
import java.time.LocalDateTime

@Serializable
data class HistoryEntry(
    @Contextual
    val startTime: LocalDateTime,
    val durationMin:Int,
    val status: String,
    val spot: Long
)

