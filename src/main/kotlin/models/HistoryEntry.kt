package parkflex.models

import kotlinx.serialization.*
import java.time.LocalDateTime
import parkflex.LocalDateTimeSerializer


@Serializable
data class HistoryEntry(
    @Serializable(with = LocalDateTimeSerializer::class)
    val startTime: LocalDateTime,
    val durationMin:Int,
    val status: String,
    val spot: Long
)

