package parkflex.models

import kotlinx.serialization.Serializable

@Serializable
data class HistoryEntryModel(
    val startTime: String,
    val durationMin: Int,
    val status: String,
    val spot: Long
)

