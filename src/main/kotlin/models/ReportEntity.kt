package parkflex.models

import kotlinx.serialization.Serializable
import kotlinx.serialization.Contextual
import java.time.LocalDateTime

@Serializable
data class ReportEntity (
    val plate : String,
    @Contextual
    val issueTime : LocalDateTime?,
    val comment : String,
    val whoReported : String,
    val photo: String?
    )