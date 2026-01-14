package parkflex.models

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class QuickReservationModel(
    val spot: Long,
    @Contextual
    val end: LocalDateTime,
)
