package parkflex.models.admin

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class AdminHistoryEntryModel(
    @Contextual
    val startTime: LocalDateTime,
    val durationMin: Int,
    val status: String,
    val spot: Int,
    val plate: String
)